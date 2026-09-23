"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  PatientInfoFields,
  emptyPatientForm,
  validatePatientForm,
  calculateBmi,
} from "@/components/modules/patients/PatientInfoFields";

export function PatientInfoTab({ patient, onSaved, canUpdate = true }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => emptyPatientForm(patient));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    const validationErrors = validatePatientForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      showToast("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    try {
      const bmi = calculateBmi(form.heightFeet, form.weightKg);
      const response = await fetch(`/api/patients/${patient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bmi }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.form) {
          showToast(result.errors.form);
        } else if (result.errors) {
          setErrors(result.errors);
        } else {
          showToast("Failed to save patient info. Please try again.");
        }
        return;
      }

      onSaved?.(result.patient);
      showToast("Patient info saved.", { variant: "success" });
    } catch {
      showToast("Failed to save patient info. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PatientInfoFields form={form} errors={errors} onFieldChange={updateField} />

      {canUpdate && (
        <div className="flex justify-end border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Patient Info"}
          </Button>
        </div>
      )}
    </div>
  );
}
