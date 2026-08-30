"use client";

import { useState } from "react";
import { SelectField } from "@/components/ui/SelectField";
import { RadioGroupField } from "@/components/ui/RadioGroupField";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  GMFCS_OPTIONS,
  FOLLOW_UP_ATLAS_ROWS,
  FOLLOW_UP_ATLAS_COLUMNS,
  LEVEL_ROWS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_STEP,
  WEAKNESS_ROWS,
  WEAKNESS_MIN,
  WEAKNESS_MAX,
  WEAKNESS_STEP,
  MECHANICAL_RESPONSE_GROUPS,
  MECHANICAL_RESPONSE_LEVEL_OPTIONS,
  emptyFollowUpEntry,
} from "@/lib/prescriptionOptions";

function SectionTitle({ children }) {
  return (
    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
      {children}
    </h4>
  );
}

const isBlank = (value) => value == null || String(value).trim() === "";

// Every choice / input field in this modal is mandatory (there are no
// free-text areas here). Ordered top-to-bottom so validation focuses the
// first offending field. Each `invalid` predicate receives the form entry.
const REQUIRED_FIELDS = [
  { id: "fu-gmfcs", message: "Please select an option.", invalid: (f) => isBlank(f.gmfcs) },
  {
    id: "fu-atlas",
    message: "Please select at least one option.",
    invalid: (f) =>
      !FOLLOW_UP_ATLAS_ROWS.some((row) =>
        FOLLOW_UP_ATLAS_COLUMNS.some((col) => f.atlasRotation[row.key][col.key])
      ),
  },
  ...LEVEL_ROWS.flatMap((row) =>
    ["right", "left"].map((side) => ({
      id: `fu-inclinometer-${row.key}-${side}`,
      message: "This field is required.",
      invalid: (f) => isBlank(f.inclinometer[row.key][side]),
    }))
  ),
  ...WEAKNESS_ROWS.flatMap((row) =>
    ["right", "left"].map((side) => ({
      id: `fu-muscleTesting-${row.key}-${side}`,
      message: "This field is required.",
      invalid: (f) => isBlank(f.muscleTesting[row.key][side]),
    }))
  ),
  ...MECHANICAL_RESPONSE_GROUPS.flatMap((group) =>
    group.rows.map((row) => ({
      id: `fu-mech-${group.key}-${row.key}`,
      message: "Please select an option.",
      invalid: (f) => isBlank(f.mechanicalResponse[group.key][row.key]),
    }))
  ),
];

