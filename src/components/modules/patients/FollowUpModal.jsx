"use client";

import { useState } from "react";
import { SelectField } from "@/components/ui/SelectField";
import { RadioGroupField } from "@/components/ui/RadioGroupField";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
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

// Shared table for Inclinometer Readings / Manual Muscle Testing: each row
// (Shoulder/Pelvic ...) gets a Right/Left numeric reading, rendered as an
// actual 2-column table per the requested tabular layout.
function ReadingTable({ rows, min, max, step, values, onChange }) {
  return (
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
                  type="number"
                  aria-label={`${row.label} Right Level`}
                  min={min}
                  max={max}
                  step={step}
                  value={values[row.key].right}
                  onChange={(e) => onChange(row.key, "right", e.target.value)}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  aria-label={`${row.label} Left Level`}
                  min={min}
                  max={max}
                  step={step}
                  value={values[row.key].left}
                  onChange={(e) => onChange(row.key, "left", e.target.value)}
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-teal-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FollowUpModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(emptyFollowUpEntry);

  function handleClose() {
    setForm(emptyFollowUpEntry());
    onClose();
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAtlas(rowKey, colKey) {
    setForm((prev) => ({
      ...prev,
      atlasRotation: {
        ...prev.atlasRotation,
        [rowKey]: { ...prev.atlasRotation[rowKey], [colKey]: !prev.atlasRotation[rowKey][colKey] },
      },
    }));
  }

  function updateReading(section, rowKey, side, value) {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [rowKey]: { ...prev[section][rowKey], [side]: value } },
    }));
  }

  function updateMechanical(groupKey, rowKey, value) {
    setForm((prev) => ({
      ...prev,
      mechanicalResponse: {
        ...prev.mechanicalResponse,
        [groupKey]: { ...prev.mechanicalResponse[groupKey], [rowKey]: value },
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    onAdd({ ...form, id, date: new Date().toISOString() });
    setForm(emptyFollowUpEntry());
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Patient Follow Up" panelClassName="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <SectionTitle>GMFCS</SectionTitle>
          <RadioGroupField options={GMFCS_OPTIONS} value={form.gmfcs} onChange={(value) => updateField("gmfcs", value)} label="Level" />
        </section>

        <section>
          <SectionTitle>Atlas Rotation</SectionTitle>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
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
        </section>

        <section>
          <SectionTitle>Inclinometer Readings</SectionTitle>
          <ReadingTable
            rows={LEVEL_ROWS}
            min={LEVEL_MIN}
            max={LEVEL_MAX}
            step={LEVEL_STEP}
            values={form.inclinometer}
            onChange={(rowKey, side, value) => updateReading("inclinometer", rowKey, side, value)}
          />
        </section>

        <section>
          <SectionTitle>Manual Muscle Testing</SectionTitle>
          <ReadingTable
            rows={WEAKNESS_ROWS}
            min={WEAKNESS_MIN}
            max={WEAKNESS_MAX}
            step={WEAKNESS_STEP}
            values={form.muscleTesting}
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
                  <SelectField
                    label="Pretest Symptom"
                    options={MECHANICAL_RESPONSE_LEVEL_OPTIONS}
                    value={form.mechanicalResponse[group.key].pretest}
                    onChange={(e) => updateMechanical(group.key, "pretest", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {group.rows.map((row) => (
                      <SelectField
                        key={row.key}
                        label={row.label}
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
