"use client";
/**
 * Visual contact form (static site — no backend). On submit it opens the
 * visitor's email app via mailto once the agency email is configured;
 * until then it points people to the quote link and phone.
 */
import { useState, type FormEvent } from "react";
import { agency, contactPage, hasEmail } from "@/data/content";

type Field = { name: string; label: string; type?: string; autoComplete?: string; required?: boolean };

const FIELDS: Field[] = [
  { name: "firstName", label: "First name", autoComplete: "given-name", required: true },
  { name: "lastName", label: "Last name", autoComplete: "family-name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: true },
];

export function ContactForm({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  const [status, setStatus] = useState<"idle" | "sent" | "noemail">("idle");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!hasEmail) return setStatus("noemail");
    const body = [
      `Name: ${data.get("firstName")} ${data.get("lastName")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Inquiry: ${data.get("inquiry")}`,
      "",
      String(data.get("comments") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${agency.email}?subject=${encodeURIComponent(`Website inquiry: ${data.get("inquiry")}`)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  const soft = tone === "ink" ? "text-paper-soft" : "text-ink-soft";
  return (
    <form onSubmit={submit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2" noValidate={false}>
      {FIELDS.map((f) => (
        <label key={f.name} className="block">
          <span className={`label ${soft}`}>
            {f.label}
            {f.required && <span aria-hidden>*</span>}
          </span>
          <input name={f.name} type={f.type ?? "text"} autoComplete={f.autoComplete} required={f.required} className="field" />
        </label>
      ))}
      <label className="block sm:col-span-2">
        <span className={`label ${soft}`}>Inquiry type</span>
        <select name="inquiry" className="field" defaultValue={contactPage.inquiryTypes[0]}>
          {contactPage.inquiryTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className={`label ${soft}`}>Comments</span>
        <textarea name="comments" rows={3} className="field resize-y" />
      </label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className={`btn ${tone === "ink" ? "btn-aqua" : "btn-ink"}`}>
          Send request
        </button>
        <p className={`text-sm ${soft}`} aria-live="polite">
          {status === "sent" && "Your email app should open with your message ready to send."}
          {status === "noemail" && (
            <>
              Online messages aren’t connected yet [EMAIL]. Please{" "}
              <a className="pen-link pen-link-static" href={agency.quoteUrl} target="_blank" rel="noopener">request a quote online</a> or call{" "}
              <a className="pen-link pen-link-static" href={agency.phone.href}>{agency.phone.display}</a>.
            </>
          )}
          {status === "idle" && "* Required"}
        </p>
      </div>
    </form>
  );
}
