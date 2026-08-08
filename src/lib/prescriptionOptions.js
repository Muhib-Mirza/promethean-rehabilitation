// Option lists and default shape for the digitized "Promethean Rehabilitation"
// prescription form (patient complaint + examination, 2 pages on paper).
// Kept separate from the tab components so both tabs and any future reporting
// / print view can share the same vocabulary.

export const INJURY_GRADES = ["I", "II", "III", "IV"];

export const CLASSIFICATIONS = ["Derangement", "Dysfunction", "Postural", "Others"];

export const PRESENT_SINCE_OPTIONS = ["Improving", "Unchanging", "Worsening"];

export const BODY_REGION_OPTIONS = [
  "Neck",
  "Arm",
  "Forearm",
  "Hand",
  "Back",
  "Thigh",
  "Leg",
  "Foot",
];

export const RESPONSE_POSITION_OPTIONS = ["Bending", "Sitting", "Turning", "Lying", "Rising"];
export const RESPONSE_TIMING_OPTIONS = ["AM", "As the day progresses", "PM"];
export const RESPONSE_ACTIVITY_OPTIONS = ["When still", "On the move"];

export const YES_NO_OPTIONS = ["Yes", "No"];

export const SITTING_OPTIONS = ["Erect", "Neutral", "Slump"];
export const STANDING_OPTIONS = ["Lordotic", "Neutral", "Kyphotic"];
export const CHANGE_OF_POSTURE_OPTIONS = ["Better", "Worse", "No Effect"];
export const LATERAL_OPTIONS = ["Right", "Left", "Nil"];

// Each "group" mirrors one bordered block of Pretest Symptom / movement / Rep
// rows from the "Symptomatic and Mechanical Response" section of the form.
export const MECHANICAL_RESPONSE_GROUPS = [
  {
    key: "cervicalRepeated",
    title: "Repeated Movements",
    rows: [
      { key: "PRO", label: "PRO" },
      { key: "repPRO", label: "Rep PRO" },
      { key: "RET", label: "RET" },
      { key: "repRET", label: "Rep RET" },
      { key: "RETEXT", label: "RET EXT" },
      { key: "repRETEXT", label: "Rep RET EXT" },
    ],
  },
  {
    key: "retraction",
    title: "Retraction",
    rows: [
      { key: "RET", label: "RET" },
      { key: "repRET", label: "Rep RET" },
      { key: "RETEXT", label: "RET EXT" },
      { key: "repRETEXT", label: "Rep RET EXT" },
    ],
  },
  {
    key: "lateralAndRotation",
    title: "Lateral Flexion / Rotation / Flexion",
    rows: [
      { key: "LF_R", label: "LF - R" },
      { key: "repLF_R", label: "Rep LF - R" },
      { key: "LF_L", label: "LF - L" },
      { key: "repLF_L", label: "Rep LF - L" },
      { key: "ROT_R", label: "ROT - R" },
      { key: "repROT_R", label: "Rep ROT - R" },
      { key: "ROT_L", label: "ROT - L" },
      { key: "repROT_L", label: "Rep ROT - L" },
      { key: "FLEX", label: "FLEX" },
      { key: "repFLEX", label: "Rep FLEX" },
    ],
  },
  {
    key: "standing",
    title: "Flexion / Extension in Standing",
    rows: [
      { key: "FIS", label: "FIS" },
      { key: "repFIS", label: "Rep FIS" },
      { key: "EIS", label: "EIS" },
      { key: "repEIS", label: "Rep EIS" },
    ],
  },
  {
    key: "lying",
    title: "Flexion / Extension in Lying",
    rows: [
      { key: "FIL", label: "FIL" },
      { key: "repFIL", label: "Rep FIL" },
      { key: "EIL", label: "EIL" },
      { key: "repEIL", label: "Rep EIL" },
    ],
  },
  {
    key: "sideGlide",
    title: "Side Glide in Standing",
    rows: [
      { key: "SGIS_R", label: "SGIS - R" },
      { key: "repSGIS_R", label: "Rep SGIS - R" },
      { key: "SGIS_L", label: "SGIS - L" },
      { key: "repSGIS_L", label: "Rep SGIS - L" },
    ],
  },
];

export const ASYMMETRY_ROWS = [
  { key: "atlasRotation", label: "Atlas Rotation" },
  { key: "shoulderLevel", label: "Shoulder Level" },
  { key: "pelvicLevel", label: "Pelvic Level" },
  { key: "shoulderWeakness", label: "Shoulder Weakness" },
  { key: "pelvicWeakness", label: "Pelvic Weakness" },
];

export const ASYMMETRY_COLUMNS = [
  { key: "rightAnt", label: "Right Ant" },
  { key: "rightPost", label: "Right Post" },
  { key: "leftAnt", label: "Left Ant" },
  { key: "leftPost", label: "Left Post" },
];

