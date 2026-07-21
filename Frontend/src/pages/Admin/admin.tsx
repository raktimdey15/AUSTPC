import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import { useSiteContent, type Applicant } from "../../context/ContentContext";
import type { CollaborationItem, EventItem, Member, NoticeItem, Semester, UpcomingEventItem } from "../../data/siteContent";

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors"
      />
    </label>
  );
}

// Phase 1 Image Field: Strictly URL/Path based to prevent LocalStorage crashing
function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      <span className="flex justify-between">
        {label}
        <span className="text-xs text-zinc-500">Paste URL or Local Path (e.g., /src/assets/image.jpg)</span>
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://... or /src/assets/..."
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors"
      />
    </label>
  );
}

function EventEditor({ event, onChange, onRemove }: { event: EventItem; onChange: (updated: EventItem) => void; onRemove: () => void }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{event.title || "New Event"}</h3>
        <button type="button" onClick={onRemove} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Title" value={event.title} onChange={(value) => onChange({ ...event, title: value })} />
        <Field label="Category" value={event.category} onChange={(value) => onChange({ ...event, category: value })} />
        <Field label="Date" value={event.date} onChange={(value) => onChange({ ...event, date: value })} />
        <Field label="Venue" value={event.venue} onChange={(value) => onChange({ ...event, venue: value })} />
        <Field label="Slug" value={event.slug} onChange={(value) => onChange({ ...event, slug: value })} />
        <label className="mt-8 flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" checked={Boolean(event.featured)} onChange={(item) => onChange({ ...event, featured: item.target.checked })} className="h-4 w-4 accent-[#00FF66]" />
          Featured on homepage
        </label>
        <TextAreaField label="Short Description" value={event.description} onChange={(value) => onChange({ ...event, description: value })} />
        <TextAreaField label="Long Description" value={event.longDescription} onChange={(value) => onChange({ ...event, longDescription: value })} />
        <div className="md:col-span-2">
          <ImageUploadField label="Event Image URL" value={event.image} onChange={(value) => onChange({ ...event, image: value })} />
        </div>
      </div>
    </div>
  );
}

