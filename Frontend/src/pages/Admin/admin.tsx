import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import { useSiteContent, type Applicant } from "../../context/ContentContext";
import type { EventItem, Member, NoticeItem, Semester, UpcomingEventItem, CollaborationItem } from "../../data/siteContent";
import { useAuth } from "../../context/AuthContext";
import { deleteApplication, fetchApplications } from "../../services/applicationService";

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

function ImageUploadField({ label, category = "general", value, onChange }: { label: string; category?: string; value: string; onChange: (value: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { uploadSiteImage } = await import("../../services/storageService");
      const publicUrl = await uploadSiteImage(file, category);
      onChange(publicUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      <span className="flex justify-between">
        {label}
        <span className="text-xs text-zinc-500">Auto-compressed to ≤500 KB WebP</span>
      </span>
      <div className="flex items-center gap-4">
        {value && (
          <img src={value} alt="Preview" className="h-12 w-12 rounded object-cover border border-white/10" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-2 text-white outline-none focus:border-[#00FF66] transition-colors file:mr-4 file:rounded-full file:border-0 file:bg-[#00FF66] file:px-4 file:py-2 file:text-sm file:font-bold file:text-black hover:file:bg-white disabled:opacity-50"
        />
      </div>
      {isUploading && <span className="text-xs text-[#00FF66]">Compressing & Uploading...</span>}
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
        <Field label="Facebook Event URL" value={event.facebookUrl || ""} onChange={(value) => onChange({ ...event, facebookUrl: value })} />
        <label className="mt-8 flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" checked={Boolean(event.featured)} onChange={(item) => onChange({ ...event, featured: item.target.checked })} className="h-4 w-4 accent-[#00FF66]" />
          Featured on homepage
        </label>
        <TextAreaField label="Short Description" value={event.description} onChange={(value) => onChange({ ...event, description: value })} />
        <TextAreaField label="Long Description" value={event.longDescription} onChange={(value) => onChange({ ...event, longDescription: value })} />
        <div className="md:col-span-2">
          <ImageUploadField label="Event Image" category="event" value={event.image} onChange={(value) => onChange({ ...event, image: value })} />
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
        <div className="md:col-span-2">
          <Field label="Department (Optional)" value={member.department || ""} onChange={(value) => onChange({ ...member, department: value })} />
        </div>
        <Field label="Facebook URL" value={member.facebook || ""} onChange={(value) => onChange({ ...member, facebook: value })} />
        <Field label="LinkedIn URL" value={member.linkedin || ""} onChange={(value) => onChange({ ...member, linkedin: value })} />
        <div className="md:col-span-2">
          <Field label="Instagram URL" value={member.instagram || ""} onChange={(value) => onChange({ ...member, instagram: value })} />
        </div>
        <div className="md:col-span-2">
          <ImageUploadField label="Photo" category="member" value={member.photo} onChange={(value) => onChange({ ...member, photo: value })} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { content, setContent, saveChanges } = useSiteContent();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "about" | "events" | "executive" | "subExecutive" | "hallOfFame" | "notices" | "collaborations" | "applications">("home");


  const [isSaving, setIsSaving] = useState(false);

  const handleArchivePanel = () => {
    const title = prompt("Enter the Semester Title for this panel (e.g., 'Fall 2026'):");
    if (!title) return;
    const yearMatch = title.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const tenure = prompt("Enter Tenure/Year (e.g., '2022 - 2023'):", year);
    if (!tenure) return;

    setContent((prev) => {
      const newSemester: Semester = {
        slug,
        title,
        year: tenure,
        description: `Executive panel for ${title}.`,
        members: prev.executiveMembers.map(member => ({ ...member })), // Deep copy to preserve all fields
      };

      return {
        ...prev,
        executiveMembers: [], // Clear current executive members
        hallOfFameSemesters: [newSemester, ...prev.hallOfFameSemesters],
      };
    });
    alert(`Archived current executive panel to Hall of Fame under "${title}". You can now edit them in the Hall of Fame tab!`);
  };

  const FinalizeUpdatesButton = () => (
    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
      <p className="text-xs text-zinc-500">Note: All images are auto-compressed to ≤500 KB WebP and uploaded to Supabase Storage.</p>
      <button
        type="button"
        disabled={isSaving}
        onClick={async () => {
          setIsSaving(true);
          try {
            await saveChanges();
          } finally {
            setIsSaving(false);
          }
        }}
        className="flex items-center gap-2 rounded-full bg-[#00FF66] px-8 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(0,255,102,0.3)] transition hover:scale-105 hover:bg-white disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSaving ? "Saving..." : "Finalize & Save Changes"}
      </button>
    </div>
  );

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

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

  const updateTestimonials = (index: number, field: "quote" | "name" | "role" | "category", value: string) => {
    const next = [...content.testimonials];
    next[index] = { ...next[index], [field]: value } as any; // Cast as any because SiteContentState doesn't have category yet
    setContent((prev) => ({ ...prev, testimonials: next }));
  };
  const addTestimonial = () => setContent((prev) => ({ ...prev, testimonials: [...prev.testimonials, { quote: "New testimonial", name: "New Name", role: "Member", category: "Alumni" } as any] }));
  const removeTestimonial = (index: number) => setContent((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));

  const updateGallery = (index: number, value: string) => {
    const next = [...content.galleryHighlights];
    next[index] = value;
    setContent((prev) => ({ ...prev, galleryHighlights: next }));
  };
  const addGalleryImage = () => setContent((prev) => ({ ...prev, galleryHighlights: [...prev.galleryHighlights, ""] }));
  const removeGalleryImage = (index: number) => setContent((prev) => ({ ...prev, galleryHighlights: prev.galleryHighlights.filter((_, i) => i !== index) }));

  const updateEventList = (listKey: "featuredEvents" | "allEvents", index: number, updated: EventItem) => {
    setContent((prev) => {
      if (updated.featured) {
        const currentlyFeatured = prev.allEvents.filter((e, i) => e.featured && i !== index);
        if (currentlyFeatured.length >= 2) {
          alert("Maximum 2 events can be featured at the same time.");
          updated.featured = false;
        }
      }
      return { ...prev, [listKey]: prev[listKey].map((item, i) => (i === index ? updated : item)) };
    });
  };
  const addEvent = (listKey: "featuredEvents" | "allEvents") => {
    const newEvent: EventItem = { slug: `new-event-${Date.now()}`, title: "New Event", category: "Event", description: "Short description.", longDescription: "Long detail.", date: "TBD", venue: "TBD", image: "", featured: false };
    setContent((prev) => ({ ...prev, [listKey]: [...prev[listKey], newEvent] }));
  };
  const removeEvent = (listKey: "featuredEvents" | "allEvents", index: number) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));

  const updateMemberList = (listKey: "executiveMembers" | "subExecutiveMembers", index: number, updated: Member) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].map((item, i) => (i === index ? updated : item)) }));
  const addMember = (listKey: "executiveMembers" | "subExecutiveMembers") => setContent((prev) => ({ ...prev, [listKey]: [...prev[listKey], { name: "New Member", position: "Position", department: "", photo: "", facebook: "", linkedin: "", instagram: "" }] }));
  const removeMember = (listKey: "executiveMembers" | "subExecutiveMembers", index: number) => setContent((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));

  const updateSemester = (index: number, field: "slug" | "title" | "year" | "description", value: string) => {
    const next = [...content.hallOfFameSemesters];
    next[index] = { ...next[index], [field]: value } as Semester;
    setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
  };
  const addSemester = () => setContent((prev) => ({ ...prev, hallOfFameSemesters: [...prev.hallOfFameSemesters, { slug: `semester-${Date.now()}`, title: "New Semester", year: "2026", description: "Details...", members: [] }] }));
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
  const addCollaboration = () => setContent((prev) => ({ ...prev, collaborations: [...prev.collaborations, { name: "New Partner", eventName: "Event", type: "Partner", logo: "" }] }));
  const removeCollaboration = (index: number) => setContent((prev) => ({ ...prev, collaborations: prev.collaborations.filter((_, i) => i !== index) }));


  useEffect(() => {
    // Auth protection is handled by the AdminRoute wrapper in App.tsx
    // Applications live in their own admin-only collection on the backend.
    let cancelled = false;
    fetchApplications()
      .then((applications) => {
        if (!cancelled) {
          setContent((prev) => ({ ...prev, applications }));
        }
      })
      .catch((error) => console.error("Could not load applications from backend:", error));

    return () => {
      cancelled = true;
    };
  }, [setContent]);

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      await deleteApplication(id);
      setContent((prev) => ({ ...prev, applications: prev.applications.filter((application) => application.id !== id) }));
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert("Failed to delete the application on the server.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-start justify-between gap-4">
        <PageHero
          eyebrow="Admin Dashboard"
          title="Content Management System"
          description="Update your website data here. Ensure you click 'Finalize & Save' to persist changes."
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to reset all data to default? This will wipe your local saves.")) {
                window.localStorage.removeItem("austpc-content-v1");
                window.location.reload();
              }
            }}
            className="rounded-full border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
          >
            Reset Storage
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full flex flex-wrap gap-3">
        <button type="button" onClick={() => setActiveTab("home")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "home" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Home</button>
        <button type="button" onClick={() => setActiveTab("about")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "about" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>About</button>
        <button type="button" onClick={() => setActiveTab("events")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "events" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Events</button>
        <button type="button" onClick={() => setActiveTab("executive")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "executive" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Executive</button>
        <button type="button" onClick={() => setActiveTab("subExecutive")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "subExecutive" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Sub Exec</button>
        <button type="button" onClick={() => setActiveTab("hallOfFame")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "hallOfFame" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Hall of Fame</button>
        <button type="button" onClick={() => setActiveTab("notices")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "notices" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Notices</button>
        <button type="button" onClick={() => setActiveTab("collaborations")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "collaborations" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Collaborations</button>
        <button type="button" onClick={() => setActiveTab("applications")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === "applications" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}>Applications ({content.applications.length})</button>
        <button type="button" onClick={() => navigate("/admin/gallery")} className="rounded-full border border-[#00FF66]/40 bg-[#00FF66]/10 px-4 py-2 text-sm font-semibold text-[#00FF66] transition hover:bg-[#00FF66]/20">📷 Photo Gallery</button>
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
                      <ImageUploadField label="Hero Image" category="hero" value={slide} onChange={(value) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: prev.hero.slides.map((item, i) => (i === index ? value : item)) } }))} />
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
                      <div className="md:col-span-2 flex flex-col gap-2 text-sm text-zinc-300">
                        <span>Category</span>
                        <select
                          value={(testimonial as any).category || "Alumni"}
                          onChange={(e) => updateTestimonials(index, "category", e.target.value)}
                          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors appearance-none"
                        >
                          <option value="Alumni">Alumni</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Professional">Professional Photographer</option>
                          <option value="Current Member">Current Member</option>
                        </select>
                      </div>
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
                    <ImageUploadField label={`Gallery Image ${index + 1}`} category="gallery" value={image} onChange={(value) => updateGallery(index, value)} />
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
              <h3 className="text-lg text-white">All Events</h3>
              <p className="text-sm text-zinc-400">Mark an event as "Featured" to display it on the homepage (max 2).</p>
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
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button type="button" onClick={() => addMember("executiveMembers")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Member</button>
                <button type="button" onClick={handleArchivePanel} className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-500">Archive Panel to Hall of Fame</button>
              </div>
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
                    <h4 className="text-sm font-semibold text-[#00FF66]">Archived Members</h4>
                    {semester.members.map((member, memberIndex) => (
                      <MemberEditor
                        key={`hmemb-${memberIndex}`}
                        member={member}
                        onChange={(updated) => {
                          const next = [...content.hallOfFameSemesters];
                          next[index] = {
                            ...next[index],
                            members: next[index].members.map((item, i) => (i === memberIndex ? updated : item)),
                          };
                          setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
                        }}
                        onRemove={() => {
                          const next = [...content.hallOfFameSemesters];
                          next[index] = {
                            ...next[index],
                            members: next[index].members.filter((_, i) => i !== memberIndex),
                          };
                          setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
                        }}
                      />
                    ))}
                    <button type="button" onClick={() => {
                      const next = [...content.hallOfFameSemesters];
                      next[index] = { ...next[index], members: [...next[index].members, { name: "New Member", position: "Role", photo: "" }] };
                      setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
                    }} className="mt-2 rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Member</button>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" onClick={() => removeSemester(index)} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 transition hover:bg-red-400/10">Remove Semester</button>
                    <button type="button" onClick={() => {
                      if (confirm("Are you sure you want to unarchive this panel? This will replace the CURRENT Executive Panel with these members.")) {
                        setContent((prev) => ({
                          ...prev,
                          executiveMembers: [...semester.members],
                          hallOfFameSemesters: prev.hallOfFameSemesters.filter((_, i) => i !== index),
                        }));
                        alert("Unarchived successfully. The members have been moved to the Executive tab.");
                      }
                    }} className="rounded-full border border-yellow-400/30 px-3 py-1 text-sm text-yellow-300 transition hover:bg-yellow-400/10">Unarchive to Current Panel</button>
                  </div>
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
                    <div className="md:col-span-2"><ImageUploadField label="Poster" category="event" value={event.poster} onChange={(value) => updateUpcoming(index, "poster", value)} /></div>
                  </div>
                  <button type="button" onClick={() => removeUpcoming(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addUpcoming} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Upcoming Event</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "collaborations" && (
          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Collaborations & Partnerships</h2>
            <div className="mt-6 space-y-4">
              {content.collaborations.map((collab, index) => (
                <div key={`collab-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Partner Name" value={collab.name} onChange={(value) => updateCollaboration(index, "name", value)} />
                    <Field label="Event Name" value={collab.eventName} onChange={(value) => updateCollaboration(index, "eventName", value)} />
                    <Field label="Type" value={collab.type} onChange={(value) => updateCollaboration(index, "type", value)} />
                    <div className="md:col-span-2">
                      <ImageUploadField label="Logo" category="general" value={collab.logo} onChange={(value) => updateCollaboration(index, "logo", value)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeCollaboration(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300 hover:bg-red-400/10">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addCollaboration} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66] hover:bg-[#00FF66]/10">Add Collaboration</button>
            </div>
            <FinalizeUpdatesButton />
          </section>
        )}

        {activeTab === "applications" && (
          <section className="flex flex-col gap-8">
            {/* Membership Drive Config */}
            <div className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-white">Membership Drive Settings</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2 text-sm text-zinc-300">
                  <span>Drive Status</span>
                  <select
                    value={content.membershipDrive.status}
                    onChange={(e) => setContent(prev => ({ ...prev, membershipDrive: { ...prev.membershipDrive, status: e.target.value as "OPEN" | "CLOSED" } }))}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors appearance-none"
                  >
                    <option value="OPEN">OPEN - Accepting Applications</option>
                    <option value="CLOSED">CLOSED - No longer accepting</option>
                  </select>
                </div>
                <Field label="Semester Name (e.g. Spring 2026)" value={content.membershipDrive.semesterName} onChange={(value) => setContent(prev => ({ ...prev, membershipDrive: { ...prev.membershipDrive, semesterName: value } }))} />
                <Field label="Drive Folder Name/ID (defaults to semester name)" value={content.membershipDrive.driveFolderId} onChange={(value) => setContent(prev => ({ ...prev, membershipDrive: { ...prev.membershipDrive, driveFolderId: value } }))} />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white mb-4">Form Questions Configuration</h3>
                <p className="text-sm text-zinc-400 mb-4">Toggle which questions are required for the application form.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {content.membershipDrive.formSchema.map((field, idx) => (
                    <label key={field.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4 cursor-pointer hover:bg-white/5 transition">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => {
                          const newSchema = [...content.membershipDrive.formSchema];
                          newSchema[idx] = { ...field, required: e.target.checked };
                          setContent(prev => ({ ...prev, membershipDrive: { ...prev.membershipDrive, formSchema: newSchema } }));
                        }}
                        className="mt-1 h-4 w-4 accent-[#00FF66]"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{field.label}</span>
                        <span className="text-xs text-zinc-500">ID: {field.id}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <FinalizeUpdatesButton />
            </div>

            {/* Applications Spreadsheet */}
            <div className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  📋 Applications <span className="ml-2 text-base text-[#00FF66]">({content.applications.length})</span>
                </h2>
              </div>

              {content.applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-4xl mb-4">📭</span>
                  <p className="text-zinc-400 text-lg">No applications have been submitted yet.</p>
                  <p className="text-zinc-500 text-sm mt-1">Applications will appear here once students submit the join form.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
                          <th className="py-3 px-3 font-semibold">#</th>
                          <th className="py-3 px-3 font-semibold">Name</th>
                          <th className="py-3 px-3 font-semibold">Dept</th>
                          <th className="py-3 px-3 font-semibold">Email</th>
                          <th className="py-3 px-3 font-semibold">Phone</th>
                          <th className="py-3 px-3 font-semibold">Semester</th>
                          <th className="py-3 px-3 font-semibold">Date</th>
                          <th className="py-3 px-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {content.applications.map((app: Applicant, idx: number) => {
                          let extraData: Record<string, string> = {};
                          try { extraData = JSON.parse(app.skills || "{}"); } catch { /* ignore */ }
                          return (
                            <tr key={app.id} className="border-b border-white/5 hover:bg-white/5 transition group">
                              <td className="py-3 px-3 text-zinc-500">{idx + 1}</td>
                              <td className="py-3 px-3 font-medium text-white">{app.name}</td>
                              <td className="py-3 px-3 text-zinc-300">{app.department}</td>
                              <td className="py-3 px-3 text-zinc-300">
                                {app.email}
                                {extraData.personalEmail && <span className="block text-xs text-zinc-500">{extraData.personalEmail}</span>}
                              </td>
                              <td className="py-3 px-3 text-zinc-300">{app.phone || "—"}</td>
                              <td className="py-3 px-3 text-zinc-300">{app.semester || "—"}</td>
                              <td className="py-3 px-3 text-zinc-500 text-xs">{new Date(app.submittedAt).toLocaleDateString()}</td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  {extraData.photoUrl && (
                                    <a href={extraData.photoUrl} target="_blank" rel="noopener noreferrer"
                                       className="rounded-full border border-blue-400/30 px-2 py-0.5 text-[10px] text-blue-300 hover:bg-blue-400/10">
                                      📷 Photo
                                    </a>
                                  )}
                                  <button type="button" onClick={() => handleDeleteApplication(app.id)}
                                    className="rounded-full border border-red-400/30 px-2 py-0.5 text-[10px] text-red-300 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile card view */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {content.applications.map((app: Applicant, idx: number) => {
                      let extraData: Record<string, string> = {};
                      try { extraData = JSON.parse(app.skills || "{}"); } catch { /* ignore */ }
                      return (
                        <div key={app.id} className="rounded-[20px] border border-white/10 bg-black/30 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-xs text-zinc-500">#{idx + 1}</span>
                              <h3 className="text-base font-semibold text-white">{app.name}</h3>
                            </div>
                            <button type="button" onClick={() => handleDeleteApplication(app.id)}
                              className="rounded-full border border-red-400/30 px-2.5 py-1 text-xs text-red-300 hover:bg-red-400/10">
                              Delete
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                            <p><span className="text-zinc-600">Dept:</span> {app.department}</p>
                            <p><span className="text-zinc-600">Phone:</span> {app.phone || "—"}</p>
                            <p className="col-span-2"><span className="text-zinc-600">AUST Email:</span> {app.email}</p>
                            {extraData.personalEmail && <p className="col-span-2"><span className="text-zinc-600">Personal Email:</span> {extraData.personalEmail}</p>}
                            <p><span className="text-zinc-600">Semester:</span> {app.semester || "—"}</p>
                            <p><span className="text-zinc-600">Date:</span> {new Date(app.submittedAt).toLocaleDateString()}</p>
                            {extraData.studentId && <p><span className="text-zinc-600">ID:</span> {extraData.studentId}</p>}
                            {extraData.payment && <p><span className="text-zinc-600">Payment:</span> {extraData.payment}</p>}
                            {extraData.trxid && <p><span className="text-zinc-600">TrxID:</span> {extraData.trxid}</p>}
                            {extraData.reference && <p className="col-span-2"><span className="text-zinc-600">Ref:</span> {extraData.reference}</p>}
                            {extraData.graphicsSkill && <p><span className="text-zinc-600">Graphics:</span> {extraData.graphicsSkill}</p>}
                          </div>
                          {extraData.photoUrl && (
                            <a href={extraData.photoUrl} target="_blank" rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center gap-1 rounded-full border border-blue-400/30 px-3 py-1 text-xs text-blue-300 hover:bg-blue-400/10">
                              📷 View Passport Photo
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Individual applicant detail — expandable */}
                  <details className="mt-8 rounded-[24px] border border-white/10 bg-black/20">
                    <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-[#00FF66] hover:bg-white/5 rounded-[24px] transition">
                      📂 Expand Full Applicant Details ({content.applications.length} records)
                    </summary>
                    <div className="px-6 pb-6 space-y-4 mt-2">
                      {content.applications.map((app: Applicant, idx: number) => {
                        let extraData: Record<string, string> = {};
                        try { extraData = JSON.parse(app.skills || "{}"); } catch { /* ignore */ }
                        return (
                          <div key={app.id} className="rounded-[20px] border border-[#00FF66]/10 bg-black/40 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                              <h3 className="text-lg font-bold text-white">#{idx + 1} — {app.name}</h3>
                              <span className="text-xs text-[#00FF66]">{new Date(app.submittedAt).toLocaleString()}</span>
                            </div>
                            <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 lg:grid-cols-3">
                              <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Department</span>{app.department}</div>
                              <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">AUST Email</span>{app.email}</div>
                              {extraData.personalEmail && <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Personal Email</span>{extraData.personalEmail}</div>}
                              <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Phone</span>{app.phone || "—"}</div>
                              <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Semester</span>{app.semester || "—"}</div>
                              {extraData.studentId && <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Student ID</span>{extraData.studentId}</div>}
                              {extraData.payment && <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Payment</span>{extraData.payment}</div>}
                              {extraData.trxid && <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Transaction ID</span>{extraData.trxid}</div>}
                              {extraData.reference && <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Reference</span>{extraData.reference}</div>}
                              {extraData.graphicsSkill && <div><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Graphics Skill</span>{extraData.graphicsSkill}</div>}
                              {extraData.organizingSkill && <div className="sm:col-span-2 lg:col-span-3"><span className="text-zinc-500 block text-xs uppercase tracking-wider mb-0.5">Organizing Skill</span>{extraData.organizingSkill}</div>}
                            </div>
                            {extraData.photoUrl && (
                              <div className="mt-4 flex items-center gap-3">
                                <img src={extraData.photoUrl} alt="Passport" className="h-16 w-16 rounded-lg object-cover border border-white/10" />
                                <a href={extraData.photoUrl} target="_blank" rel="noopener noreferrer"
                                   className="text-xs text-blue-300 underline hover:text-blue-200">Open full photo ↗</a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}