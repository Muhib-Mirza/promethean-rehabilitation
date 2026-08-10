"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  PatientInfoFields,
  emptyPatientForm,
  validatePatientForm,
  calculateBmi,
} from "@/components/modules/patients/PatientInfoFields";

export function PatientFormModal({ open, onClose, patient, onSaved }) {
  const { showToast } = useToast();
  const isEditMode = Boolean(patient?.id);
  const [form, setForm] = useState(() => emptyPatientForm(patient));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formKey = open ? (patient?.id ?? "new") : null;
  const [renderedKey, setRenderedKey] = useState(formKey);
  if (open && formKey !== renderedKey) {
    setRenderedKey(formKey);
    setForm(emptyPatientForm(patient));
    setErrors({});
    setSubmitted(false);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm(emptyPatientForm());
    setErrors({});
    setSubmitted(false);
    setSubmitting(false);
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validatePatientForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    try {
      const bmi = calculateBmi(form.heightFeet, form.weightKg);
      const response = await fetch(
        isEditMode ? `/api/patients/${patient.id}` : "/api/patients",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, bmi }),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.form) {
          showToast("Something went wrong. Please try again.");
        } else if (result.errors) {
          setErrors(result.errors);
        } else {
          showToast("Something went wrong. Please try again.");
        }
        return;
      }

      onSaved?.(result.patient);

      if (isEditMode) {
        handleClose();
      } else {
        setSubmitted(true);
      }
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Patient" : "Add Patient"}
      panelClassName="max-w-2xl"
    >
      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Patient details captured for{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              {form.firstName} {form.lastName}
            </span>
            .
          </p>
          <Button type="button" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <PatientInfoFields form={form} errors={errors} onFieldChange={updateField} />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Submitting..."
                : isEditMode
                  ? "Save Changes"
                  : "Submit"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
