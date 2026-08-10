"use client";

import { useMemo } from "react";
import { TextField } from "@/components/ui/TextField";
import { SelectField } from "@/components/ui/SelectField";

export const GENDER_OPTIONS = ["Male", "Female", "Other"];

export const PROFESSION_OPTIONS = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Businessperson",
  "Student",
  "Government Employee",
  "Laborer",
  "Housewife",
  "Retired",
  "Other",
];

const NAME_PATTERN = /^[A-Za-z\s]+$/;
const MOBILE_PATTERN = /^(0092|\+92|0)3\d{9}$/;
const CNIC_PATTERN = /^\d{5}-\d{7}-\d{1}$/;
const AGE_PATTERN = /^\d{1,3}$/;
const HEIGHT_FEET_PATTERN = /^\d{1,2}(\.\d{1,2})?$/;
const WEIGHT_KG_PATTERN = /^\d{1,3}(\.\d{1,2})?$/;

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function calculateBmi(heightCm, weightKg) {
  const height = Number(heightCm);
  const weight = Number(weightKg);

  if (!height || !weight || height <= 0 || weight <= 0) return null;

  const heightMeters = height / 100;

  return weight / (heightMeters * heightMeters);
}

export function getBmiCategory(bmi) {
  if (bmi === null) return null;
  if (bmi < 18.5)
    return { label: "Underweight", className: "text-sky-600 dark:text-sky-400" };
  if (bmi < 25)
    return {
      label: "Normal weight",
      className: "text-teal-600 dark:text-teal-400",
    };
  if (bmi < 30)
    return {
      label: "Overweight",
      className: "text-amber-600 dark:text-amber-400",
    };
  return { label: "Obesity", className: "text-red-600 dark:text-red-400" };
}

export function emptyPatientForm(patient) {
  if (!patient) {
    return {
      firstName: "",
      lastName: "",
      contactNumber: "",
      address: "",
      gender: "",
      profession: "",
      cnic: "",
      referredBy: "",
      age: "",
      heightFeet: "",
      weightKg: "",
      createdAt: today(),
    };
  }

  return {
    firstName: patient.firstName ?? "",
    lastName: patient.lastName ?? "",
    contactNumber: patient.contactNumber ?? "",
    address: patient.address ?? "",
    gender: patient.gender ?? "",
    profession: patient.profession ?? "",
    cnic: patient.cnic ?? "",
    referredBy: patient.referredBy ?? "",
    age: patient.age ?? "",
    heightFeet: patient.heightFeet ?? "",
    weightKg: patient.weightKg ?? "",
    createdAt: patient.createdAt
      ? new Date(patient.createdAt).toISOString().slice(0, 10)
      : today(),
  };
}

export function formatCnic(value) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  return [digits.slice(0, 5), digits.slice(5, 12), digits.slice(12, 13)]
    .filter(Boolean)
    .join("-");
}

export function validatePatientForm(form) {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  else if (!NAME_PATTERN.test(form.firstName.trim()))
    errors.firstName = "Only letters are allowed.";

  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  else if (!NAME_PATTERN.test(form.lastName.trim()))
    errors.lastName = "Only letters are allowed.";

  if (!form.contactNumber.trim())
    errors.contactNumber = "Contact number is required.";
  else if (!MOBILE_PATTERN.test(form.contactNumber.trim()))
    errors.contactNumber =
      "Enter a valid Pakistani mobile number, e.g. 03001234567.";

  if (!form.address.trim()) errors.address = "Address is required.";

  if (!form.gender) errors.gender = "Gender is required.";

  if (!form.profession) errors.profession = "Profession is required.";

  if (!form.cnic.trim()) errors.cnic = "CNIC is required.";
  else if (!CNIC_PATTERN.test(form.cnic.trim()))
    errors.cnic = "Enter a valid CNIC, e.g. 12345-1234567-1.";

  if (!form.age.toString().trim()) errors.age = "Age is required.";
  else if (
    !AGE_PATTERN.test(form.age.toString().trim()) ||
    Number(form.age) <= 0 ||
    Number(form.age) > 149
  )
    errors.age = "Enter a valid age.";

  if (!form.heightFeet.toString().trim())
    errors.heightFeet = "Height is required.";
  else if (
    !HEIGHT_FEET_PATTERN.test(form.heightFeet.toString().trim()) ||
    Number(form.heightFeet) <= 0 ||
    Number(form.heightFeet) > 8
  )
    errors.heightFeet = "Enter a valid height in feet, e.g. 5.5.";

  if (!form.weightKg.toString().trim())
    errors.weightKg = "Weight is required.";
  else if (
    !WEIGHT_KG_PATTERN.test(form.weightKg.toString().trim()) ||
    Number(form.weightKg) <= 0 ||
    Number(form.weightKg) > 300
  )
    errors.weightKg = "Enter a valid weight in kg, e.g. 70.5.";

  if (!form.createdAt) errors.createdAt = "Created date is required.";

  return errors;
}