export const LABS_ITEMS = [
  { id: 1, label: "CBC" },
  { id: 2, label: "ESR" },
  { id: 3, label: "CRP" },
  { id: 4, label: "RFTs" },
  { id: 5, label: "Uric Acid" },
  { id: 6, label: "HbA1C" },
  { id: 7, label: "LFTs" },
  { id: 8, label: "Serum Calcium" },
  { id: 9, label: "Serum Phosphorous" },
  { id: 10, label: "Serum Protein" },
  { id: 11, label: "Serum Alkaline Phosphatase" },
  { id: 12, label: "Serum Vitamin D Active" },
  { id: 13, label: "Serum CPK" },
  { id: 14, label: "RA (Quantitative)" },
  { id: 15, label: "Anti-CCP" },
  { id: 16, label: "HLA-B27" },
  { id: 17, label: "Hbs Antigen / Anti-HCV / HIV" },
  { id: 18, label: "X-rays Cervical Spine 4 Views" },
  { id: 19, label: "X-rays Dorsal Spine (AP + Lat)" },
  { id: 20, label: "X-rays Lumbosacral (AP + Lat)" },
  { id: 21, label: "X-rays Both Hips (AP + Lat)" },
  { id: 22, label: "X-rays Both Knees (AP-Standing + Lat)" },
  { id: 23, label: "X-rays Both Ankle & Feet (AP + Lat)" },
  { id: 24, label: "X-rays Both Shoulder (AP + Lat)" },
  { id: 25, label: "X-rays Both Elbows (AP + Lat)" },
  { id: 26, label: "X-rays Both Wrist and Hand (AP + Lat)" },
  { id: 27, label: "MRI-Scan" },
  { id: 28, label: "CT-Scan" },
  { id: 29, label: "Bone Scan Tc 99 MDP" },
];

function emptyMechanicalResponse() {
  return Object.fromEntries(
    MECHANICAL_RESPONSE_GROUPS.map((group) => [
      group.key,
      { pretest: "", ...Object.fromEntries(group.rows.map((row) => [row.key, ""])) },
    ])
  );
}

function emptyAsymmetryGrid() {
  return Object.fromEntries(
    ASYMMETRY_ROWS.map((row) => [
      row.key,
      Object.fromEntries(ASYMMETRY_COLUMNS.map((col) => [col.key, false])),
    ])
  );
}

export function emptyPrescriptionData() {
  return {
    date: "",
    mrn: "",
    chiefComplaint: "",
    injuryGrade: "",
    duration: "",
    complaint: {
      nprs: "",
      presentSince: "",
      symptomsAtOnset: [],
      constantSymptoms: [],
      intermittentSymptoms: [],
      worse: { position: [], timing: "", activity: "" },
      better: { position: [], timing: "", activity: "" },
      disturbedSleep: "",
      presentSymptoms: "",
    },
    treatmentPlan: "",
    classification: "",
    bodyChartMarkings: [],
    examination: {
      postural: {
        sitting: "",
        standing: "",
        shiftRelevant: "",
        changeOfPosture: "",
        protrudedHead: "",
        lateralDeviation: "",
        lateralShift: "",
        lateralDeviationRelevant: "",
        otherObservations: "",
      },
      neurological: {
        motorDeficit: "",
        sensoryDeficit: "",
        reflexes: "",
        neurodynamicTests: "",
      },
      mechanicalResponse: emptyMechanicalResponse(),
      asymmetry: emptyAsymmetryGrid(),
      labs: [],
      labsNotes: { mriSite: "", ctSite: "" },
    },
  };
}

// Merge saved JSON with the current default shape so newly added fields
// don't crash older saved records (or vice versa) — deep merge one level
// per known nested object.
export function mergePrescriptionData(saved) {
  const empty = emptyPrescriptionData();
  if (!saved || typeof saved !== "object") return empty;

  return {
    ...empty,
    ...saved,
    complaint: {
      ...empty.complaint,
      ...saved.complaint,
      worse: { ...empty.complaint.worse, ...saved.complaint?.worse },
      better: { ...empty.complaint.better, ...saved.complaint?.better },
    },
    examination: {
      ...empty.examination,
      ...saved.examination,
      postural: { ...empty.examination.postural, ...saved.examination?.postural },
      neurological: { ...empty.examination.neurological, ...saved.examination?.neurological },
      mechanicalResponse: {
        ...empty.examination.mechanicalResponse,
        ...saved.examination?.mechanicalResponse,
      },
      asymmetry: { ...empty.examination.asymmetry, ...saved.examination?.asymmetry },
      labsNotes: { ...empty.examination.labsNotes, ...saved.examination?.labsNotes },
    },
  };
}
