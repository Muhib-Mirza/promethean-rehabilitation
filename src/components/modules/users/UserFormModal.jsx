"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";
import { useToast } from "@/components/ui/Toast";
import { ROLES } from "@/lib/auth/roles";

const ROLE_OPTIONS = [
  { value: ROLES.STAFF, label: "Staff" },
  { value: ROLES.SUPERADMIN, label: "Super Admin" },
];

function emptyForm(user) {
  return {
    username: user?.username ?? "",
    password: "",
    role: user?.role ?? ROLES.STAFF,
  };
}

export function UserFormModal({ open, user, onClose, onSaved }) {
  const { showToast } = useToast();
  const isEditMode = Boolean(user?.id);
  const [form, setForm] = useState(() => emptyForm(user));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Re-seed the form whenever a different record (or "new") opens.
  const formKey = open ? (user?.id ?? "new") : null;
  const [renderedKey, setRenderedKey] = useState(formKey);
  if (open && formKey !== renderedKey) {
    setRenderedKey(formKey);
    setForm(emptyForm(user));
    setErrors({});
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm(emptyForm());
    setErrors({});
    setSubmitting(false);
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = {};
    if (!form.username.trim()) validationErrors.username = "Username is required.";
    // Password is required to create a user; on edit, blank means "keep
    // the current password", but anything typed must still meet the bar.
    if ((!isEditMode || form.password) && form.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch(isEditMode ? `/api/users/${user.id}` : "/api/users", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          role: form.role,
          // Omit blank password on edit so it's left unchanged server-side.
          ...(form.password ? { password: form.password } : {}),
        }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (result?.errors?.form) showToast(result.errors.form);
        setErrors(result?.errors ?? {});
        return;
      }

      onSaved?.(result.user);
      handleClose();
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? "Edit User" : "Add User"}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="Username"
          required
          error={errors.username}
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
          autoComplete="off"
        />
        <TextField
          label="Password"
          type="password"
          required={!isEditMode}
          error={errors.password}
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder={isEditMode ? "Leave blank to keep current password" : undefined}
          autoComplete="new-password"
        />
        <SelectField
          label="Role"
          required
          error={errors.role}
          options={ROLE_OPTIONS}
          value={form.role}
          onChange={(e) => updateField("role", e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
