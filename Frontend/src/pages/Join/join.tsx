import { useState, type FormEvent } from "react";
import PageHero from "../../components/Common/PageHero";
import { useSiteContent } from "../../context/ContentContext";

type JoinFormState = {
  name: string;
  department: string;
  email: string;
  semester: string;
  phone: string;
  skills: string;
};

export default function JoinPage() {
  const { content, addApplication } = useSiteContent();
  const [form, setForm] = useState<JoinFormState>({
    name: "",
    department: "",
    email: "",
    semester: "",
    phone: "",
    skills: "",
  });

  const handleChange = (field: keyof JoinFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addApplication(form);
    setForm({ name: "", department: "", email: "", semester: "", phone: "", skills: "" });
    alert("Application submitted successfully. It has been added to the admin dashboard.");
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow={content.joinPage.eyebrow}
        title={content.joinPage.title}
        description={content.joinPage.description}
      />

      <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Name</label>
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Department</label>
              <input
                value={form.department}
                onChange={(event) => handleChange("department", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400">Semester</label>
              <input
                value={form.semester}
                onChange={(event) => handleChange("semester", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Phone</label>
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400">Skills</label>
              <input
                value={form.skills}
                onChange={(event) => handleChange("skills", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full border border-[#00FF66]/40 bg-[#00FF66] px-6 py-3 text-sm font-semibold text-black">
              Submit Application
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
