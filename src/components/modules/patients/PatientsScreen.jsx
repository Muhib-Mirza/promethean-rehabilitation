"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataGrid } from "@/components/ui/DataGrid";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { UsersIcon, PencilIcon, TrashIcon, BodyChartIcon } from "@/components/icons";
import { AddPatientButton } from "@/components/modules/patients/AddPatientButton";
import { PatientFormModal } from "@/components/modules/patients/PatientFormModal";
import { BodyChartModal } from "@/components/modules/patients/BodyChartModal";
import { useToast } from "@/components/ui/Toast";

const columns = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <span className="font-medium">
        {row.firstName} {row.lastName}
      </span>
    ),
  },
  { key: "contactNumber", header: "Contact Number" },
  { key: "gender", header: "Gender" },
  { key: "profession", header: "Profession" },
  { key: "cnic", header: "CNIC" },
  {
    key: "referredBy",
    header: "Referred By",
    render: (row) => row.referredBy || "—",
  },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];

export function PatientsScreen({ patients }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isRefreshing, startRefresh] = useTransition();
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bodyChartPatient, setBodyChartPatient] = useState(null);

  function refresh() {
    startRefresh(() => router.refresh());
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/patients/${deletingPatient.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        showToast("Failed to delete patient. Please try again.");
        return;
      }
      setDeletingPatient(null);
      refresh();
    } catch {
      showToast("Failed to delete patient. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const actions = [
    {
      label: "Edit",
      icon: PencilIcon,
      onClick: (row) => setEditingPatient(row),
    },
    {
      label: "Body Chart",
      icon: BodyChartIcon,
      onClick: (row) => setBodyChartPatient(row),
    },
    {
      label: "Delete",
      icon: TrashIcon,
      variant: "danger",
      onClick: (row) => setDeletingPatient(row),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Manage patient records, intake, and rehabilitation history."
        action={<AddPatientButton onSaved={refresh} />}
      />

      <DataGrid
        columns={columns}
        data={patients}
        loading={isRefreshing}
        actions={actions}
        onRowClick={(row) => router.push(`/patients/${row.id}`)}
        emptyState={{
          icon: UsersIcon,
          title: "No patients yet",
          description:
            "Patient records will appear here once the patient module is connected.",
        }}
      />

      <PatientFormModal
        open={Boolean(editingPatient)}
        patient={editingPatient}
        onClose={() => setEditingPatient(null)}
        onSaved={refresh}
      />

      <BodyChartModal
        open={Boolean(bodyChartPatient)}
        patient={bodyChartPatient}
        onClose={() => setBodyChartPatient(null)}
        onSaved={refresh}
      />

      <ConfirmDialog
        open={Boolean(deletingPatient)}
        onClose={() => setDeletingPatient(null)}
        onConfirm={handleDeleteConfirm}
        confirming={deleting}
        title="Delete Patient"
        description={
          deletingPatient
            ? `Are you sure you want to delete ${deletingPatient.firstName} ${deletingPatient.lastName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
