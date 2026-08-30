"use client";

import { useImperativeHandle, useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { RadioGroupField } from "@/components/ui/RadioGroupField";
import { SelectField } from "@/components/ui/SelectField";
import { Checkbox } from "@/components/ui/Checkbox";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FileTextIcon } from "@/components/icons";
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
  LEVEL_ROWS,
  LEVEL_MIN,
  LEVEL_MAX,
  LEVEL_STEP,
  WEAKNESS_ROWS,
  WEAKNESS_MIN,
  WEAKNESS_MAX,
  WEAKNESS_STEP,
  LABS_ITEMS,
} from "@/lib/prescriptionOptions";

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
      {children}
    </h3>
  );
}

const isBlank = (value) => value == null || String(value).trim() === "";

const POSTURAL_FIELDS = [
  "sitting",
  "standing",
  "shiftRelevant",
  "changeOfPosture",
  "protrudedHead",
  "lateralDeviation",
  "lateralShift",
  "lateralDeviationRelevant",
];

const NEURO_FIELDS = ["motorDeficit", "sensoryDeficit", "reflexes", "neurodynamicTests"];

// Every choice / input field on this tab is mandatory except the free-text
// areas and the whole "Labs and Radiological Examination" section. Ordered
// top-to-bottom so validation focuses the first offending field. Each
// `invalid` predicate receives `data.examination`.
const REQUIRED_FIELDS = [
  ...POSTURAL_FIELDS.map((key) => ({
    id: `exam-postural-${key}`,
    message: "Please select an option.",
    invalid: (ex) => isBlank(ex.postural[key]),
  })),
  ...NEURO_FIELDS.map((key) => ({
    id: `exam-neuro-${key}`,
    message: "This field is required.",
    invalid: (ex) => isBlank(ex.neurological[key]),
  })),
  ...MECHANICAL_RESPONSE_GROUPS.flatMap((group) =>
    group.rows.map((row) => ({
      id: `exam-mech-${group.key}-${row.key}`,
      message: "Please select an option.",
      invalid: (ex) => isBlank(ex.mechanicalResponse[group.key][row.key]),
    }))
  ),
  {
    id: "exam-atlas",
    message: "Please select at least one option.",
    invalid: (ex) =>
      !ASYMMETRY_ROWS.some((row) =>
        ASYMMETRY_COLUMNS.some((col) => ex.asymmetry[row.key][col.key])
      ),
  },
  ...LEVEL_ROWS.flatMap((row) =>
    ["left", "right"].map((side) => ({
      id: `exam-levels-${row.key}-${side}`,
      message: "This field is required.",
      invalid: (ex) => isBlank(ex.levels[row.key][side]),
    }))
  ),
  ...WEAKNESS_ROWS.flatMap((row) =>
    ["left", "right"].map((side) => ({
      id: `exam-weakness-${row.key}-${side}`,
      message: "This field is required.",
      invalid: (ex) => isBlank(ex.weakness[row.key][side]),
    }))
  ),
];

