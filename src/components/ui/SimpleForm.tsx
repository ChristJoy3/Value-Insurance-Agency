"use client";
/**
 * Visual-only form for Refer a Friend / Newsletter (static site, no backend).
 * Opens a pre-filled email once [EMAIL] is configured; otherwise explains
 * how to reach the agency instead.
 */
import { useState, type FormEvent } from "react";
import { agency, hasEmail } from "@/data/content";

export type FormGroup = { legend?: string; fields: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string; full?: boolean; multiline?: boolean }[] };

export function SimpleForm({ groups, subject, submitLabel }: { groups: FormGroup[]; subject: string; submitLabel: string }) {
  const [status, setStatus] = useState<"idle" | "sent" | "noemail">("idle");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasEmail) return setStatus("noemail");
    const data = new FormData(e.currentTarget);
    const body = groups
      .flatMap((g) => g.fields.map((f) => `${f.label}: ${data.get(f.name) ?? ""}`))
      .join("\n");
    window.location.href = `mailto:${agency.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <form onSubmit={submit} className="space-y-12">
      {groups.map((g, gi) => (
        <fieldset key={gi} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {g.legend && <legend className="label mb-6 text-ink-faint">{g.legend}</legend>}
          {g.fields.map((f) => (
            <label key={f.name} className={`block ${f.full ? "sm:col-span-2" : ""}`}>
              <span className="label text-ink-soft">
                {f.label}
                {f.required && <span aria-hidden>*</span>}
              </span>
              {f.multiline ? (
                <textarea name={f.name} required={f.required} rows={3} className="field resize-y" />
              ) : (
                <input name={f.name} type={f.type ?? "text"} required={f.required} autoComplete={f.autoComplete} className="field" />
              )}
            </label>
          ))}
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-ink">{submitLabel}</button>
        <p className="text-sm text-ink-soft" aria-live="polite">
          {status === "sent" && "Your email app should open with the details filled in."}
          {status === "noemail" && (
            <>
              Online submissions aren’t connected yet [EMAIL]. Please call{" "}
              <a href={agency.phone.href} className="pen-link pen-link-static text-ink">{agency.phone.display}</a>.
            </>
          )}
          {status === "idle" && "* Required"}
        </p>
      </div>
    </form>
  );
}
