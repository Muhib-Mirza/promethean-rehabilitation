"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataGrid } from "@/components/ui/DataGrid";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ShieldIcon, PencilIcon, TrashIcon } from "@/components/icons";
import { UserFormModal } from "@/components/modules/users/UserFormModal";
import { ROLES } from "@/lib/auth/roles";
// DEMO-DATA FALLBACK — remove along with src/mock-data/ once a real
// database is connected (see src/mock-data/README.md).
import { DemoModeBanner } from "@/mock-data/DemoModeBanner";

const CREATED_AT_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const ROLE_LABELS = { [ROLES.SUPERADMIN]: "Super Admin", [ROLES.STAFF]: "Staff" };

const columns = [
  { key: "username", header: "Username" },
  {
    key: "role",
    header: "Role",
    render: (row) => ROLE_LABELS[row.role] ?? row.role,
  },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => CREATED_AT_FORMATTER.format(new Date(row.createdAt)),
  },
];

export function UsersScreen({ users, currentUserId, isMockData = false }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isRefreshing, startRefresh] = useTransition();
  // undefined = modal closed, null = "add new", object = editing that user.
  const [formUser, setFormUser] = useState(undefined);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function refresh() {
    startRefresh(() => router.refresh());
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        showToast(result?.errors?.form ?? "Failed to delete user. Please try again.");
        return;
      }
      setDeletingUser(null);
      refresh();
    } catch {
      showToast("Failed to delete user. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  const actions = [
    { label: "Edit", icon: PencilIcon, onClick: (row) => setFormUser(row) },
    {
      label: "Delete",
      icon: TrashIcon,
      variant: "danger",
      disabled: (row) => row.id === currentUserId,
      onClick: (row) => setDeletingUser(row),
    },
  ];

  return (
    <div>
      {isMockData && <DemoModeBanner />}

      <PageHeader
        title="User Management"
        description="Only the super admin can create or edit staff accounts."
        action={
          <Button type="button" onClick={() => setFormUser(null)}>
            Add User
          </Button>
        }
      />

      <DataGrid
        columns={columns}
        data={users}
        actions={actions}
        loading={isRefreshing}
        emptyState={{
          icon: ShieldIcon,
          title: "No users yet",
          description: "Staff accounts will appear here once created.",
        }}
      />

      <UserFormModal
        open={formUser !== undefined}
        user={formUser}
        onClose={() => setFormUser(undefined)}
        onSaved={refresh}
      />

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
        confirming={deleting}
        title="Delete User"
        description={
          deletingUser
            ? `Are you sure you want to delete "${deletingUser.username}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
      />
    </div>
  );
}