function MemberEditor({ member, onChange, onRemove }: { member: Member; onChange: (updated: Member) => void; onRemove: () => void }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{member.name || "New Member"}</h3>
        <button type="button" onClick={onRemove} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Name" value={member.name} onChange={(value) => onChange({ ...member, name: value })} />
        <Field label="Position" value={member.position} onChange={(value) => onChange({ ...member, position: value })} />
        <Field label="Facebook URL" value={member.facebook || ""} onChange={(value) => onChange({ ...member, facebook: value })} />
        <Field label="LinkedIn URL" value={member.linkedin || ""} onChange={(value) => onChange({ ...member, linkedin: value })} />
        <div className="md:col-span-2">
          <ImageUploadField label="Photo URL" value={member.photo} onChange={(value) => onChange({ ...member, photo: value })} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { content, setContent, addApplication, saveChanges } = useSiteContent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "about" | "events" | "executive" | "subExecutive" | "hallOfFame" | "notices" | "applications">("home");

  const [applicationForm, setApplicationForm] = useState({
    name: "", department: "", email: "", semester: "", phone: "", skills: "",
  });

  const FinalizeUpdatesButton = () => (
    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
      <p className="text-xs text-zinc-500">Note: File uploads require Phase 2 Cloudinary integration. Use URLs for now.</p>
      <button
        type="button"
        onClick={saveChanges}
        className="rounded-full bg-[#00FF66] px-8 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(0,255,102,0.3)] transition hover:scale-105 hover:bg-white"
      >
        Finalize & Save Changes
      </button>
    </div>
  );

  const updateHeroField = (key: keyof typeof content.hero, value: string) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  const updateHomeField = (key: keyof typeof content.home, value: string) => setContent((prev) => ({ ...prev, home: { ...prev.home, [key]: value } }));
  const updatePageField = (pageKey: "about" | "eventsPage" | "executivePage" | "subExecutivePage" | "hallOfFamePage" | "upcomingEventsPage" | "noticePage" | "joinPage", key: "eyebrow" | "title" | "description", value: string) => setContent((prev) => ({ ...prev, [pageKey]: { ...prev[pageKey], [key]: value } }));

  const updateStats = (index: number, field: "value" | "label", value: string) => {
    const next = [...content.stats];
    next[index] = { ...next[index], [field]: value };
    setContent((prev) => ({ ...prev, stats: next }));
  };
  const addStats = () => setContent((prev) => ({ ...prev, stats: [...prev.stats, { value: "0", label: "New Stat" }] }));
  const removeStats = (index: number) => setContent((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));

  const updateTestimonials = (index: number, field: "quote" | "name" | "role", value: string) => {
    const next = [...content.testimonials];
    next[index] = { ...next[index], [field]: value };
    setContent((prev) => ({ ...prev, testimonials: next }));
  };
  const addTestimonial = () => setContent((prev) => ({ ...prev, testimonials: [...prev.testimonials, { quote: "New testimonial", name: "New Name", role: "Member" }] }));
  const removeTestimonial = (index: number) => setContent((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));

  const updateGallery = (index: number, value: string) => {
    const next = [...content.galleryHighlights];
    next[index] = value;
    setContent((prev) => ({ ...prev, galleryHighlights: next }));
  };
  const addGalleryImage = () => setContent((prev) => ({ ...prev, galleryHighlights: [...prev.galleryHighlights, ""] }));
  const removeGalleryImage = (index: number) => setContent((prev) => ({ ...prev, galleryHighlights: prev.galleryHighlights.filter((_, i) => i !== index) }));

  const updateEventList = (listKey: "featuredEvents" | "allEvents", index: number, updated: EventItem) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].map((item, i) => (i === index ? updated : item)) }));
  const addEvent = (listKey: "featuredEvents" | "allEvents") => {
    const newEvent: EventItem = { slug: `new-event-${Date.now()}`, title: "New Event", category: "Event", description: "Short description.", longDescription: "Long detail.", date: "TBD", venue: "TBD", image: "", featured: false };
    setContent((prev) => ({ ...prev, [listKey]: [...prev[listKey], newEvent] }));
  };
  const removeEvent = (listKey: "featuredEvents" | "allEvents", index: number) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));

  const updateMemberList = (listKey: "executiveMembers" | "subExecutiveMembers", index: number, updated: Member) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].map((item, i) => (i === index ? updated : item)) }));
  const addMember = (listKey: "executiveMembers" | "subExecutiveMembers") => setContent((prev) => ({ ...prev, [listKey]: [...prev[listKey], { name: "New Member", position: "Position", photo: "", facebook: "", linkedin: "" }] }));
  const removeMember = (listKey: "executiveMembers" | "subExecutiveMembers", index: number) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));

  const updateSemester = (index: number, field: "slug" | "title" | "year" | "description", value: string) => {
    const next = [...content.hallOfFameSemesters];
    next[index] = { ...next[index], [field]: value } as Semester;
    setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
  };
  const addSemester = () => setContent((prev) => ({ ...prev, hallOfFameSemesters: [...prev.hallOfFameSemesters, { slug: `semester-${Date.now()}`, title: "New Semester", year: "2026", description: "Details...", members: [], panelists: [] }] }));
  const removeSemester = (index: number) => setContent((prev) => ({ ...prev, hallOfFameSemesters: prev.hallOfFameSemesters.filter((_, i) => i !== index) }));

  const updateNotice = (index: number, field: keyof NoticeItem, value: string) => {
    const next = [...content.notices];
    next[index] = { ...next[index], [field]: value } as NoticeItem;
    setContent((prev) => ({ ...prev, notices: next }));
  };
  const addNotice = () => setContent((prev) => ({ ...prev, notices: [...prev.notices, { title: "New Notice", date: "TBD", attachment: "", excerpt: "Details." }] }));
  const removeNotice = (index: number) => setContent((prev) => ({ ...prev, notices: prev.notices.filter((_, i) => i !== index) }));

  const updateUpcoming = (index: number, field: keyof UpcomingEventItem, value: string) => {
    const next = [...content.upcomingEventsList];
    next[index] = { ...next[index], [field]: value } as UpcomingEventItem;
    setContent((prev) => ({ ...prev, upcomingEventsList: next }));
  };
  const addUpcoming = () => setContent((prev) => ({ ...prev, upcomingEventsList: [...prev.upcomingEventsList, { title: "New Event", description: "Details.", date: "TBD", venue: "TBD", poster: "" }] }));
  const removeUpcoming = (index: number) => setContent((prev) => ({ ...prev, upcomingEventsList: prev.upcomingEventsList.filter((_, i) => i !== index) }));

  const updateCollaboration = (index: number, field: keyof CollaborationItem, value: string) => {
    const next = [...content.collaborations];
    next[index] = { ...next[index], [field]: value } as CollaborationItem;
    setContent((prev) => ({ ...prev, collaborations: next }));
  };
  const addCollaboration = () => setContent((prev) => ({ ...prev, collaborations: [...prev.collaborations, { name: "New Partner", eventName: "New Event", type: "Collaboration", logo: "" }] }));
  const removeCollaboration = (index: number) => setContent((prev) => ({ ...prev, collaborations: prev.collaborations.filter((_, i) => i !== index) }));

  const handleApplicationChange = (field: keyof typeof applicationForm, value: string) => setApplicationForm((prev) => ({ ...prev, [field]: value }));
  const handleApplicationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addApplication(applicationForm);
    setApplicationForm({ name: "", department: "", email: "", semester: "", phone: "", skills: "" });
  };

  useEffect(() => {
    if (sessionStorage.getItem("austpc_auth_token") !== "active") {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl w-full flex justify-between items-center">
        <PageHero
          eyebrow="Admin Dashboard"
          title="Content Management System"
          description="Update your website data here. Ensure you click 'Finalize & Save' to persist changes."
        />
        <button 
          onClick={() => {
            if(confirm("Are you sure you want to reset all data to default? This will wipe your local saves.")) {
              window.localStorage.removeItem("austpc-content-v1");
              window.location.reload();
            }
          }}
          className="ml-4 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
        >
          Reset Storage
        </button>
      </div>

      <div className="mx-auto max-w-7xl w-full flex flex-wrap gap-3">
        <button type="button" onClick={() => setActiveTab("home")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "home" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Home</button>
        <button type="button" onClick={() => setActiveTab("about")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "about" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>About</button>
        <button type="button" onClick={() => setActiveTab("events")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "events" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Events</button>
        <button type="button" onClick={() => setActiveTab("executive")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "executive" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Executive</button>
        <button type="button" onClick={() => setActiveTab("subExecutive")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "subExecutive" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Sub Exec</button>
        <button type="button" onClick={() => setActiveTab("hallOfFame")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "hallOfFame" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Hall of Fame</button>
        <button type="button" onClick={() => setActiveTab("notices")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "notices" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Notices</button>
        <button type="button" onClick={() => setActiveTab("applications")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "applications" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Applications ({content.applications.length})</button>
      </div>

      <div className="mx-auto max-w-7xl w-full">
        {activeTab === "home" && (
          <div className="flex flex-col gap-8">
            <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white">Hero Segment</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => updateHeroField("eyebrow", value)} />
                <Field label="Title" value={content.hero.title} onChange={(value) => updateHeroField("title", value)} />
                <Field label="Subtitle" value={content.hero.subtitle} onChange={(value) => updateHeroField("subtitle", value)} />
                <Field label="Primary Button" value={content.hero.primaryButtonLabel} onChange={(value) => updateHeroField("primaryButtonLabel", value)} />
                <Field label="Secondary Button" value={content.hero.secondaryButtonLabel} onChange={(value) => updateHeroField("secondaryButtonLabel", value)} />
              </div>
              <div className="mt-6 space-y-4">
                {content.hero.slides.map((slide, index) => (
                  <div key={`slide-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Slide {index + 1}</h3>
                      <button type="button" onClick={() => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: prev.hero.slides.filter((_, i) => i !== index) } }))} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
                    </div>
                    <div className="mt-4">
                      <ImageUploadField label="Hero Image URL" value={slide} onChange={(value) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: prev.hero.slides.map((item, i) => (i === index ? value : item)) } }))} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: [...prev.hero.slides, ""] } }))} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Hero Slide</button>
              </div>
              <FinalizeUpdatesButton />
            </section>

            <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white">Homepage Content Text</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field label="About Title" value={content.home.aboutTitle} onChange={(value) => updateHomeField("aboutTitle", value)} />
                <Field label="Featured Title" value={content.home.featuredTitle} onChange={(value) => updateHomeField("featuredTitle", value)} />
                <Field label="Gallery Title" value={content.home.galleryTitle} onChange={(value) => updateHomeField("galleryTitle", value)} />
                <Field label="Upcoming Title" value={content.home.upcomingTitle} onChange={(value) => updateHomeField("upcomingTitle", value)} />
                <div className="md:col-span-2"><TextAreaField label="About Description" value={content.home.aboutDescription} onChange={(value) => updateHomeField("aboutDescription", value)} /></div>
                <div className="md:col-span-2"><TextAreaField label="Featured Description" value={content.home.featuredDescription} onChange={(value) => updateHomeField("featuredDescription", value)} /></div>
              </div>
              <FinalizeUpdatesButton />
            </section>

            <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white">Homepage Stats</h2>
              <div className="mt-6 space-y-4">
                {content.stats.map((stat, index) => (
                  <div key={`stat-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Value" value={stat.value} onChange={(value) => updateStats(index, "value", value)} />
                      <Field label="Label" value={stat.label} onChange={(value) => updateStats(index, "label", value)} />
                    </div>
                    <button type="button" onClick={() => removeStats(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove Stat</button>
                  </div>
                ))}
                <button type="button" onClick={addStats} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Stat</button>
              </div>
              <FinalizeUpdatesButton />
            </section>

            <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
              <h2 className="text-2xl font-semibold text-white">Testimonials & Gallery</h2>
              <div className="mt-8 space-y-4">
                {content.testimonials.map((testimonial, index) => (
                  <div key={`test-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Name" value={testimonial.name} onChange={(value) => updateTestimonials(index, "name", value)} />
                      <Field label="Role" value={testimonial.role} onChange={(value) => updateTestimonials(index, "role", value)} />
                      <div className="md:col-span-2">
                        <TextAreaField label="Quote" value={testimonial.quote} onChange={(value) => updateTestimonials(index, "quote", value)} />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeTestimonial(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addTestimonial} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Testimonial</button>
              </div>
              
              <div className="mt-12 space-y-4">
                <h3 className="text-lg font-semibold text-white">Gallery Highlights</h3>
                {content.galleryHighlights.map((image, index) => (
                  <div key={`gal-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                    <ImageUploadField label={`Gallery Image ${index + 1}`} value={image} onChange={(value) => updateGallery(index, value)} />
                    <button type="button" onClick={() => removeGalleryImage(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addGalleryImage} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Gallery Image</button>
              </div>
              <FinalizeUpdatesButton />
            </section>
          </div>
        )}

        {activeTab === "about" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">About Page Setup</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Eyebrow" value={content.about.eyebrow} onChange={(value) => updatePageField("about", "eyebrow", value)} />
              <Field label="Title" value={content.about.title} onChange={(value) => updatePageField("about", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Description" value={content.about.description} onChange={(value) => updatePageField("about", "description", value)} />
              </div>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "events" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Events Database</h2>
            <div className="mt-6 space-y-4">
              <h3 className="text-lg text-white">Featured Events</h3>
              {content.featuredEvents.map((event, index) => (
                <EventEditor key={`feat-${index}`} event={event} onChange={(updated) => updateEventList("featuredEvents", index, updated)} onRemove={() => removeEvent("featuredEvents", index)} />
              ))}
              <button type="button" onClick={() => addEvent("featuredEvents")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Featured Event</button>
            </div>
            <div className="mt-12 space-y-4">
              <h3 className="text-lg text-white">All Events</h3>
              {content.allEvents.map((event, index) => (
                <EventEditor key={`all-${index}`} event={event} onChange={(updated) => updateEventList("allEvents", index, updated)} onRemove={() => removeEvent("allEvents", index)} />
              ))}
              <button type="button" onClick={() => addEvent("allEvents")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Event</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "executive" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Executive Team</h2>
            <div className="mt-6 space-y-4">
              {content.executiveMembers.map((member, index) => (
                <MemberEditor key={`exec-${index}`} member={member} onChange={(updated) => updateMemberList("executiveMembers", index, updated)} onRemove={() => removeMember("executiveMembers", index)} />
              ))}
              <button type="button" onClick={() => addMember("executiveMembers")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Member</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "subExecutive" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Sub Executive Team</h2>
            <div className="mt-6 space-y-4">
              {content.subExecutiveMembers.map((member, index) => (
                <MemberEditor key={`sub-${index}`} member={member} onChange={(updated) => updateMemberList("subExecutiveMembers", index, updated)} onRemove={() => removeMember("subExecutiveMembers", index)} />
              ))}
              <button type="button" onClick={() => addMember("subExecutiveMembers")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Sub Exec</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "hallOfFame" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Hall of Fame</h2>
            <div className="mt-6 space-y-4">
              {content.hallOfFameSemesters.map((semester, index) => (
                <div key={`hof-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Slug" value={semester.slug} onChange={(value) => updateSemester(index, "slug", value)} />
                    <Field label="Title" value={semester.title} onChange={(value) => updateSemester(index, "title", value)} />
                    <Field label="Year" value={semester.year} onChange={(value) => updateSemester(index, "year", value)} />
                    <div className="md:col-span-2">
                      <TextAreaField label="Description" value={semester.description} onChange={(value) => updateSemester(index, "description", value)} />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-semibold text-[#00FF66]">Panelists</h4>
                    {semester.panelists.map((panelist, panelIndex) => (
                      <div key={`pan-${panelIndex}`} className="rounded-[20px] border border-white/10 bg-zinc-950/60 p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Field label="Name" value={panelist.name} onChange={(value) => {
                            const next = [...content.hallOfFameSemesters];
                            next[index] = { ...next[index], panelists: next[index].panelists.map((item, i) => i === panelIndex ? { ...item, name: value } : item) };
                            setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
                          }} />
                          <Field label="Role" value={panelist.role} onChange={(value) => {
                            const next = [...content.hallOfFameSemesters];
                            next[index] = { ...next[index], panelists: next[index].panelists.map((item, i) => i === panelIndex ? { ...item, role: value } : item) };
                            setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
                          }} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      const next = [...content.hallOfFameSemesters];
                      next[index] = { ...next[index], panelists: [...next[index].panelists, { name: "New Panelist", role: "Role", email: "", bio: "" }] };
                      setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
                    }} className="mt-2 rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Panelist</button>
                  </div>
                  <button type="button" onClick={() => removeSemester(index)} className="mt-8 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove Semester</button>
                </div>
              ))}
              <button type="button" onClick={addSemester} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Semester</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "notices" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Notices & Upcoming</h2>
            <div className="mt-6 space-y-4">
              {content.notices.map((notice, index) => (
                <div key={`notice-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={notice.title} onChange={(value) => updateNotice(index, "title", value)} />
                    <Field label="Date" value={notice.date} onChange={(value) => updateNotice(index, "date", value)} />
                    <div className="md:col-span-2"><TextAreaField label="Excerpt" value={notice.excerpt} onChange={(value) => updateNotice(index, "excerpt", value)} /></div>
                  </div>
                  <button type="button" onClick={() => removeNotice(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove Notice</button>
                </div>
              ))}
              <button type="button" onClick={addNotice} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Notice</button>
            </div>
            <div className="mt-12 space-y-4">
              <h3 className="text-lg text-white">Upcoming Events</h3>
              {content.upcomingEventsList.map((event, index) => (
                <div key={`upcoming-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={event.title} onChange={(value) => updateUpcoming(index, "title", value)} />
                    <Field label="Date" value={event.date} onChange={(value) => updateUpcoming(index, "date", value)} />
                    <div className="md:col-span-2"><TextAreaField label="Description" value={event.description} onChange={(value) => updateUpcoming(index, "description", value)} /></div>
                    <div className="md:col-span-2"><ImageUploadField label="Poster URL" value={event.poster} onChange={(value) => updateUpcoming(index, "poster", value)} /></div>
                  </div>
                  <button type="button" onClick={() => removeUpcoming(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addUpcoming} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Upcoming Event</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "applications" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Incoming Applications</h2>
            <form onSubmit={handleApplicationSubmit} className="mt-6 grid gap-4 rounded-[24px] border border-white/10 bg-black/30 p-5 md:grid-cols-2">
              <Field label="Name" value={applicationForm.name} onChange={(value) => handleApplicationChange("name", value)} />
              <Field label="Department" value={applicationForm.department} onChange={(value) => handleApplicationChange("department", value)} />
              <Field label="Email" type="email" value={applicationForm.email} onChange={(value) => handleApplicationChange("email", value)} />
              <div className="md:col-span-2">
                <button type="submit" className="rounded-full bg-[#00FF66] px-4 py-2 text-sm font-semibold text-black hover:bg-white transition">Submit Demo Application</button>
              </div>
            </form>
            <div className="mt-8 space-y-4">
              {content.applications.length === 0 ? (
                <p className="text-zinc-400">No applications have been submitted yet.</p>
              ) : (
                content.applications.map((application: Applicant) => (
                  <div key={application.id} className="rounded-[24px] border border-[#00FF66]/20 bg-black/50 p-6 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <h3 className="text-xl font-bold text-white">{application.name}</h3>
                      <span className="text-sm font-medium text-[#00FF66]">{new Date(application.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                      <p><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">Dept</span> {application.department}</p>
                      <p><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-1">Email</span> {application.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}