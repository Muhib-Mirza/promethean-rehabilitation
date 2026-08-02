"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PatientFormModal } from "@/components/modules/patients/PatientFormModal";

export function AddPatientButton({ onSaved }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Patient
      </Button>
      <PatientFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={onSaved}
      />
    </>
  );
}
