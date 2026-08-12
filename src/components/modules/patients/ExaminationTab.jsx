"use client";

import { TextField } from "@/components/ui/TextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { RadioGroupField } from "@/components/ui/RadioGroupField";
import { SelectField } from "@/components/ui/SelectField";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  YES_NO_OPTIONS,
  SITTING_OPTIONS,
  STANDING_OPTIONS,
  CHANGE_OF_POSTURE_OPTIONS,
  LATERAL_OPTIONS,
  MECHANICAL_RESPONSE_GROUPS,
  MECHANICAL_RESPONSE_LEVEL_OPTIONS,
  ASYMMETRY_ROWS,
  ASYMMETRY_COLUMNS,
  LABS_ITEMS,
} from "@/lib/prescriptionOptions";

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
      {children}
    </h3>
  );
}

export function ExaminationTab({ data, onChange }) {
  const examination = data.examination;

  function updateExamination(next) {
    onChange({ ...data, examination: { ...examination, ...next } });
  }

  function updatePostural(field, value) {
    updateExamination({ postural: { ...examination.postural, [field]: value } });
  }

  function updateNeurological(field, value) {
    updateExamination({ neurological: { ...examination.neurological, [field]: value } });
  }

  function updateMechanical(groupKey, rowKey, value) {
    updateExamination({
      mechanicalResponse: {
        ...examination.mechanicalResponse,
        [groupKey]: { ...examination.mechanicalResponse[groupKey], [rowKey]: value },
      },
    });
  }

  function toggleAsymmetry(rowKey, colKey) {
    updateExamination({
      asymmetry: {
        ...examination.asymmetry,
        [rowKey]: {
          ...examination.asymmetry[rowKey],
          [colKey]: !examination.asymmetry[rowKey][colKey],
        },
      },
    });
  }

  function toggleLab(id) {
    const next = examination.labs.includes(id)
      ? examination.labs.filter((v) => v !== id)
      : [...examination.labs, id];
    updateExamination({ labs: next });
  }

  function updateLabsNote(field, value) {
    updateExamination({ labsNotes: { ...examination.labsNotes, [field]: value } });
  }

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Postural Observation</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RadioGroupField
            label="Sitting"
            options={SITTING_OPTIONS}
            value={examination.postural.sitting}
            onChange={(value) => updatePostural("sitting", value)}
          />
          <RadioGroupField
            label="Standing"
            options={STANDING_OPTIONS}
            value={examination.postural.standing}
            onChange={(value) => updatePostural("standing", value)}
          />
          <RadioGroupField
            label="Shift Relevant"
            options={YES_NO_OPTIONS}
            value={examination.postural.shiftRelevant}
            onChange={(value) => updatePostural("shiftRelevant", value)}
          />
          <RadioGroupField
            label="Change of Posture"
            options={CHANGE_OF_POSTURE_OPTIONS}
            value={examination.postural.changeOfPosture}
            onChange={(value) => updatePostural("changeOfPosture", value)}
          />
          <RadioGroupField
            label="Protruded Head"
            options={YES_NO_OPTIONS}
            value={examination.postural.protrudedHead}
            onChange={(value) => updatePostural("protrudedHead", value)}
          />
          <RadioGroupField
            label="Lateral Deviation"
            options={LATERAL_OPTIONS}
            value={examination.postural.lateralDeviation}
            onChange={(value) => updatePostural("lateralDeviation", value)}
          />
          <RadioGroupField
            label="Lateral Shift"
            options={LATERAL_OPTIONS}
            value={examination.postural.lateralShift}
            onChange={(value) => updatePostural("lateralShift", value)}
          />
          <RadioGroupField
            label="Lateral Deviation Relevant"
            options={YES_NO_OPTIONS}
            value={examination.postural.lateralDeviationRelevant}
            onChange={(value) => updatePostural("lateralDeviationRelevant", value)}
          />
        </div>
        <div className="mt-4">
          <TextAreaField
            label="Other Observations / Functional Baselines"
            rows={2}
            value={examination.postural.otherObservations}
            onChange={(e) => updatePostural("otherObservations", e.target.value)}
          />
        </div>
      </section>

      <section>
        <SectionTitle>Neurological</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Motor Deficit"
            value={examination.neurological.motorDeficit}
            onChange={(e) => updateNeurological("motorDeficit", e.target.value)}
          />
          <TextField
            label="Sensory Deficit"
            value={examination.neurological.sensoryDeficit}
            onChange={(e) => updateNeurological("sensoryDeficit", e.target.value)}
          />
          <TextField
            label="Reflexes"
            value={examination.neurological.reflexes}
            onChange={(e) => updateNeurological("reflexes", e.target.value)}
          />
          <TextField
            label="Neurodynamic Tests"
            value={examination.neurological.neurodynamicTests}
            onChange={(e) => updateNeurological("neurodynamicTests", e.target.value)}
          />
        </div>
      </section>

      <section>
        <SectionTitle>Symptomatic and Mechanical Response</SectionTitle>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {MECHANICAL_RESPONSE_GROUPS.map((group) => (
            <div
              key={group.key}
              className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {group.title}
              </p>
              <div className="space-y-3">
                <SelectField
                  label="Pretest Symptom"
                  options={MECHANICAL_RESPONSE_LEVEL_OPTIONS}
                  value={examination.mechanicalResponse[group.key].pretest}
                  onChange={(e) => updateMechanical(group.key, "pretest", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  {group.rows.map((row) => (
                    <SelectField
                      key={row.key}
                      label={row.label}
                      options={MECHANICAL_RESPONSE_LEVEL_OPTIONS}
                      value={examination.mechanicalResponse[group.key][row.key]}
                      onChange={(e) => updateMechanical(group.key, row.key, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Atlas / Shoulder / Pelvic Findings</SectionTitle>
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-max text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-2 font-medium text-zinc-500 dark:text-zinc-400" />
                {ASYMMETRY_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 text-center font-medium text-zinc-500 dark:text-zinc-400"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASYMMETRY_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                  <td className="px-4 py-2 font-medium text-zinc-900 dark:text-zinc-50">
                    {row.label}
                  </td>
                  {ASYMMETRY_COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        aria-label={`${row.label} ${col.label}`}
                        checked={examination.asymmetry[row.key][col.key]}
                        onChange={() => toggleAsymmetry(row.key, col.key)}
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
        <SectionTitle>Labs and Radiological Examination</SectionTitle>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {LABS_ITEMS.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={examination.labs.includes(item.id)}
              onChange={() => toggleLab(item.id)}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="MRI-Scan Site"
            value={examination.labsNotes.mriSite}
            onChange={(e) => updateLabsNote("mriSite", e.target.value)}
            placeholder="Optional"
          />
          <TextField
            label="CT-Scan Site"
            value={examination.labsNotes.ctSite}
            onChange={(e) => updateLabsNote("ctSite", e.target.value)}
            placeholder="Optional"
          />
        </div>
      </section>
    </div>
  );
}
