"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/ui/Toast";
import { ACTIONS } from "@/lib/auth/screens";
import { ROLES } from "@/lib/auth/roles";

const ACTION_COLUMNS = [
  { code: ACTIONS.VIEW, label: "View" },
  { code: ACTIONS.CREATE, label: "Create" },
  { code: ACTIONS.UPDATE, label: "Update" },
  { code: ACTIONS.DELETE, label: "Delete" },
];

function emptyForm() {
  return { name: "", description: "" };
}

// Screens is a flat list where a tab has parentId set to its screen's id —
// group top-level screens followed immediately by their tabs so the matrix
// reads like the sidebar/tab structure it governs.
function groupScreens(screens) {
  const topLevel = screens.filter((s) => !s.parentId);
  return topLevel.flatMap((screen) => [
    { ...screen, indent: false },
    ...screens.filter((s) => s.parentId === screen.id).map((child) => ({ ...child, indent: true })),
  ]);
}

export function RoleFormModal({ open, role, onClose, onSaved }) {
  const { showToast } = useToast();
  const isEditMode = Boolean(role?.id);
  const [form, setForm] = useState(emptyForm);
  const [screens, setScreens] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState(() => new Set());
  const [userIds, setUserIds] = useState(() => new Set());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formKey = open ? (role?.id ?? "new") : null;
  const [renderedKey, setRenderedKey] = useState(formKey);
  if (open && formKey !== renderedKey) {
    setRenderedKey(formKey);
    loadData();
  }

  async function loadData() {
    setLoading(true);
    setErrors({});
    setForm({ name: role?.name ?? "", description: role?.description ?? "" });
    try {
      const [screensRes, usersRes, roleRes] = await Promise.all([
        fetch("/api/screens"),
        fetch("/api/users"),
        isEditMode ? fetch(`/api/roles/${role.id}`) : Promise.resolve(null),
      ]);
      const screensResult = await screensRes.json().catch(() => null);
      const usersResult = await usersRes.json().catch(() => null);
      setScreens(screensResult?.screens ?? []);
      setUsers((usersResult?.users ?? []).filter((u) => u.role !== ROLES.SUPERADMIN));

      if (roleRes) {
        const roleResult = await roleRes.json().catch(() => null);
        setPermissions(new Set(roleResult?.role?.permissions ?? []));
        setUserIds(new Set(roleResult?.role?.userIds ?? []));
      } else {
        setPermissions(new Set());
        setUserIds(new Set());
      }
    } catch {
      showToast("Failed to load role data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setForm(emptyForm());
    setPermissions(new Set());
    setUserIds(new Set());
    setErrors({});
    setSubmitting(false);
    onClose();
  }

  function togglePermission(screenCode, actionCode) {
    const key = `${screenCode}:${actionCode}`;
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleUser(userId) {
    setUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setErrors({ name: "Role name is required." });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(isEditMode ? `/api/roles/${role.id}` : "/api/roles", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          permissions: Array.from(permissions),
          userIds: Array.from(userIds),
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (result?.errors?.form) showToast(result.errors.form);
        setErrors(result?.errors ?? {});
        return;
      }

      onSaved?.();
      handleClose();
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const groupedScreens = groupScreens(screens);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Role" : "Add Role"}
      panelClassName="max-w-3xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Role Name"
            required
            error={errors.name}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            autoComplete="off"
          />
          <TextAreaField
            label="Description"
            rows={1}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
        ) : (
          <>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Screen &amp; Tab Rights
              </h4>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 text-left dark:bg-zinc-900/50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-zinc-600 dark:text-zinc-400">Screen</th>
                      {ACTION_COLUMNS.map((action) => (
                        <th key={action.code} className="px-3 py-2 text-center font-medium text-zinc-600 dark:text-zinc-400">
                          {action.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {groupedScreens.map((screen) => (
                      <tr key={screen.id}>
                        <td className={`px-3 py-2 text-zinc-900 dark:text-zinc-50 ${screen.indent ? "pl-8 text-zinc-600 dark:text-zinc-400" : "font-medium"}`}>
                          {screen.name}
                        </td>
                        {ACTION_COLUMNS.map((action) => (
                          <td key={action.code} className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-900"
                              checked={permissions.has(`${screen.code}:${action.code}`)}
                              onChange={() => togglePermission(screen.code, action.code)}
                              aria-label={`${screen.name} — ${action.label}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {groupedScreens.length === 0 && (
                      <tr>
                        <td colSpan={ACTION_COLUMNS.length + 1} className="px-3 py-4 text-center text-zinc-500 dark:text-zinc-400">
                          No screens found. Run sql/rbac-seed.sql against the database first.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Assigned Users
              </h4>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                {users.map((u) => (
                  <Checkbox
                    key={u.id}
                    label={u.username}
                    checked={userIds.has(u.id)}
                    onChange={() => toggleUser(u.id)}
                  />
                ))}
                {users.length === 0 && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No staff accounts yet.</p>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || loading}>
            {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
