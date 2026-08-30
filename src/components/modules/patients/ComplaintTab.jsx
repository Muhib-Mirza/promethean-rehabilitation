"use client";

import { useImperativeHandle, useState } from "react";
import { TextField } from "@/components/ui/TextField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { RadioGroupField } from "@/components/ui/RadioGroupField";
import { CheckboxGroupField } from "@/components/ui/CheckboxGroupField";
import { BodyChart } from "@/components/modules/patients/BodyChart";
import {
  INJURY_GRADES,
  CLASSIFICATIONS,
  PRESENT_SINCE_OPTIONS,
  BODY_REGION_OPTIONS,
  RESPONSE_POSITION_OPTIONS,
  RESPONSE_TIMING_OPTIONS,
  RESPONSE_ACTIVITY_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/prescriptionOptions";

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
      {children}
    </h3>
  );
}

const isBlank = (value) => value == null || String(value).trim() === "";
const isEmptyList = (value) => !Array.isArray(value) || value.length === 0;

// Every choice / input field on this tab is mandatory except the free-text
// areas ("Present Symptoms", "Treatment Plan"). Ordered top-to-bottom so
// validation focuses the first offending field.
const REQUIRED_FIELDS = [
  { id: "complaint-date", message: "This field is required.", invalid: (d) => isBlank(d.date) },
  { id: "complaint-mrn", message: "This field is required.", invalid: (d) => isBlank(d.mrn) },
  { id: "complaint-duration", message: "This field is required.", invalid: (d) => isBlank(d.duration) },
  { id: "complaint-symptoms", message: "This field is required.", invalid: (d) => isBlank(d.chiefComplaint) },
  { id: "complaint-injuryGrade", message: "Please select an option.", invalid: (d) => isBlank(d.injuryGrade) },
  { id: "complaint-nprs", message: "This field is required.", invalid: (d) => isBlank(d.complaint.nprs) },
  { id: "complaint-presentSince", message: "Please select an option.", invalid: (d) => isBlank(d.complaint.presentSince) },
  { id: "complaint-symptomsAtOnset", message: "Please select at least one option.", invalid: (d) => isEmptyList(d.complaint.symptomsAtOnset) },
  { id: "complaint-constantSymptoms", message: "Please select at least one option.", invalid: (d) => isEmptyList(d.complaint.constantSymptoms) },
  { id: "complaint-intermittentSymptoms", message: "Please select at least one option.", invalid: (d) => isEmptyList(d.complaint.intermittentSymptoms) },
  { id: "complaint-worse-position", message: "Please select at least one option.", invalid: (d) => isEmptyList(d.complaint.worse.position) },
  { id: "complaint-worse-timing", message: "Please select an option.", invalid: (d) => isBlank(d.complaint.worse.timing) },
  { id: "complaint-worse-activity", message: "Please select an option.", invalid: (d) => isBlank(d.complaint.worse.activity) },
  { id: "complaint-better-position", message: "Please select at least one option.", invalid: (d) => isEmptyList(d.complaint.better.position) },
  { id: "complaint-better-timing", message: "Please select an option.", invalid: (d) => isBlank(d.complaint.better.timing) },
  { id: "complaint-better-activity", message: "Please select an option.", invalid: (d) => isBlank(d.complaint.better.activity) },
  { id: "complaint-disturbedSleep", message: "Please select an option.", invalid: (d) => isBlank(d.complaint.disturbedSleep) },
  { id: "complaint-classification", message: "Please select an option.", invalid: (d) => isBlank(d.classification) },
];

