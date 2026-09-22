// Patient MRN generator. Format: "PR-11025-190798" — "PR-" followed by an
// 11-digit number split 5+6. The 11-digit number is treated as one
// contiguous integer that always increments by 1 for each new patient
// (never a per-segment counter), starting from MRN_START.
const PREFIX = "PR-";
const MRN_START = 11025190798n;

export function formatMrn(value) {
  const digits = value.toString().padStart(11, "0");
  return `${PREFIX}${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function parseMrn(mrn) {
  return BigInt(mrn.replace(/\D/g, ""));
}

// mrn is fixed-width and numeric, so lexicographic and numeric ordering
// agree — a single "order by desc, take 1" query gives the current max
// without scanning the table.
export async function nextMrn(prisma) {
  const last = await prisma.patient.findFirst({
    orderBy: { mrn: "desc" },
    select: { mrn: true },
  });
  const next = last ? parseMrn(last.mrn) + 1n : MRN_START;
  return formatMrn(next);
}