// Shared table for Inclinometer Readings / Manual Muscle Testing: each row
// (Shoulder/Pelvic ...) gets a Right/Left numeric reading, rendered as an
// actual 2-column table per the requested tabular layout.
function ReadingTable({ rows, min, max, step, values, onChange, section, errors = {} }) {
  const inputClass = (fieldId) =>
    `w-24 rounded-lg border bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-teal-500 dark:bg-zinc-900 dark:text-zinc-50 ${
      errors[fieldId]
        ? "border-red-400"
        : "border-zinc-300 dark:border-zinc-700"
    }`;
  const hasError = rows.some((row) =>
    ["right", "left"].some((side) => errors[`fu-${section}-${row.key}-${side}`])
  );

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-2 font-medium text-zinc-500 dark:text-zinc-400" />
              <th className="px-4 py-2 font-medium text-zinc-500 dark:text-zinc-400">Right Level</th>
              <th className="px-4 py-2 font-medium text-zinc-500 dark:text-zinc-400">Left Level</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-50">{row.label}</td>
                <td className="px-4 py-2">
                  <input
                    id={`fu-${section}-${row.key}-right`}
                    type="number"
                    aria-label={`${row.label} Right Level`}
                    min={min}
                    max={max}
                    step={step}
                    value={values[row.key].right}
                    onChange={(e) => onChange(row.key, "right", e.target.value)}
                    className={inputClass(`fu-${section}-${row.key}-right`)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    id={`fu-${section}-${row.key}-left`}
                    type="number"
                    aria-label={`${row.label} Left Level`}
                    min={min}
                    max={max}
                    step={step}
                    value={values[row.key].left}
                    onChange={(e) => onChange(row.key, "left", e.target.value)}
                    className={inputClass(`fu-${section}-${row.key}-left`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasError && (
        <span className="mt-1 block text-xs text-red-500">All readings are required.</span>
      )}
    </>
  );
}

export function FollowUpModal({ open, onClose, onAdd }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyFollowUpEntry);
  const [errors, setErrors] = useState({});

  // Apply a form change and drop any standing error it resolves; new errors
  // are only ever raised by a submit attempt.
  function commit(nextForm) {
    setForm(nextForm);
    setErrors((prev) => {
      const keys = Object.keys(prev);
      if (keys.length === 0) return prev;
      const pruned = {};
      for (const key of keys) {
        const field = REQUIRED_FIELDS.find((f) => f.id === key);
        if (field && field.invalid(nextForm)) pruned[key] = prev[key];
      }
      return Object.keys(pruned).length === keys.length ? prev : pruned;
    });
  }

  function handleClose() {
    setForm(emptyFollowUpEntry());
    setErrors({});
    onClose();
  }

  function updateField(field, value) {
    commit({ ...form, [field]: value });
  }

  function toggleAtlas(rowKey, colKey) {
    commit({
      ...form,
      atlasRotation: {
        ...form.atlasRotation,
        [rowKey]: { ...form.atlasRotation[rowKey], [colKey]: !form.atlasRotation[rowKey][colKey] },
      },
    });
  }

  function updateReading(section, rowKey, side, value) {
    commit({
      ...form,
      [section]: { ...form[section], [rowKey]: { ...form[section][rowKey], [side]: value } },
    });
  }

  function updateMechanical(groupKey, rowKey, value) {
    commit({
      ...form,
      mechanicalResponse: {
        ...form.mechanicalResponse,
        [groupKey]: { ...form.mechanicalResponse[groupKey], [rowKey]: value },
      },
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    for (const field of REQUIRED_FIELDS) {
      if (field.invalid(form)) nextErrors[field.id] = field.message;
    }
    setErrors(nextErrors);

    const firstInvalid = REQUIRED_FIELDS.find((field) => nextErrors[field.id]);
    if (firstInvalid) {
      showToast("Please complete all required fields before adding the follow up.");
      if (typeof document !== "undefined") {
        const el = document.getElementById(firstInvalid.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus({ preventScroll: true });
        }
      }
      return;
    }

    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    onAdd({ ...form, id, date: new Date().toISOString() });
    setForm(emptyFollowUpEntry());
    setErrors({});
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Patient Follow Up" panelClassName="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <SectionTitle>GMFCS</SectionTitle>
          <RadioGroupField
            id="fu-gmfcs"
            options={GMFCS_OPTIONS}
            value={form.gmfcs}
            onChange={(value) => updateField("gmfcs", value)}
            label="Level"
            required
            error={errors["fu-gmfcs"]}
          />
        </section>

        <section>
          <SectionTitle>
            Atlas Rotation<span className="text-red-500"> *</span>
          </SectionTitle>
          <div
            id="fu-atlas"
            tabIndex={-1}
            className="scroll-mt-24 overflow-x-auto rounded-lg border border-zinc-200 focus:outline-none dark:border-zinc-800"
          >
            <table className="w-full min-w-max text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-4 py-2 font-medium text-zinc-500 dark:text-zinc-400" />
                  {FOLLOW_UP_ATLAS_COLUMNS.map((col) => (
                    <th key={col.key} className="px-4 py-2 text-center font-medium text-zinc-500 dark:text-zinc-400">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FOLLOW_UP_ATLAS_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                    <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-50">{row.label}</td>
                    {FOLLOW_UP_ATLAS_COLUMNS.map((col) => (
                      <td key={col.key} className="px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          aria-label={`${col.label} ${row.label}`}
                          checked={form.atlasRotation[row.key][col.key]}
                          onChange={() => toggleAtlas(row.key, col.key)}
                          className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 dark:border-zinc-600 dark:bg-zinc-900"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors["fu-atlas"] && (
            <span className="mt-1 block text-xs text-red-500">{errors["fu-atlas"]}</span>
          )}
        </section>

        <section>
          <SectionTitle>
            Inclinometer Readings<span className="text-red-500"> *</span>
          </SectionTitle>
          <ReadingTable
            rows={LEVEL_ROWS}
            section="inclinometer"
            min={LEVEL_MIN}
            max={LEVEL_MAX}
            step={LEVEL_STEP}
            values={form.inclinometer}
            errors={errors}
            onChange={(rowKey, side, value) => updateReading("inclinometer", rowKey, side, value)}
          />
        </section>

        <section>
          <SectionTitle>
            Manual Muscle Testing<span className="text-red-500"> *</span>
          </SectionTitle>
          <ReadingTable
            rows={WEAKNESS_ROWS}
            section="muscleTesting"
            min={WEAKNESS_MIN}
            max={WEAKNESS_MAX}
            step={WEAKNESS_STEP}
            values={form.muscleTesting}
            errors={errors}
            onChange={(rowKey, side, value) => updateReading("muscleTesting", rowKey, side, value)}
          />
        </section>

        <section>
          <SectionTitle>Symptomatic and Mechanical Response</SectionTitle>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {MECHANICAL_RESPONSE_GROUPS.map((group) => (
              <div key={group.key} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">{group.title}</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {group.rows.map((row) => (
                      <SelectField
                        key={row.key}
                        id={`fu-mech-${group.key}-${row.key}`}
                        label={row.label}
                        required
                        error={errors[`fu-mech-${group.key}-${row.key}`]}
                        options={MECHANICAL_RESPONSE_LEVEL_OPTIONS}
                        value={form.mechanicalResponse[group.key][row.key]}
                        onChange={(e) => updateMechanical(group.key, row.key, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Add Follow Up</Button>
        </div>
      </form>
    </Modal>
  );
}
