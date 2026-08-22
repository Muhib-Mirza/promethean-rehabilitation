// Sample patients shown ONLY when the real database is unreachable. Safe to
// delete this whole `src/mock-data/` folder once a real database is
// connected — see README.md for the exact call sites to revert.

function calcBmi(heightCm, weightKg) {
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export const MOCK_PATIENTS = [
  {
    id: 900001,
    firstName: "Ayesha",
    lastName: "Siddiqui",
    contactNumber: "03214567890",
    address: "House 12, Street 4, F-10, Islamabad",
    gender: "Female",
    profession: "Teacher",
    cnic: "61101-1234567-1",
    referredBy: "Dr. Kamran Malik",
    age: 34,
    heightFeet: 162,
    weightKg: 64,
    bmi: calcBmi(162, 64),
    bodyChartMarkings: JSON.stringify([
      { region: 9, color: "#ef4444" },
      { region: 34, color: "#3b82f6" },
    ]),
    createdAt: new Date("2026-05-12T00:00:00.000Z"),
  },
  {
    id: 900002,
    firstName: "Bilal",
    lastName: "Ahmed",
    contactNumber: "03331234567",
    address: "Flat 3B, Al-Noor Residency, Gulshan-e-Iqbal, Karachi",
    gender: "Male",
    profession: "Engineer",
    cnic: "42101-7654321-3",
    referredBy: null,
    age: 41,
    heightFeet: 175,
    weightKg: 82,
    bmi: calcBmi(175, 82),
    bodyChartMarkings: JSON.stringify([{ region: 24, color: "#f97316" }]),
    createdAt: new Date("2026-06-20T00:00:00.000Z"),
  },
];

const ayeshaPrescriptionData = {
  date: "2026-06-01",
  mrn: "PRC-2026-0142",
  chiefComplaint: "Chronic lower back pain radiating to left leg",
  injuryGrade: "III",
  duration: "8 weeks",
  complaint: {
    nprs: "6",
    presentSince: "Unchanging",
    symptomsAtOnset: ["Back", "Leg"],
    constantSymptoms: ["Back"],
    intermittentSymptoms: ["Leg"],
    worse: { position: ["Sitting", "Bending"], timing: "PM", activity: "On the move" },
    better: { position: ["Lying"], timing: "AM", activity: "When still" },
    disturbedSleep: "Yes",
    presentSymptoms: "Dull ache at rest, sharp pain on forward flexion and prolonged sitting.",
  },
  treatmentPlan: "McKenzie extension protocol, manual therapy 2x/week, core stabilization program.",
  classification: "Dysfunction",
  bodyChartMarkings: [
    { region: 9, color: "#ef4444" },
    { region: 34, color: "#3b82f6" },
  ],
  examination: {
    postural: {
      sitting: "Slump",
      standing: "Kyphotic",
      shiftRelevant: "Yes",
      changeOfPosture: "Worse",
      protrudedHead: "No",
      lateralDeviation: "Right",
      lateralShift: "Nil",
      lateralDeviationRelevant: "Yes",
      otherObservations: "Reduced lumbar lordosis, mildly guarded gait.",
    },
    neurological: {
      motorDeficit: "Nil",
      sensoryDeficit: "Nil",
      reflexes: "Normal, symmetrical",
      neurodynamicTests: "SLR negative bilaterally",
    },
    mechanicalResponse: {
      cervicalRepeated: { pretest: "Nil", PRO: "Nil", repPRO: "Nil", RET: "Nil", repRET: "Nil", RETEXT: "Nil", repRETEXT: "Nil" },
      retraction: { pretest: "Mild", RET: "Mild", repRET: "Nil", RETEXT: "Nil", repRETEXT: "Nil" },
      lateralAndRotation: {
        pretest: "Moderate", LF_R: "Mild", repLF_R: "Nil", LF_L: "Moderate", repLF_L: "Mild",
        ROT_R: "Nil", repROT_R: "Nil", ROT_L: "Mild", repROT_L: "Nil", FLEX: "Severe", repFLEX: "Moderate",
      },
      standing: { pretest: "Severe", FIS: "Severe", repFIS: "Moderate", EIS: "Mild", repEIS: "Nil" },
      lying: { pretest: "Moderate", FIL: "Moderate", repFIL: "Mild", EIL: "Nil", repEIL: "Nil" },
      sideGlide: { pretest: "Nil", SGIS_R: "Nil", repSGIS_R: "Nil", SGIS_L: "Nil", repSGIS_L: "Nil" },
    },
    asymmetry: {
      atlasRotation: { rightAnt: false, rightPost: false, leftAnt: false, leftPost: false },
      shoulderLevel: { rightAnt: true, rightPost: false, leftAnt: false, leftPost: false },
      pelvicLevel: { rightAnt: false, rightPost: true, leftAnt: false, leftPost: false },
      shoulderWeakness: { rightAnt: false, rightPost: false, leftAnt: false, leftPost: false },
      pelvicWeakness: { rightAnt: false, rightPost: false, leftAnt: true, leftPost: false },
    },
    labs: [20, 27],
    labsNotes: { mriSite: "Lumbar spine L4-S1", ctSite: "" },
    labsReportDetails: {
      20: "Mild disc bulge L4-L5, no nerve root compression.",
      27: "MRI confirms mild L4-L5 disc desiccation, no significant stenosis.",
    },
  },
};

const bilalPrescriptionData = {
  date: "2026-06-20",
  mrn: "PRC-2026-0158",
  chiefComplaint: "Right shoulder pain after gym injury",
  injuryGrade: "II",
  duration: "3 weeks",
  complaint: {
    nprs: "4",
    presentSince: "Improving",
    symptomsAtOnset: ["Arm"],
    constantSymptoms: [],
    intermittentSymptoms: ["Arm"],
    worse: { position: ["Rising"], timing: "AM", activity: "On the move" },
    better: { position: ["Lying"], timing: "PM", activity: "When still" },
    disturbedSleep: "No",
    presentSymptoms: "Sharp pain on overhead reaching, improving steadily with rest.",
  },
  treatmentPlan: "Rotator cuff strengthening, activity modification, ice as needed.",
  classification: "Derangement",
  bodyChartMarkings: [{ region: 24, color: "#f97316" }],
  examination: {
    postural: {
      sitting: "Neutral",
      standing: "Neutral",
      shiftRelevant: "No",
      changeOfPosture: "No Effect",
      protrudedHead: "No",
      lateralDeviation: "Nil",
      lateralShift: "Nil",
      lateralDeviationRelevant: "No",
      otherObservations: "Slight right shoulder elevation on active abduction.",
    },
    neurological: {
      motorDeficit: "Nil",
      sensoryDeficit: "Nil",
      reflexes: "Normal",
      neurodynamicTests: "Not indicated",
    },
    labs: [24],
    labsNotes: { mriSite: "", ctSite: "" },
    labsReportDetails: {
      24: "Awaiting radiology report — pending follow-up.",
    },
  },
};

// Keyed by patient id, matching the shape of Prisma's `patient.prescription`
// relation (`data` is the JSON-stringified prescription, `updatedAt` a Date).
export const MOCK_PRESCRIPTIONS = {
  900001: {
    id: 800001,
    patientId: 900001,
    data: JSON.stringify(ayeshaPrescriptionData),
    updatedAt: new Date("2026-06-01T09:30:00.000Z"),
  },
  900002: {
    id: 800002,
    patientId: 900002,
    data: JSON.stringify(bilalPrescriptionData),
    updatedAt: new Date("2026-06-20T14:05:00.000Z"),
  },
};

export function getMockPatientById(id) {
  return MOCK_PATIENTS.find((p) => p.id === id) ?? null;
}
