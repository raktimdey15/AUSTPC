import { useState, type FormEvent } from "react";
import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

export default function JoinPage() {
  const { content } = useSiteContent();
  const drive = content.membershipDrive;

  const [form, setForm] = useState<Record<string, any>>({});
  
  const isRequired = (id: string) => {
    const field = drive.formSchema?.find((f) => f.id === id);
    return field ? field.required : false;
  };
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { submitApplication, uploadPassportPhoto } = await import("../../services/applicationService");

      let photoUrl = "";
      if (photoFile) {
        photoUrl = await uploadPassportPhoto(photoFile);
      }

      const applicationPayload = {
        name: form.name || "",
        department: form.department || "",
        email: form.email || "",
        semester: form.semester || "",
        phone: form.phone || "",
        skills: JSON.stringify({
          personalEmail: form.personalEmail || "",
          studentId: form.studentId || "",
          organizingSkill: form.organizingSkill || "",
          graphicsSkill: form.graphicsSkill ? "Yes" : "No",
          payment: form.payment || "",
          trxid: form.trxid || "",
          reference: form.reference || "",
          photoUrl,
        }),
      };

      await submitApplication(applicationPayload);
      alert("Application submitted successfully! Welcome to AUSTPC 🎉");
      setForm({});
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit application. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow={content.joinPage.eyebrow}
        title={drive.status === "OPEN" ? `${drive.semesterName} Membership Drive` : content.joinPage.title}
        description={content.joinPage.description}
      />

      {drive.status === "CLOSED" ? (
        <section className="flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-zinc-900/80 p-12 sm:p-16 text-center shadow-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="mt-8 text-2xl sm:text-3xl font-semibold text-white">Membership is currently closed</h2>
          <p className="mt-4 max-w-lg text-zinc-400">
            Thank you for your interest in AUSTPC! We are not accepting new applications at this time.
            Keep an eye on our social media for announcements regarding the next recruitment drive.
          </p>
        </section>
      ) : (
        <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Name {isRequired("name") && <span className="text-red-500">*</span>}</span>
              <input type="text" required={isRequired("name")} value={form.name || ""} onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
            </label>

            {/* Phone + Student ID */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-400">Phone Number {isRequired("phone") && <span className="text-red-500">*</span>}</span>
                <input type="tel" required={isRequired("phone")} value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-400">Student ID {isRequired("studentId") && <span className="text-red-500">*</span>}</span>
                <input type="text" required={isRequired("studentId")} value={form.studentId || ""} onChange={(e) => handleChange("studentId", e.target.value)}
                  placeholder="e.g. 22.02.04.XXX"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
              </label>
            </div>

            {/* Department + Year/Semester */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-400">Your Department {isRequired("department") && <span className="text-red-500">*</span>}</span>
                <input type="text" required={isRequired("department")} value={form.department || ""} onChange={(e) => handleChange("department", e.target.value)}
                  placeholder="e.g. CSE, EEE, ME"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-400">Year & Semester {isRequired("semester") && <span className="text-red-500">*</span>}</span>
                <input type="text" required={isRequired("semester")} value={form.semester || ""} onChange={(e) => handleChange("semester", e.target.value)}
                  placeholder="e.g. 2nd Year, 1st Semester"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
              </label>
            </div>

            {/* Emails */}
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-400">AUST Student Mail {isRequired("email") && <span className="text-red-500">*</span>}</span>
                <input type="email" required={isRequired("email")} value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="yourname@aust.edu"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm text-zinc-400">Personal Email {isRequired("personalEmail") && <span className="text-red-500">*</span>}</span>
                <input type="email" required={isRequired("personalEmail")} value={form.personalEmail || ""} onChange={(e) => handleChange("personalEmail", e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
              </label>
            </div>

            {/* Organizing Skill */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Any Previous Organizing Skill? {isRequired("organizingSkill") && <span className="text-red-500">*</span>}</span>
              <span className="text-xs text-zinc-500">Write something about your experience</span>
              <textarea required={isRequired("organizingSkill")} value={form.organizingSkill || ""} onChange={(e) => handleChange("organizingSkill", e.target.value)}
                rows={3} placeholder="Share your experience..."
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
            </label>

            {/* Graphics Design Skill — Checkbox */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Any Graphics Design Skill? {isRequired("graphicsSkill") && <span className="text-red-500">*</span>}</span>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="graphicsSkill" checked={form.graphicsSkill === true}
                    onChange={() => handleChange("graphicsSkill", true)}
                    className="h-4 w-4 accent-[#00FF66]" />
                  <span className="text-sm text-zinc-300">Yes</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="graphicsSkill" checked={form.graphicsSkill === false}
                    onChange={() => handleChange("graphicsSkill", false)}
                    className="h-4 w-4 accent-[#00FF66]" />
                  <span className="text-sm text-zinc-300">No</span>
                </label>
              </div>
            </div>

            {/* Passport Photo Upload — Google Drive style */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Proper Passport Size Photo for ID Card {isRequired("photo") && <span className="text-red-500">*</span>}</span>
              <div
                onClick={() => document.getElementById("passport-upload")?.click()}
                className="relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/15 bg-black/20 p-6 transition hover:border-[#00FF66]/40 hover:bg-[#00FF66]/5"
              >
                {photoPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={photoPreview} alt="Preview" className="h-24 w-24 rounded-xl object-cover border border-white/10" />
                    <p className="text-xs text-[#00FF66]">{photoFile?.name}</p>
                    <p className="text-xs text-zinc-500">Click to change</p>
                  </div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00FF66]/10">
                      <span className="text-2xl">📁</span>
                    </div>
                    <p className="text-sm text-zinc-300">Click to upload your photo</p>
                    <span className="text-xs text-zinc-500">Auto-compressed to ≤500 KB WebP</span>
                  </>
                )}
                <input id="passport-upload" type="file" accept="image/*" required={isRequired("photo") && !photoFile}
                  onChange={handlePhotoChange} className="hidden" />
              </div>
            </div>

            {/* Payment Option — Radio buttons */}
            <div className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Payment Option {isRequired("payment") && <span className="text-red-500">*</span>}</span>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="payment" required checked={form.payment === "Cash"}
                    onChange={() => handleChange("payment", "Cash")}
                    className="h-4 w-4 accent-[#00FF66]" />
                  <span className="text-sm text-zinc-300">Cash</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="payment" checked={form.payment === "bKash"}
                    onChange={() => handleChange("payment", "bKash")}
                    className="h-4 w-4 accent-[#00FF66]" />
                  <span className="text-sm text-zinc-300">bKash</span>
                </label>
              </div>
            </div>

            {/* Transaction ID */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Transaction ID {isRequired("trxid") && <span className="text-red-500">*</span>}</span>
              <span className="text-xs text-zinc-500">If cash payment, then write N/A</span>
              <input type="text" required={isRequired("trxid")} value={form.trxid || ""} onChange={(e) => handleChange("trxid", e.target.value)}
                placeholder="e.g. TXN123456 or N/A"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
            </label>

            {/* Reference */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-400">Reference {isRequired("reference") && <span className="text-red-500">*</span>}</span>
              <span className="text-xs text-zinc-500">Which BA or Sub Executive informed you about the club?</span>
              <input type="text" required={isRequired("reference")} value={form.reference || ""} onChange={(e) => handleChange("reference", e.target.value)}
                placeholder="Name of the person"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors" />
            </label>

            {/* Submit */}
            <div className="pt-4 border-t border-white/10 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-full border border-[#00FF66]/40 bg-[#00FF66] px-8 py-4 text-sm font-bold text-black transition hover:scale-105 hover:bg-white disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
