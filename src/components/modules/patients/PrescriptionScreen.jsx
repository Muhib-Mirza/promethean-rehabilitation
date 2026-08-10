"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { PatientInfoTab } from "@/components/modules/patients/PatientInfoTab";
import { ComplaintTab } from "@/components/modules/patients/ComplaintTab";
import { ExaminationTab } from "@/components/modules/patients/ExaminationTab";
import { mergePrescriptionData } from "@/lib/prescriptionOptions";

const TABS = [
  { key: "info", label: "Patient Info" },
  { key: "complaint", label: "Patient Complaint" },
  { key: "examination", label: "Examination" },
];

function parseData(prescription) {
  if (!prescription?.data) return mergePrescriptionData(null);
  try {
    return mergePrescriptionData(JSON.parse(prescription.data));
  } catch {
    return mergePrescriptionData(null);
  }
}

export function PrescriptionScreen({ patient, prescription }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("complaint");
  const [patientInfo, setPatientInfo] = useState(patient);
  const [data, setData] = useState(() => parseData(prescription));
  const [savedAt, setSavedAt] = useState(prescription?.updatedAt ?? null);
  const [saving, setSaving] = useState(false);

  function handlePatientSaved(updatedPatient) {
    setPatientInfo(updatedPatient);
    router.refresh();
  }

  async function handleSave() {
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

  return (
    <div>
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
            {savedAt
              ? `Last saved ${new Date(savedAt).toLocaleString()}`
              : "Not saved yet"}
          </p>
        </div>
        {activeTab !== "info" && (
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Prescription"}
          </Button>
        )}
      </div>

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === "info" ? (
        <PatientInfoTab patient={patientInfo} onSaved={handlePatientSaved} />
      ) : activeTab === "complaint" ? (
        <ComplaintTab patient={patientInfo} data={data} onChange={setData} />
      ) : (
        <ExaminationTab data={data} onChange={setData} />
      )}

      {activeTab !== "info" && (
        <div className="mt-8 flex justify-end border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Prescription"}
          </Button>
        </div>
      )}
    </div>
  );
}
