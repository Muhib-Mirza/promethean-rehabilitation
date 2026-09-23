"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataGrid } from "@/components/ui/DataGrid";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ShieldIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { RoleFormModal } from "@/components/modules/roles/RoleFormModal";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { DemoModeBanner } from "@/mock-data/DemoModeBanner";

const CREATED_AT_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const columns = [
  { key: "name", header: "Name" },
  {
    key: "description",
    header: "Description",
    render: (row) => row.description || "—",
  },
  { key: "userCount", header: "Users" },
  { key: "permissionCount", header: "Rights Granted" },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => CREATED_AT_FORMATTER.format(new Date(row.createdAt)),
  },
];

export function RolesScreen({ roles, isMockData = false }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isRefreshing, startRefresh] = useTransition();
  // undefined = modal closed, null = "add new", object = editing that role.
  const [formRole, setFormRole] = useState(undefined);
  const [deletingRole, setDeletingRole] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function refresh() {
    startRefresh(() => router.refresh());
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/roles/${deletingRole.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        showToast(result?.errors?.form ?? "Failed to delete role. Please try again.");
        return;
      }
      setDeletingRole(null);
      refresh();
    } catch {
      showToast("Failed to delete role. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const actions = [
    { label: "Edit", icon: PencilIcon, onClick: (row) => setFormRole(row) },
    { label: "Delete", icon: TrashIcon, variant: "danger", onClick: (row) => setDeletingRole(row) },
  ];

  return (
    <div>
      {isMockData && <DemoModeBanner />}

      <PageHeader
        title="Roles"
        description="Define which screens, tabs, and operations each role can view, create, update, or delete, then assign it to one or more users."
        action={
          <Button type="button" onClick={() => setFormRole(null)}>
            Add Role
          </Button>
        }
      />

      <DataGrid
        columns={columns}
        data={roles}
        actions={actions}
        loading={isRefreshing}
        emptyState={{
          icon: ShieldIcon,
          title: "No roles yet",
          description: "Create a role to grant staff access to specific screens and actions.",
        }}
      />

      <RoleFormModal
        open={formRole !== undefined}
        role={formRole}
        onClose={() => setFormRole(undefined)}
        onSaved={refresh}
      />

      <ConfirmDialog
        open={Boolean(deletingRole)}
        onClose={() => setDeletingRole(null)}
        onConfirm={handleDeleteConfirm}
        confirming={deleting}
        title="Delete Role"
        description={
          deletingRole
            ? `Are you sure you want to delete "${deletingRole.name}"? Users assigned to it will lose the rights it granted. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
