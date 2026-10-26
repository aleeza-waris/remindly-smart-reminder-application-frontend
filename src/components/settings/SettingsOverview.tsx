
"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock3, Mail, Save, UserRound } from "lucide-react";
import { getDashboardUser } from "../../services/dashboardService";
import {
  updateUserSettings,
  type UpdateUserSettingsInput,
} from "../../services/settingsService";
import type { DashboardUser } from "../../types/dashboard";
import { isValidTimeZone } from "../../lib/timeZone";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import RemindlyLoading from "../common/RemindlyLoading";

const panelClass =
  "rounded-2xl border border-remindly-border bg-remindly-surface p-5 shadow-sm sm:p-6";

const inputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-remindly-border bg-remindly-surface px-3 py-2 text-sm text-remindly-text outline-none transition focus:border-remindly-focus focus:ring-2 focus:ring-remindly-focus/20";

const labelClass = "block text-sm font-medium text-remindly-text";

const advanceNoticeOptions = [
  { value: 0, label: "At the due time" },
  { value: 5, label: "5 minutes before" },
  { value: 10, label: "10 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 1440, label: "1 day before" },
];

const commonTimeZones = [
  "UTC",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Riyadh",
  "Asia/Dhaka",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
];

type SettingsForm = {
  name: string;
  timezone: string;
  defaultAdvanceNotice: number;
  emailAlertsEnabled: boolean;
};

const toSettingsForm = (user: DashboardUser): SettingsForm => ({
  name: user.name,
  timezone: isValidTimeZone(user.timezone) ? user.timezone : "UTC",
  defaultAdvanceNotice: advanceNoticeOptions.some(
    (option) => option.value === user.defaultAdvanceNotice,
  )
    ? user.defaultAdvanceNotice!
    : 15,
  emailAlertsEnabled: user.emailAlertsEnabled ?? true,
});

export default function SettingsOverview() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: getDashboardUser,
  });

  const [form, setForm] = useState<SettingsForm | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (userQuery.data) {
      setForm(toSettingsForm(userQuery.data));
    }
  }, [userQuery.data]);

  const updateMutation = useMutation({
    mutationFn: (input: UpdateUserSettingsInput) => updateUserSettings(input),
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(["dashboard", "user"], updatedUser);

      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "user"],
      });

      setForm(toSettingsForm(updatedUser));
      setSuccessMessage("Your settings have been saved.");
    },
    onError: () => {
      setSuccessMessage("");
    },
  });

  if (userQuery.isPending) {
    return <RemindlyLoading message="Loading your settings..." />;
  }

  const user = userQuery.data;

  const timeZoneOptions = [
    ...new Set([
      ...commonTimeZones,
      ...(form?.timezone ? [form.timezone] : []),
    ]),
  ].sort();

  const updateField = <K extends keyof SettingsForm>(
    key: K,
    value: SettingsForm[K],
  ) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setSuccessMessage("");
  };

  const handleSave = () => {
    if (!form || !user) return;

    const name = form.name.trim();

    if (!name) {
      setSuccessMessage("");
      return;
    }

    if (!isValidTimeZone(form.timezone)) {
      setSuccessMessage("");
      return;
    }

    const input: UpdateUserSettingsInput = {};

    if (name !== user.name) input.name = name;
    if (form.timezone !== user.timezone) input.timezone = form.timezone;

    if (form.defaultAdvanceNotice !== user.defaultAdvanceNotice) {
      input.defaultAdvanceNotice = form.defaultAdvanceNotice;
    }

    if (form.emailAlertsEnabled !== user.emailAlertsEnabled) {
      input.emailAlertsEnabled = form.emailAlertsEnabled;
    }

    if (Object.keys(input).length === 0) {
      setSuccessMessage("There are no changes to save.");
      return;
    }

    updateMutation.mutate(input);
  };

  const nameError = form && !form.name.trim() ? "Name is required." : "";
  const timeZoneError =
    form && !isValidTimeZone(form.timezone) ? "Choose a valid time zone." : "";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-remindly-text-accent-secondary">
          Your account
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-remindly-charcoal-brown sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-remindly-muted">
          Manage your profile and reminder preferences.
        </p>
      </header>

      {userQuery.isError ? (
        <section
          aria-labelledby="settings-error-heading"
          className={panelClass}
        >
          <h2
            className="text-lg font-semibold text-remindly-charcoal-brown"
            id="settings-error-heading"
          >
            Your settings could not be loaded
          </h2>
          <p className="mt-2 text-sm text-remindly-muted">
            {getApiErrorMessage(userQuery.error)}
          </p>
          <button
            className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-remindly-border px-4 font-semibold text-remindly-text transition-colors hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
            onClick={() => void userQuery.refetch()}
            type="button"
          >
            Try again
          </button>
        </section>
      ) : form && user ? (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
            <section aria-labelledby="profile-heading" className={panelClass}>
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-remindly-elevated-surface text-remindly-text-accent">
                  <UserRound aria-hidden="true" size={20} />
                </span>
                <h2
                  className="text-lg font-semibold text-remindly-charcoal-brown"
                  id="profile-heading"
                >
                  Profile
                </h2>
              </div>

              <div className="mt-5 grid gap-5">
                <div>
                  <label className={labelClass} htmlFor="settings-name">
                    Display name
                  </label>
                  <input
                    aria-describedby={nameError ? "settings-name-error" : "settings-name-limit"}
                    aria-invalid={Boolean(nameError)}
                    autoComplete="name"
                    className={inputClass}
                    id="settings-name"
                    maxLength={100}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    value={form.name}
                  />
                  {nameError && (
                    <p className="mt-1 text-sm text-remindly-danger" id="settings-name-error" role="alert">
                      {nameError}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-remindly-muted" id="settings-name-limit">
                    {form.name.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="settings-email">
                    Email address
                  </label>
                  <input
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                    id="settings-email"
                    readOnly
                    value={user.email}
                  />
                  <p className="mt-1 text-xs text-remindly-muted">
                    Your email address cannot be changed here.
                  </p>
                </div>
              </div>
            </section>

          <section
            aria-labelledby="preferences-heading"
            className={panelClass}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-remindly-elevated-surface text-remindly-text-accent">
                <Clock3 aria-hidden="true" size={20} />
              </span>
              <h2
                className="text-lg font-semibold text-remindly-charcoal-brown"
                id="preferences-heading"
              >
                Reminder preferences
              </h2>
            </div>

            <div className="mt-5 grid gap-5">
              <div>
                <label className={labelClass} htmlFor="settings-timezone">
                  Time zone
                </label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  id="settings-timezone"
                  onChange={(event) =>
                    updateField("timezone", event.target.value)
                  }
                  value={form.timezone}
                >
                  {timeZoneOptions.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
                {timeZoneError && (
                  <p className="mt-1 text-sm text-remindly-danger">
                    {timeZoneError}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={labelClass}
                  htmlFor="settings-advance-notice"
                >
                  Default advance notice
                </label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  id="settings-advance-notice"
                  onChange={(event) =>
                    updateField(
                      "defaultAdvanceNotice",
                      Number(event.target.value),
                    )
                  }
                  value={form.defaultAdvanceNotice}
                >
                  {advanceNoticeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs leading-relaxed text-remindly-muted">
                  Applies to new reminders when you do not choose a different
                  notice period.
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl bg-remindly-elevated-surface p-4">
                <div className="min-w-0">
                  <p className="font-medium text-remindly-text">
                    Email alerts
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-remindly-muted">
                    Receive reminder notifications by email.
                  </p>
                </div>
                <button
                  aria-checked={form.emailAlertsEnabled}
                  aria-label="Email alerts"
                 className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus focus-visible:ring-offset-2 ${
  form.emailAlertsEnabled
    ? "bg-[#702632]"
    : "bg-[#D1D5DB]"
}`}
                  onClick={() =>
                    updateField(
                      "emailAlertsEnabled",
                      !form.emailAlertsEnabled,
                    )
                  }
                  role="switch"
                  type="button"
                >
                  <span
                    className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                      form.emailAlertsEnabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-xl border border-remindly-border p-4">
                <div className="flex items-center gap-3">
                  <Mail
                    aria-hidden="true"
                    className="shrink-0 text-remindly-text-accent"
                    size={18}
                  />
                  <p className="text-sm leading-relaxed text-remindly-muted">
                    Reminder emails use the Remindly system sender. You do not
                    need to provide your own email credentials.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-start-1 lg:row-start-2">
            <button
              className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#702632] px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                updateMutation.isPending ||
                Boolean(nameError) ||
                Boolean(timeZoneError)
              }
              onClick={handleSave}
              type="button"
            >
              <Save aria-hidden="true" size={17} />
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </button>

            {successMessage && (
              <p aria-live="polite" className="text-sm text-remindly-text">
                {successMessage}
              </p>
            )}

            {updateMutation.isError && (
              <p aria-live="polite" className="text-sm text-remindly-danger">
                {getApiErrorMessage(updateMutation.error)}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
