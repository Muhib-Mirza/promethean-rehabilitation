"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { PatientInfoTab } from "@/components/modules/patients/PatientInfoTab";
import { ComplaintTab } from "@/components/modules/patients/ComplaintTab";
import { ExaminationTab } from "@/components/modules/patients/ExaminationTab";
import { FollowUpTab } from "@/components/modules/patients/FollowUpTab";
import { ComparativeAnalysisTab } from "@/components/modules/patients/ComparativeAnalysisTab";
import { mergePrescriptionData } from "@/lib/prescriptionOptions";
import { canAccess } from "@/lib/auth/permissionSet";
import { SCREENS, ACTIONS } from "@/lib/auth/screens";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { DemoModeBanner } from "@/mock-data/DemoModeBanner";

const TABS = [
  { key: "info", label: "Patient Info", screenCode: SCREENS.PATIENTS_INFO },
  { key: "complaint", label: "Patient Complaint", screenCode: SCREENS.PATIENTS_COMPLAINT },
  { key: "examination", label: "Examination", screenCode: SCREENS.PATIENTS_EXAMINATION },
  { key: "followup", label: "Follow Up", screenCode: SCREENS.PATIENTS_FOLLOWUP },
  { key: "comparative", label: "Comparative Analysis", screenCode: SCREENS.PATIENTS_COMPARATIVE },
];

// Tabs that only present saved data — the "Save Prescription" action is
// hidden on these regardless of the update right (Patient Info has its own
// save button; Comparative Analysis has none).
const READ_ONLY_TABS = new Set(["info", "comparative"]);

function parseData(prescription) {
  if (!prescription?.data) return mergePrescriptionData(null);
  try {
    return mergePrescriptionData(JSON.parse(prescription.data));
  } catch {
    return mergePrescriptionData(null);
  }
}

// `toLocaleString()` with no arguments formats using the runtime's default
// locale, which can differ between the Node server (SSR) and the browser
// (hydration) — e.g. 24-hour vs 12-hour clock — causing a hydration
// mismatch. Pinning an explicit locale and options makes the output
// deterministic across both environments.
const SAVED_AT_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function formatSavedAt(savedAt) {
  return SAVED_AT_FORMATTER.format(new Date(savedAt));
}

export function PrescriptionScreen({ patient, prescription, isMockData = false, permissions }) {
  const router = useRouter();
  const { showToast } = useToast();
  const visibleTabs = TABS.filter((tab) => canAccess(permissions, tab.screenCode, ACTIONS.VIEW));
  const [activeTab, setActiveTab] = useState(() => visibleTabs[0]?.key ?? "info");
  const [patientInfo, setPatientInfo] = useState(patient);
  const [data, setData] = useState(() => parseData(prescription));
  const [savedAt, setSavedAt] = useState(prescription?.updatedAt ?? null);
  const [saving, setSaving] = useState(false);
  const complaintRef = useRef(null);
  const examinationRef = useRef(null);

  function handlePatientSaved(updatedPatient) {
    setPatientInfo(updatedPatient);
    router.refresh();
  }

  async function handleSave() {
    if (complaintRef.current && !complaintRef.current.validate()) {
      showToast("Please complete all required fields in the Patient Complaint tab.");
      return;
    }

    if (examinationRef.current && !examinationRef.current.validate()) {
      showToast("Please complete all required fields in the Examination tab.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/patients/${patient.id}/prescription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();

      if (!response.ok) {
        showToast(result.errors?.form ?? "Failed to save prescription. Please try again.");
        return;
      }

      setSavedAt(result.prescription.updatedAt);
      showToast("Prescription saved.", { variant: "success" });
    } catch {
      showToast("Failed to save prescription. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const activeTabDef = visibleTabs.find((tab) => tab.key === activeTab);
  const canSave =
    activeTabDef &&
    !READ_ONLY_TABS.has(activeTab) &&
    canAccess(permissions, activeTabDef.screenCode, ACTIONS.UPDATE);

  return (
    <div>
      {isMockData && <DemoModeBanner />}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/patients"
            className="text-sm text-teal-700 hover:underline dark:text-teal-400"
          >
            ← Back to Patients
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {patientInfo.firstName} {patientInfo.lastName} — Prescription
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {savedAt ? `Last saved ${formatSavedAt(savedAt)}` : "Not saved yet"}
          </p>
        </div>
        {canSave && (
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Prescription"}
          </Button>
        )}
      </div>

      <Tabs tabs={visibleTabs} activeKey={activeTab} onChange={setActiveTab} className="mb-6" />

      {!activeTabDef ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          You don&apos;t have access to any tabs on this patient record.
        </p>
      ) : activeTab === "info" ? (
        <PatientInfoTab
          patient={patientInfo}
          onSaved={handlePatientSaved}
          canUpdate={canAccess(permissions, SCREENS.PATIENTS_INFO, ACTIONS.UPDATE)}
        />
      ) : activeTab === "complaint" ? (
        <ComplaintTab ref={complaintRef} patient={patientInfo} data={data} onChange={setData} />
      ) : activeTab === "examination" ? (
        <ExaminationTab ref={examinationRef} data={data} onChange={setData} />
      ) : activeTab === "followup" ? (
        <FollowUpTab data={data} onChange={setData} />
      ) : (
        <ComparativeAnalysisTab data={data} />
      )}

      {canSave && (
        <div className="mt-8 flex justify-end border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Prescription"}
          </Button>
        </div>
      )}
    </div>
  );
}
