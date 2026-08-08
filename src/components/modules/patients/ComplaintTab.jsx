"use client";

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

export function ComplaintTab({ patient, data, onChange }) {
  function updateField(field, value) {
    onChange({ ...data, [field]: value });
  }

  function updateComplaint(field, value) {
    onChange({ ...data, complaint: { ...data.complaint, [field]: value } });
  }

  function updateWorseBetter(group, field, value) {
    onChange({
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
            label="Date"
            type="date"
            value={data.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
          <TextField
            label="MRN"
            value={data.mrn}
            onChange={(e) => updateField("mrn", e.target.value)}
            placeholder="Medical record no."
          />
          <TextField
            label="Duration"
            value={data.duration}
            onChange={(e) => updateField("duration", e.target.value)}
            placeholder="e.g. 3 weeks"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Symptoms"
            value={data.chiefComplaint}
            onChange={(e) => updateField("chiefComplaint", e.target.value)}
            placeholder="Chief complaint summary"
          />
          <RadioGroupField
            label="Injury Grade"
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
            label="NPRS (0-10)"
            type="number"
            min={0}
            max={10}
            className="max-w-[10rem]"
            value={data.complaint.nprs}
            onChange={(e) => updateComplaint("nprs", e.target.value)}
          />

          <RadioGroupField
            label="Present Since"
            options={PRESENT_SINCE_OPTIONS}
            value={data.complaint.presentSince}
            onChange={(value) => updateComplaint("presentSince", value)}
          />

          <CheckboxGroupField
            label="Symptoms at Onset"
            options={BODY_REGION_OPTIONS}
            values={data.complaint.symptomsAtOnset}
            onChange={(values) => updateComplaint("symptomsAtOnset", values)}
          />

          <CheckboxGroupField
            label="Constant Symptoms"
            options={BODY_REGION_OPTIONS}
            values={data.complaint.constantSymptoms}
            onChange={(values) => updateComplaint("constantSymptoms", values)}
          />

          <CheckboxGroupField
            label="Intermittent Symptoms"
            options={BODY_REGION_OPTIONS}
            values={data.complaint.intermittentSymptoms}
            onChange={(values) => updateComplaint("intermittentSymptoms", values)}
          />

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Worse</p>
            <div className="space-y-3">
              <CheckboxGroupField
                label="Position"
                options={RESPONSE_POSITION_OPTIONS}
                values={data.complaint.worse.position}
                onChange={(values) => updateWorseBetter("worse", "position", values)}
              />
              <RadioGroupField
                label="Time of day"
                options={RESPONSE_TIMING_OPTIONS}
                value={data.complaint.worse.timing}
                onChange={(value) => updateWorseBetter("worse", "timing", value)}
              />
              <RadioGroupField
                label="Activity"
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
                label="Position"
                options={RESPONSE_POSITION_OPTIONS}
                values={data.complaint.better.position}
                onChange={(values) => updateWorseBetter("better", "position", values)}
              />
              <RadioGroupField
                label="Time of day"
                options={RESPONSE_TIMING_OPTIONS}
                value={data.complaint.better.timing}
                onChange={(value) => updateWorseBetter("better", "timing", value)}
              />
              <RadioGroupField
                label="Activity"
                options={RESPONSE_ACTIVITY_OPTIONS}
                value={data.complaint.better.activity}
                onChange={(value) => updateWorseBetter("better", "activity", value)}
              />
            </div>
          </div>

          <RadioGroupField
            label="Disturbed Sleep"
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
            label="Classification"
            options={CLASSIFICATIONS}
            value={data.classification}
            onChange={(value) => updateField("classification", value)}
          />
        </div>
      </section>
    </div>
  );
}
