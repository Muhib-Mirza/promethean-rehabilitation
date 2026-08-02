"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { BodyChart } from "@/components/modules/patients/BodyChart";

function parseMarkings(patient) {
  if (!patient?.bodyChartMarkings) return [];
  try {
    return JSON.parse(patient.bodyChartMarkings);
  } catch {
    return [];
  }
}

export function BodyChartModal({ open, onClose, patient, onSaved }) {
  const { showToast } = useToast();
  const [markings, setMarkings] = useState(() => parseMarkings(patient));
  const [patientId, setPatientId] = useState(patient?.id ?? null);
  const [saving, setSaving] = useState(false);

  if (open && patient?.id !== patientId) {
    setPatientId(patient?.id ?? null);
    setMarkings(parseMarkings(patient));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markings }),
      });
      if (!response.ok) {
        showToast("Failed to save body chart. Please try again.");
        return;
      }
      onSaved?.();
      onClose();
    } catch {
      showToast("Failed to save body chart. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        patient ? `Body Chart — ${patient.firstName} ${patient.lastName}` : "Body Chart"
      }
      panelClassName="max-w-4xl"
    >
      {patient && <BodyChart markings={markings} onChange={setMarkings} />}

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
