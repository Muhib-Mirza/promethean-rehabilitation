"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ActivityIcon, TrashIcon } from "@/components/icons";
import { FollowUpModal } from "@/components/modules/patients/FollowUpModal";
import {
  FOLLOW_UP_ATLAS_ROWS,
  FOLLOW_UP_ATLAS_COLUMNS,
  LEVEL_ROWS,
  WEAKNESS_ROWS,
  MECHANICAL_RESPONSE_GROUPS,
} from "@/lib/prescriptionOptions";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function formatDate(iso) {
  try {
    return DATE_FORMATTER.format(new Date(iso));
  } catch {
    return iso;
  }
}

function ReadingSummary({ title, rows, values }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {rows.map((row) => (
          <div key={row.key} className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400">{row.label}</p>
            <p className="text-zinc-900 dark:text-zinc-50">
              R: {values[row.key].right || "—"} / L: {values[row.key].left || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowUpEntryCard({ entry, index, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const mechanicalGroupsWithData = MECHANICAL_RESPONSE_GROUPS.filter((group) =>
    group.rows.some((row) => entry.mechanicalResponse[group.key][row.key])
  );

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Follow Up #{index + 1} — {formatDate(entry.date)}
          </p>
          {entry.gmfcs && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">GMFCS: {entry.gmfcs}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide Details" : "View Details"}
          </Button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete follow up"
            title="Delete follow up"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Atlas Rotation
            </p>
            <div className="grid grid-cols-2 gap-2">
              {FOLLOW_UP_ATLAS_ROWS.map((row) => (
                <div key={row.key} className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
                  <p className="text-zinc-500 dark:text-zinc-400">{row.label}</p>
                  <p className="text-zinc-900 dark:text-zinc-50">
                    {FOLLOW_UP_ATLAS_COLUMNS.filter((col) => entry.atlasRotation[row.key][col.key])
                      .map((col) => col.label)
                      .join(", ") || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ReadingSummary title="Inclinometer Readings" rows={LEVEL_ROWS} values={entry.inclinometer} />
          <ReadingSummary title="Manual Muscle Testing" rows={WEAKNESS_ROWS} values={entry.muscleTesting} />

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Symptomatic and Mechanical Response
            </p>
            {mechanicalGroupsWithData.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No response recorded.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {mechanicalGroupsWithData.map((group) => (
                  <div key={group.key} className="rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800">
                    <p className="mb-1 font-medium text-zinc-700 dark:text-zinc-300">{group.title}</p>
                    {group.rows
                      .filter((row) => entry.mechanicalResponse[group.key][row.key])
                      .map((row) => (
                        <p key={row.key} className="text-zinc-500 dark:text-zinc-400">
                          {row.label}: {entry.mechanicalResponse[group.key][row.key]}
                        </p>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FollowUpTab({ data, onChange }) {
  const followUps = data.followUps ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function addFollowUp(entry) {
    onChange({ ...data, followUps: [entry, ...followUps] });
  }

  function confirmDelete() {
    onChange({ ...data, followUps: followUps.filter((entry) => entry.id !== pendingDeleteId) });
    setPendingDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button type="button" onClick={() => setModalOpen(true)}>
          Add Patient's Follow Up Session
        </Button>
      </div>

      {followUps.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No follow ups recorded yet"
          description='Click "Add new Patient Follow Up" to capture GMFCS, Atlas Rotation, Inclinometer, Muscle Testing and Mechanical Response readings for this visit.'
        />
      ) : (
        <div className="space-y-4">
          {followUps.map((entry, index) => (
            <FollowUpEntryCard
              key={entry.id}
              entry={entry}
              index={followUps.length - 1 - index}
              onDelete={() => setPendingDeleteId(entry.id)}
            />
          ))}
        </div>
      )}

      <FollowUpModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addFollowUp} />

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        onClose={() => setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Follow Up"
        description="This follow up entry will be removed once you save the prescription. This can't be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