// Shared UI for LEVEL_ROWS / WEAKNESS_ROWS: a Left/Right numeric reading per
// row, each field within [min, max] in `step` increments.
function LevelInputGroup({ rows, section, min, max, step, values, onFieldChange, textHeading, errors }) {
  return (
    <>
    <div className="mt-4">
    <SectionTitle>{textHeading}</SectionTitle>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">          
      {rows.map((row) => (
        <div key={row.key} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">          
          <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">{row.label}</p>
          <div className="grid grid-cols-2 gap-3">
            <TextField
              id={`exam-${section}-${row.key}-left`}
              label="Left"
              type="number"
              min={min}
              max={max}
              step={step}
              required
              error={errors?.[`exam-${section}-${row.key}-left`]}
              value={values[row.key].left}
              onChange={(e) => onFieldChange(section, row.key, "left", e.target.value)}
            />
            <TextField
              id={`exam-${section}-${row.key}-right`}
              label="Right"
              type="number"
              min={min}
              max={max}
              step={step}
              required
              error={errors?.[`exam-${section}-${row.key}-right`]}
              value={values[row.key].right}
              onChange={(e) => onFieldChange(section, row.key, "right", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
    </>    
  );
}

export function ExaminationTab({ ref, data, onChange }) {
  const examination = data.examination;
  const [reportDetailItem, setReportDetailItem] = useState(null);
  const [reportDetailDraft, setReportDetailDraft] = useState("");
  const [errors, setErrors] = useState({});

  // Exposed to the parent's "Save Prescription" handler. Returns true when
  // everything required is filled; otherwise records per-field errors and
  // scrolls to / focuses the first offending field.
  useImperativeHandle(
    ref,
    () => ({
      validate() {
        const nextErrors = {};
        for (const field of REQUIRED_FIELDS) {
          if (field.invalid(examination)) nextErrors[field.id] = field.message;
        }
        setErrors(nextErrors);

        const firstInvalid = REQUIRED_FIELDS.find((field) => nextErrors[field.id]);
        if (firstInvalid && typeof document !== "undefined") {
          const el = document.getElementById(firstInvalid.id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus({ preventScroll: true });
          }
        }
        return !firstInvalid;
      },
    }),
    [examination]
  );

  function updateExamination(next) {
    const nextExamination = { ...examination, ...next };
    // Drop any standing error the change resolves; new errors are only ever
    // raised by a save attempt (validate()).
    setErrors((prev) => {
      const keys = Object.keys(prev);
      if (keys.length === 0) return prev;
      const pruned = {};
      for (const key of keys) {
        const field = REQUIRED_FIELDS.find((f) => f.id === key);
        if (field && field.invalid(nextExamination)) pruned[key] = prev[key];
      }
      return Object.keys(pruned).length === keys.length ? prev : pruned;
    });
    onChange({ ...data, examination: nextExamination });
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

  function updateLevelField(section, rowKey, side, value) {
    updateExamination({
      [section]: {
        ...examination[section],
        [rowKey]: { ...examination[section][rowKey], [side]: value },
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

  function openReportDetail(item) {
    setReportDetailItem(item);
    setReportDetailDraft(examination.labsReportDetails[item.id] ?? "");
  }

  function closeReportDetail() {
    setReportDetailItem(null);
  }

  function saveReportDetail() {
    // Optional chaining here isn't for null-safety at call time (this only
    // ever runs while the modal is open, i.e. reportDetailItem is set) — the
    // React Compiler hoists `reportDetailItem.id` as a memoization
    // dependency evaluated on every render, including while the modal is
    // closed and reportDetailItem is null, so a bare `.id` throws.
    updateExamination({
      labsReportDetails: {
        ...examination.labsReportDetails,
        [reportDetailItem?.id]: reportDetailDraft,
      },
    });
    setReportDetailItem(null);
  }

  function renderLabItem(item) {
    const hasDetail = Boolean(examination.labsReportDetails[item.id]);
    return (
      <div key={item.id} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openReportDetail(item)}
          aria-label={`Report detail for ${item.label}`}
          title="Report detail"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
            hasDetail
              ? "border-teal-600 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-400"
              : "border-zinc-300 text-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800"
          }`}
        >
          <FileTextIcon className="h-4 w-4" />
        </button>
        <Checkbox
          label={item.label}
          checked={examination.labs.includes(item.id)}
          onChange={() => toggleLab(item.id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Postural Observation</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RadioGroupField
            id="exam-postural-sitting"
            label="Sitting"
            required
            error={errors["exam-postural-sitting"]}
            options={SITTING_OPTIONS}
            value={examination.postural.sitting}
            onChange={(value) => updatePostural("sitting", value)}
          />
          <RadioGroupField
            id="exam-postural-standing"
            label="Standing"
            required
            error={errors["exam-postural-standing"]}
            options={STANDING_OPTIONS}
            value={examination.postural.standing}
            onChange={(value) => updatePostural("standing", value)}
          />
          <RadioGroupField
            id="exam-postural-shiftRelevant"
            label="Shift Relevant"
            required
            error={errors["exam-postural-shiftRelevant"]}
            options={YES_NO_OPTIONS}
            value={examination.postural.shiftRelevant}
            onChange={(value) => updatePostural("shiftRelevant", value)}
          />
          <RadioGroupField
            id="exam-postural-changeOfPosture"
            label="Change of Posture"
            required
            error={errors["exam-postural-changeOfPosture"]}
            options={CHANGE_OF_POSTURE_OPTIONS}
            value={examination.postural.changeOfPosture}
            onChange={(value) => updatePostural("changeOfPosture", value)}
          />
          <RadioGroupField
            id="exam-postural-protrudedHead"
            label="Protruded Head"
            required
            error={errors["exam-postural-protrudedHead"]}
            options={YES_NO_OPTIONS}
            value={examination.postural.protrudedHead}
            onChange={(value) => updatePostural("protrudedHead", value)}
          />
          <RadioGroupField
            id="exam-postural-lateralDeviation"
            label="Lateral Deviation"
            required
            error={errors["exam-postural-lateralDeviation"]}
            options={LATERAL_OPTIONS}
            value={examination.postural.lateralDeviation}
            onChange={(value) => updatePostural("lateralDeviation", value)}
          />
          <RadioGroupField
            id="exam-postural-lateralShift"
            label="Lateral Shift"
            required
            error={errors["exam-postural-lateralShift"]}
            options={LATERAL_OPTIONS}
            value={examination.postural.lateralShift}
            onChange={(value) => updatePostural("lateralShift", value)}
          />
          <RadioGroupField
            id="exam-postural-lateralDeviationRelevant"
            label="Lateral Deviation Relevant"
            required
            error={errors["exam-postural-lateralDeviationRelevant"]}
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
            id="exam-neuro-motorDeficit"
            label="Motor Deficit"
            required
            error={errors["exam-neuro-motorDeficit"]}
            value={examination.neurological.motorDeficit}
            onChange={(e) => updateNeurological("motorDeficit", e.target.value)}
          />
          <TextField
            id="exam-neuro-sensoryDeficit"
            label="Sensory Deficit"
            required
            error={errors["exam-neuro-sensoryDeficit"]}
            value={examination.neurological.sensoryDeficit}
            onChange={(e) => updateNeurological("sensoryDeficit", e.target.value)}
          />
          <TextField
            id="exam-neuro-reflexes"
            label="Reflexes"
            required
            error={errors["exam-neuro-reflexes"]}
            value={examination.neurological.reflexes}
            onChange={(e) => updateNeurological("reflexes", e.target.value)}
          />
          <TextField
            id="exam-neuro-neurodynamicTests"
            label="Neurodynamic Tests"
            required
            error={errors["exam-neuro-neurodynamicTests"]}
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
                <div className="grid grid-cols-2 gap-3">
                  {group.rows.map((row) => (
                    <SelectField
                      key={row.key}
                      id={`exam-mech-${group.key}-${row.key}`}
                      label={row.label}
                      required
                      error={errors[`exam-mech-${group.key}-${row.key}`]}
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
        <SectionTitle>
          Atlas Findings<span className="text-red-500"> *</span>
        </SectionTitle>
        <div
          id="exam-atlas"
          tabIndex={-1}
          className="scroll-mt-24 overflow-x-auto rounded-lg border border-zinc-200 focus:outline-none dark:border-zinc-800"
        >
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
        {errors["exam-atlas"] && (
          <span className="mt-1 block text-xs text-red-500">{errors["exam-atlas"]}</span>
        )}

        <LevelInputGroup
          rows={LEVEL_ROWS}
          section="levels"
          min={LEVEL_MIN}
          max={LEVEL_MAX}
          step={LEVEL_STEP}
          values={examination.levels}
          onFieldChange={updateLevelField}
          textHeading={"Inclinometer Readings"}
          errors={errors}
        />

        <LevelInputGroup
          rows={WEAKNESS_ROWS}
          section="weakness"
          min={WEAKNESS_MIN}
          max={WEAKNESS_MAX}
          step={WEAKNESS_STEP}
          values={examination.weakness}
          onFieldChange={updateLevelField}
          textHeading={"Manual Muscle Testing"}
          errors={errors}
        />
      </section>

      <section>
        <SectionTitle>Labs and Radiological Examination</SectionTitle>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-2 lg:col-span-2">
            {LABS_ITEMS.filter((item) => !item.label.startsWith("X-rays")).map(renderLabItem)}
          </div>
          <div className="flex flex-col gap-2">
            {LABS_ITEMS.filter((item) => item.label.startsWith("X-rays")).map(renderLabItem)}
          </div>
        </div>
      </section>

      <Modal
        open={Boolean(reportDetailItem)}
        onClose={closeReportDetail}
        title={reportDetailItem ? `Report Detail — ${reportDetailItem.label}` : "Report Detail"}
      >
        <div className="space-y-4">
          <TextAreaField
            label="Report Detail"
            rows={6}
            value={reportDetailDraft}
            onChange={(e) => setReportDetailDraft(e.target.value)}
            placeholder="Enter findings / report details..."
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={closeReportDetail}>
              Cancel
            </Button>
            <Button type="button" onClick={saveReportDetail}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