export function ComplaintTab({ ref, patient, data, onChange }) {
  const [errors, setErrors] = useState({});

  // Expose validation to the parent's "Save Prescription" handler. Returns
  // true when everything required is filled; otherwise records per-field
  // errors, scrolls to and focuses the first offending field.
  useImperativeHandle(
    ref,
    () => ({
      validate() {
        const nextErrors = {};
        for (const field of REQUIRED_FIELDS) {
          if (field.invalid(data)) nextErrors[field.id] = field.message;
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
    [data]
  );

  // Drop any standing error for a field that the new data makes valid, so
  // the message clears the moment the user fixes it. New errors are only
  // ever raised by a save attempt (validate()).
  function commit(nextData) {
    setErrors((prev) => {
      const keys = Object.keys(prev);
      if (keys.length === 0) return prev;
      const next = {};
      for (const key of keys) {
        const field = REQUIRED_FIELDS.find((f) => f.id === key);
        if (field && field.invalid(nextData)) next[key] = prev[key];
      }
      return Object.keys(next).length === keys.length ? prev : next;
    });
    onChange(nextData);
  }

  function updateField(field, value) {
    commit({ ...data, [field]: value });
  }

  function updateComplaint(field, value) {
    commit({ ...data, complaint: { ...data.complaint, [field]: value } });
  }

  function updateWorseBetter(group, field, value) {
    commit({
      ...data,
      complaint: {
        ...data.complaint,
        [group]: { ...data.complaint[group], [field]: value },
      },
    });
  }

  return (
    <div className="space-y-8">
      <section>
        <SectionTitle>Patient Info</SectionTitle>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:grid-cols-4">
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Name</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Age / Gender</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {patient.age ?? "—"} / {patient.gender}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">Height / Weight</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {patient.heightFeet ?? "—"} ft / {patient.weightKg ?? "—"} kg
            </p>
          </div>
          <div>
            <span className="text-zinc-500 dark:text-zinc-400">BMI</span>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {patient.bmi ? patient.bmi.toFixed(1) : "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            id="complaint-date"
            label="Date"
            type="date"
            required
            error={errors["complaint-date"]}
            value={data.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
          <TextField
            id="complaint-mrn"
            label="MRN"
            required
            error={errors["complaint-mrn"]}
            value={data.mrn}
            onChange={(e) => updateField("mrn", e.target.value)}
            placeholder="Medical record no."
          />
          <TextField
            id="complaint-duration"
            label="Duration"
            required
            error={errors["complaint-duration"]}
            value={data.duration}
            onChange={(e) => updateField("duration", e.target.value)}
            placeholder="e.g. 3 weeks"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="complaint-symptoms"
            label="Symptoms"
            required
            error={errors["complaint-symptoms"]}
            value={data.chiefComplaint}
            onChange={(e) => updateField("chiefComplaint", e.target.value)}
            placeholder="Chief complaint summary"
          />
          <RadioGroupField
            id="complaint-injuryGrade"
            label="Injury Grade"
            required
            error={errors["complaint-injuryGrade"]}
            options={INJURY_GRADES}
            value={data.injuryGrade}
            onChange={(value) => updateField("injuryGrade", value)}
          />
        </div>
      </section>

      <section>
        <SectionTitle>Patient Complaint</SectionTitle>
        <div className="space-y-4">
          <TextField
            id="complaint-nprs"
            label="NPRS (0-10)"
            type="number"
            min={0}
            max={10}
            required
            error={errors["complaint-nprs"]}
            className="max-w-[10rem]"
            value={data.complaint.nprs}
            onChange={(e) => updateComplaint("nprs", e.target.value)}
          />

          <RadioGroupField
            id="complaint-presentSince"
            label="Present Since"
            required
            error={errors["complaint-presentSince"]}
            options={PRESENT_SINCE_OPTIONS}
            value={data.complaint.presentSince}
            onChange={(value) => updateComplaint("presentSince", value)}
          />

          <CheckboxGroupField
            id="complaint-symptomsAtOnset"
            label="Symptoms at Onset"
            required
            error={errors["complaint-symptomsAtOnset"]}
            options={BODY_REGION_OPTIONS}
            values={data.complaint.symptomsAtOnset}
            onChange={(values) => updateComplaint("symptomsAtOnset", values)}
          />

          <CheckboxGroupField
            id="complaint-constantSymptoms"
            label="Constant Symptoms"
            required
            error={errors["complaint-constantSymptoms"]}
            options={BODY_REGION_OPTIONS}
            values={data.complaint.constantSymptoms}
            onChange={(values) => updateComplaint("constantSymptoms", values)}
          />

          <CheckboxGroupField
            id="complaint-intermittentSymptoms"
            label="Intermittent Symptoms"
            required
            error={errors["complaint-intermittentSymptoms"]}
            options={BODY_REGION_OPTIONS}
            values={data.complaint.intermittentSymptoms}
            onChange={(values) => updateComplaint("intermittentSymptoms", values)}
          />

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Worse</p>
            <div className="space-y-3">
              <CheckboxGroupField
                id="complaint-worse-position"
                label="Position"
                required
                error={errors["complaint-worse-position"]}
                options={RESPONSE_POSITION_OPTIONS}
                values={data.complaint.worse.position}
                onChange={(values) => updateWorseBetter("worse", "position", values)}
              />
              <RadioGroupField
                id="complaint-worse-timing"
                label="Time of day"
                required
                error={errors["complaint-worse-timing"]}
                options={RESPONSE_TIMING_OPTIONS}
                value={data.complaint.worse.timing}
                onChange={(value) => updateWorseBetter("worse", "timing", value)}
              />
              <RadioGroupField
                id="complaint-worse-activity"
                label="Activity"
                required
                error={errors["complaint-worse-activity"]}
                options={RESPONSE_ACTIVITY_OPTIONS}
                value={data.complaint.worse.activity}
                onChange={(value) => updateWorseBetter("worse", "activity", value)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Better</p>
            <div className="space-y-3">
              <CheckboxGroupField
                id="complaint-better-position"
                label="Position"
                required
                error={errors["complaint-better-position"]}
                options={RESPONSE_POSITION_OPTIONS}
                values={data.complaint.better.position}
                onChange={(values) => updateWorseBetter("better", "position", values)}
              />
              <RadioGroupField
                id="complaint-better-timing"
                label="Time of day"
                required
                error={errors["complaint-better-timing"]}
                options={RESPONSE_TIMING_OPTIONS}
                value={data.complaint.better.timing}
                onChange={(value) => updateWorseBetter("better", "timing", value)}
              />
              <RadioGroupField
                id="complaint-better-activity"
                label="Activity"
                required
                error={errors["complaint-better-activity"]}
                options={RESPONSE_ACTIVITY_OPTIONS}
                value={data.complaint.better.activity}
                onChange={(value) => updateWorseBetter("better", "activity", value)}
              />
            </div>
          </div>

          <RadioGroupField
            id="complaint-disturbedSleep"
            label="Disturbed Sleep"
            required
            error={errors["complaint-disturbedSleep"]}
            options={YES_NO_OPTIONS}
            value={data.complaint.disturbedSleep}
            onChange={(value) => updateComplaint("disturbedSleep", value)}
          />

          <TextAreaField
            label="Present Symptoms"
            rows={3}
            value={data.complaint.presentSymptoms}
            onChange={(e) => updateComplaint("presentSymptoms", e.target.value)}
          />
        </div>
      </section>

      <section>
        <SectionTitle>Body Chart</SectionTitle>
        <BodyChart
          markings={data.bodyChartMarkings}
          onChange={(markings) => updateField("bodyChartMarkings", markings)}
        />
      </section>

      <section>
        <SectionTitle>Treatment Plan</SectionTitle>
        <TextAreaField
          label="Treatment Plan"
          rows={5}
          value={data.treatmentPlan}
          onChange={(e) => updateField("treatmentPlan", e.target.value)}
        />
        <div className="mt-4">
          <RadioGroupField
            id="complaint-classification"
            label="Classification"
            required
            error={errors["complaint-classification"]}
            options={CLASSIFICATIONS}
            value={data.classification}
            onChange={(value) => updateField("classification", value)}
          />
        </div>
      </section>
    </div>
  );
}
