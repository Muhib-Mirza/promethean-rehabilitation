"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { LineChart } from "@/components/ui/LineChart";
import { BarChartIcon } from "@/components/icons";
import {
  LEVEL_MIN,
  LEVEL_MAX,
  WEAKNESS_MIN,
  WEAKNESS_MAX,
  MECHANICAL_RESPONSE_GROUPS,
  MECHANICAL_RESPONSE_LEVEL_OPTIONS,
} from "@/lib/prescriptionOptions";

// Right / Left get consistent colours across every chart on the tab.
const RIGHT_COLOR = "#0d9488"; // teal-600
const LEFT_COLOR = "#e11d48"; // rose-600
const SINGLE_COLOR = "#0d9488";

const SESSION_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatSessionDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : SESSION_DATE_FORMATTER.format(date);
}

function toNumber(value) {
  if (value == null || String(value).trim() === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

// Mechanical-response dropdowns store a label ("Nil" … "Very Severe"); plot
// them on a 0-4 ordinal scale and map back to the label on the axis / tooltip.
function categoryToNumber(value) {
  const index = MECHANICAL_RESPONSE_LEVEL_OPTIONS.indexOf(value);
  return index === -1 ? null : index;
}

const NUMERIC_CHARTS = [
  { title: "Shoulder Level", section: "inclinometer", row: "shoulderLevel", region: "Shoulder", min: LEVEL_MIN, max: LEVEL_MAX },
  { title: "Pelvic Level", section: "inclinometer", row: "pelvicLevel", region: "Pelvis", min: LEVEL_MIN, max: LEVEL_MAX },
  { title: "Shoulder Weakness", section: "muscleTesting", row: "shoulderWeakness", region: "Shoulder", min: WEAKNESS_MIN, max: WEAKNESS_MAX },
  { title: "Pelvic Weakness", section: "muscleTesting", row: "pelvicWeakness", region: "Pelvis", min: WEAKNESS_MIN, max: WEAKNESS_MAX },
];

function ChartCard({ title, children }) {
  return (
    <figure className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <figcaption className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </figcaption>
      {children}
    </figure>
  );
}

export function ComparativeAnalysisTab({ data }) {
  const followUps = data.followUps ?? [];

  // Follow ups are stored newest-first; the trend reads oldest → newest.
  const sessions = [...followUps].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={BarChartIcon}
        title="No follow up sessions to compare"
        description="Add follow up sessions from the Follow Up tab. Each session becomes a point on these trend lines."
      />
    );
  }

  const points = sessions.map((session, index) => ({
    label: `S${index + 1}`,
    sublabel: formatSessionDate(session.date),
  }));

  return (
    <div className="space-y-8">
      {sessions.length === 1 && (
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
          Only one follow up session recorded so far. Add more sessions to see trend lines form.
        </p>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
          Levels &amp; Weakness
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {NUMERIC_CHARTS.map((chart) => (
            <ChartCard key={chart.title} title={chart.title}>
              <LineChart
                points={points}
                yMin={chart.min}
                yMax={chart.max}
                series={[
                  {
                    key: "right",
                    label: `Right ${chart.region}`,
                    color: RIGHT_COLOR,
                    values: sessions.map((s) => toNumber(s[chart.section]?.[chart.row]?.right)),
                  },
                  {
                    key: "left",
                    label: `Left ${chart.region}`,
                    color: LEFT_COLOR,
                    values: sessions.map((s) => toNumber(s[chart.section]?.[chart.row]?.left)),
                  },
                ]}
              />
            </ChartCard>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
          Symptomatic &amp; Mechanical Response
        </h3>
        <div className="space-y-6">
          {MECHANICAL_RESPONSE_GROUPS.map((group) => (
            <div key={group.key}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {group.rows.map((row) => (
                  <ChartCard key={row.key} title={row.label}>
                    <LineChart
                      points={points}
                      yMin={0}
                      yMax={MECHANICAL_RESPONSE_LEVEL_OPTIONS.length - 1}
                      yTicks={MECHANICAL_RESPONSE_LEVEL_OPTIONS.map((_, i) => i)}
                      formatY={(v) => MECHANICAL_RESPONSE_LEVEL_OPTIONS[v] ?? ""}
                      padLeft={104}
                      series={[
                        {
                          key: "value",
                          label: row.label,
                          color: SINGLE_COLOR,
                          values: sessions.map((s) =>
                            categoryToNumber(s.mechanicalResponse?.[group.key]?.[row.key])
                          ),
                        },
                      ]}
                    />
                  </ChartCard>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