// Shared field layout used by both the "Add / Edit Patient" modal and the
// Patient Info tab on the prescription screen, so the two stay in sync
// instead of drifting into two slightly different forms.
export function PatientInfoFields({ form, errors, onFieldChange }) {
  const bmi = useMemo(
    () => calculateBmi(form.heightFeet, form.weightKg),
    [form.heightFeet, form.weightKg]
  );
  const bmiDisplay = bmi ? bmi.toFixed(1) : "";
  const bmiCategory = getBmiCategory(bmi);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="First Name"
          required
          value={form.firstName}
          onChange={(e) => onFieldChange("firstName", e.target.value)}
          error={errors.firstName}
          placeholder="e.g. Ahmed"
        />
        <TextField
          label="Last Name"
          required
          value={form.lastName}
          onChange={(e) => onFieldChange("lastName", e.target.value)}
          error={errors.lastName}
          placeholder="e.g. Khan"
        />
      </div>

      <TextField
        label="Contact Number"
        required
        type="tel"
        value={form.contactNumber}
        onChange={(e) => onFieldChange("contactNumber", e.target.value)}
        error={errors.contactNumber}
        placeholder="03001234567"
      />

      <TextField
        label="Address"
        required
        value={form.address}
        onChange={(e) => onFieldChange("address", e.target.value)}
        error={errors.address}
        placeholder="House / street / city"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Gender"
          required
          options={GENDER_OPTIONS}
          value={form.gender}
          onChange={(e) => onFieldChange("gender", e.target.value)}
          error={errors.gender}
        />
        <SelectField
          label="Profession"
          required
          options={PROFESSION_OPTIONS}
          value={form.profession}
          onChange={(e) => onFieldChange("profession", e.target.value)}
          error={errors.profession}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField
          label="Age"
          required
          type="number"
          inputMode="numeric"
          min={1}
          max={149}
          value={form.age}
          onChange={(e) => onFieldChange("age", e.target.value)}
          error={errors.age}
          placeholder="e.g. 35"
        />
        <TextField
          label="Height (cm)"
          required
          type="number"
          step="1"
          min={1}
          max={8}
          value={form.heightFeet}
          onChange={(e) => onFieldChange("heightFeet", e.target.value)}
          error={errors.heightFeet}
          placeholder="e.g. 5.7"
        />
        <TextField
          label="Weight (kg)"
          required
          type="number"
          step="0.1"
          min={1}
          max={300}
          value={form.weightKg}
          onChange={(e) => onFieldChange("weightKg", e.target.value)}
          error={errors.weightKg}
          placeholder="e.g. 70.5"
        />
      </div>

      <div>
        <TextField
          label="BMI"
          disabled
          value={bmiDisplay}
          placeholder="Auto-calculated from height & weight"
        />
        {bmiCategory && (
          <p className={`mt-1.5 text-xs font-medium ${bmiCategory.className}`}>
            {bmiCategory.label}
          </p>
        )}
      </div>

      <TextField
        label="CNIC"
        required
        inputMode="numeric"
        maxLength={15}
        value={form.cnic}
        onChange={(e) => onFieldChange("cnic", formatCnic(e.target.value))}
        error={errors.cnic}
        placeholder="12345-1234567-1"
      />

      <TextField
        label="Referred By"
        value={form.referredBy}
        onChange={(e) => onFieldChange("referredBy", e.target.value)}
        placeholder="Optional"
      />

      <TextField
        label="Customer Created At"
        required
        type="date"
        value={form.createdAt}
        onChange={(e) => onFieldChange("createdAt", e.target.value)}
        error={errors.createdAt}
      />
    </div>
  );
}
