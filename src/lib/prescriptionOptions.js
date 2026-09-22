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

export const MECHANICAL_RESPONSE_LEVEL_OPTIONS = [
  "Nil",
  "Mild",
  "Moderate",
  "Severe",
  "Very Severe",
];

// Each "group" mirrors one bordered block of movement / Rep rows from the
// "Symptomatic and Mechanical Response" section of the form.
export const MECHANICAL_RESPONSE_GROUPS = [
  {
    key: "cervicalRepeated",
    title: "Protraction",
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

export const ASYMMETRY_ROWS = [{ key: "atlasRotation", label: "Atlas Rotation" }];

export const ASYMMETRY_COLUMNS = [
  { key: "rightAnt", label: "Right Ant" },
  { key: "rightPost", label: "Right Post" },
  { key: "leftAnt", label: "Left Ant" },
  { key: "leftPost", label: "Left Post" },
];

// Shoulder/Pelvic Level: a 0-20 (0.5 steps) reading per side, rather than
// the Right/Left Ant/Post checkbox grid used for the other asymmetry rows.
export const LEVEL_ROWS = [
  { key: "shoulderLevel", label: "Shoulder Level" },
  { key: "pelvicLevel", label: "Pelvic Level" },
];
export const LEVEL_MIN = 0;
export const LEVEL_MAX = 20;
export const LEVEL_STEP = 0.5;

// Shoulder/Pelvic Weakness: same Left/Right reading idea as LEVEL_ROWS, but
// a 0-5 (whole-step) grading instead.
export const WEAKNESS_ROWS = [
  { key: "shoulderWeakness", label: "Shoulder Weakness" },
  { key: "pelvicWeakness", label: "Pelvic Weakness" },
];
export const WEAKNESS_MIN = 0;
export const WEAKNESS_MAX = 5;
export const WEAKNESS_STEP = 1;

export const GMFCS_OPTIONS = ["Level I", "Level II", "Level III", "Level IV", "Level V"];

// Follow Up's Atlas Rotation is the same Ant/Post x Right/Left grid as the
// Examination tab's Atlas Findings, just grouped as 2 rows (Ant, Post) x 2
// columns (Right, Left) rather than 1 row x 4 columns.
export const FOLLOW_UP_ATLAS_ROWS = [
  { key: "ant", label: "Ant" },
  { key: "post", label: "Post" },
];
export const FOLLOW_UP_ATLAS_COLUMNS = [
  { key: "right", label: "Right" },
  { key: "left", label: "Left" },
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

export function emptyMechanicalResponse() {
  return Object.fromEntries(
    MECHANICAL_RESPONSE_GROUPS.map((group) => [
      group.key,
      Object.fromEntries(group.rows.map((row) => [row.key, ""])),
    ])
  );
}

// Generic row x column boolean grid, shared by the Examination tab's Atlas
// Findings (ASYMMETRY_ROWS/COLUMNS) and the Follow Up tab's Atlas Rotation
// (FOLLOW_UP_ATLAS_ROWS/COLUMNS).
export function emptyGrid(rows, columns) {
  return Object.fromEntries(
    rows.map((row) => [row.key, Object.fromEntries(columns.map((col) => [col.key, false]))])
  );
}

function emptyAsymmetryGrid() {
  return emptyGrid(ASYMMETRY_ROWS, ASYMMETRY_COLUMNS);
}

export function mergeGrid(rows, emptyGridValue, savedGrid) {
  return Object.fromEntries(
    rows.map((row) => [row.key, { ...emptyGridValue[row.key], ...savedGrid?.[row.key] }])
  );
}

// Shared shape for LEVEL_ROWS and WEAKNESS_ROWS: a Left/Right reading per
// row, each with its own numeric range.
export function emptyLeftRightGroup(rows) {
  return Object.fromEntries(rows.map((row) => [row.key, { left: "", right: "" }]));
}

export function mergeLeftRightGroup(rows, emptyGroup, savedGroup) {
  return mergeGrid(rows, emptyGroup, savedGroup);
}

// One entry in the Follow Up tab's history — captured each time "Add new
// Patient Follow Up" is submitted, so past entries stay untouched even as
// the empty shape below gains fields later.
export function emptyFollowUpEntry() {
  return {
    id: "",
    date: "",
    gmfcs: "",
    atlasRotation: emptyGrid(FOLLOW_UP_ATLAS_ROWS, FOLLOW_UP_ATLAS_COLUMNS),
    inclinometer: emptyLeftRightGroup(LEVEL_ROWS),
    muscleTesting: emptyLeftRightGroup(WEAKNESS_ROWS),
    mechanicalResponse: emptyMechanicalResponse(),
  };
}

export function mergeFollowUpEntry(saved) {
  const empty = emptyFollowUpEntry();
  if (!saved || typeof saved !== "object") return empty;

  return {
    ...empty,
    ...saved,
    atlasRotation: mergeGrid(FOLLOW_UP_ATLAS_ROWS, empty.atlasRotation, saved.atlasRotation),
    inclinometer: mergeLeftRightGroup(LEVEL_ROWS, empty.inclinometer, saved.inclinometer),
    muscleTesting: mergeLeftRightGroup(WEAKNESS_ROWS, empty.muscleTesting, saved.muscleTesting),
    mechanicalResponse: { ...empty.mechanicalResponse, ...saved.mechanicalResponse },
  };
}

export function emptyPrescriptionData() {
  return {
    date: "",
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
      levels: emptyLeftRightGroup(LEVEL_ROWS),
      weakness: emptyLeftRightGroup(WEAKNESS_ROWS),
      labs: [],
      labsNotes: { mriSite: "", ctSite: "" },
      // Free-text report detail per labs/radiology item (LABS_ITEMS id -> text),
      // entered via the modal opened from each item's report-detail button.
      labsReportDetails: {},
    },
    followUps: [],
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
      levels: mergeLeftRightGroup(LEVEL_ROWS, empty.examination.levels, saved.examination?.levels),
      weakness: mergeLeftRightGroup(
        WEAKNESS_ROWS,
        empty.examination.weakness,
        saved.examination?.weakness
      ),
      labsNotes: { ...empty.examination.labsNotes, ...saved.examination?.labsNotes },
      labsReportDetails: {
        ...empty.examination.labsReportDetails,
        ...saved.examination?.labsReportDetails,
      },
    },
    followUps: Array.isArray(saved.followUps) ? saved.followUps.map(mergeFollowUpEntry) : [],
  };
}
