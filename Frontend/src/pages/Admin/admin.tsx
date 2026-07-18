import { useState, type ChangeEvent, type FormEvent } from "react";
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
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
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
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
      />
    </label>
  );
}

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={handleFile} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Or paste an image URL"
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
      />
    </label>
  );
}

function EventEditor({ event, onChange, onRemove }: { event: EventItem; onChange: (updated: EventItem) => void; onRemove: () => void }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{event.title || "New Event"}</h3>
        <button type="button" onClick={onRemove} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Title" value={event.title} onChange={(value) => onChange({ ...event, title: value })} />
        <Field label="Category" value={event.category} onChange={(value) => onChange({ ...event, category: value })} />
        <Field label="Date" value={event.date} onChange={(value) => onChange({ ...event, date: value })} />
        <Field label="Venue" value={event.venue} onChange={(value) => onChange({ ...event, venue: value })} />
        <Field label="Slug" value={event.slug} onChange={(value) => onChange({ ...event, slug: value })} />
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" checked={Boolean(event.featured)} onChange={(item) => onChange({ ...event, featured: item.target.checked })} />
          Featured on homepage
        </label>
        <TextAreaField label="Short Description" value={event.description} onChange={(value) => onChange({ ...event, description: value })} />
        <TextAreaField label="Long Description" value={event.longDescription} onChange={(value) => onChange({ ...event, longDescription: value })} />
        <div className="md:col-span-2">
          <ImageUploadField label="Event Image" value={event.image} onChange={(value) => onChange({ ...event, image: value })} />
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
        <button type="button" onClick={onRemove} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Name" value={member.name} onChange={(value) => onChange({ ...member, name: value })} />
        <Field label="Position" value={member.position} onChange={(value) => onChange({ ...member, position: value })} />
        <Field label="Facebook" value={member.facebook || ""} onChange={(value) => onChange({ ...member, facebook: value })} />
        <Field label="LinkedIn" value={member.linkedin || ""} onChange={(value) => onChange({ ...member, linkedin: value })} />
        <div className="md:col-span-2">
          <ImageUploadField label="Photo" value={member.photo} onChange={(value) => onChange({ ...member, photo: value })} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { content, setContent, addApplication } = useSiteContent();
  const [activeTab, setActiveTab] = useState<"content" | "applications">("content");
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    department: "",
    email: "",
    semester: "",
    phone: "",
    skills: "",
  });

  const updateHeroField = (key: keyof typeof content.hero, value: string) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const updateHomeField = (key: keyof typeof content.home, value: string) => {
    setContent((prev) => ({ ...prev, home: { ...prev.home, [key]: value } }));
  };

  const updatePageField = (pageKey: "about" | "eventsPage" | "executivePage" | "subExecutivePage" | "hallOfFamePage" | "upcomingEventsPage" | "noticePage" | "joinPage", key: "eyebrow" | "title" | "description", value: string) => {
    setContent((prev) => ({ ...prev, [pageKey]: { ...prev[pageKey], [key]: value } }));
  };

  const updateStats = (index: number, field: "value" | "label", value: string) => {
    const next = [...content.stats];
    next[index] = { ...next[index], [field]: value };
    setContent((prev) => ({ ...prev, stats: next }));
  };

  const addStats = () => setContent((prev) => ({ ...prev, stats: [...prev.stats, { value: "0", label: "New Stat" }] }));
  const removeStats = (index: number) => setContent((prev) => ({ ...prev, stats: prev.stats.filter((_, itemIndex) => itemIndex !== index) }));

  const updateTestimonials = (index: number, field: "quote" | "name" | "role", value: string) => {
    const next = [...content.testimonials];
    next[index] = { ...next[index], [field]: value };
    setContent((prev) => ({ ...prev, testimonials: next }));
  };

  const addTestimonial = () => setContent((prev) => ({ ...prev, testimonials: [...prev.testimonials, { quote: "New testimonial", name: "New Name", role: "Member" }] }));
  const removeTestimonial = (index: number) => setContent((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, itemIndex) => itemIndex !== index) }));

  const updateGallery = (index: number, value: string) => {
    const next = [...content.galleryHighlights];
    next[index] = value;
    setContent((prev) => ({ ...prev, galleryHighlights: next }));
  };

  const addGalleryImage = () => setContent((prev) => ({ ...prev, galleryHighlights: [...prev.galleryHighlights, ""] }));
  const removeGalleryImage = (index: number) => setContent((prev) => ({ ...prev, galleryHighlights: prev.galleryHighlights.filter((_, itemIndex) => itemIndex !== index) }));

  const updateEventList = (listKey: "featuredEvents" | "allEvents", index: number, updated: EventItem) => {
    setContent((prev) => ({ ...prev, [listKey]: prev[listKey].map((item, itemIndex) => (itemIndex === index ? updated : item)) }));
  };

  const addEvent = (listKey: "featuredEvents" | "allEvents") => {
    const newEvent: EventItem = {
      slug: `new-event-${Date.now()}`,
      title: "New Event",
      category: "Event",
      description: "Describe your new event here.",
      longDescription: "Add more detail here.",
      date: "TBD",
      venue: "TBD",
      image: "",
      featured: false,
    };
    setContent((prev) => ({ ...prev, [listKey]: [...prev[listKey], newEvent] }));
  };

  const removeEvent = (listKey: "featuredEvents" | "allEvents", index: number) => {
    setContent((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, itemIndex) => itemIndex !== index) }));
  };

  const updateMemberList = (listKey: "executiveMembers" | "subExecutiveMembers", index: number, updated: Member) => {
    setContent((prev) => ({ ...prev, [listKey]: prev[listKey].map((item, itemIndex) => (itemIndex === index ? updated : item)) }));
  };

  const addMember = (listKey: "executiveMembers" | "subExecutiveMembers") => {
    const member: Member = {
      name: "New Member",
      position: "Position",
      photo: "",
      facebook: "",
      linkedin: "",
    };
    setContent((prev) => ({ ...prev, [listKey]: [...prev[listKey], member] }));
  };

  const removeMember = (listKey: "executiveMembers" | "subExecutiveMembers", index: number) => {
    setContent((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, itemIndex) => itemIndex !== index) }));
  };

  const updateSemester = (index: number, field: "slug" | "title" | "year" | "description", value: string) => {
    const next = [...content.hallOfFameSemesters];
    next[index] = { ...next[index], [field]: value } as Semester;
    setContent((prev) => ({ ...prev, hallOfFameSemesters: next }));
  };

  const addSemester = () => {
    const newSemester: Semester = {
      slug: `semester-${Date.now()}`,
      title: "New Semester",
      year: "2026",
      description: "Describe this semester.",
      members: [],
    };
    setContent((prev) => ({ ...prev, hallOfFameSemesters: [...prev.hallOfFameSemesters, newSemester] }));
  };

  const removeSemester = (index: number) => setContent((prev) => ({ ...prev, hallOfFameSemesters: prev.hallOfFameSemesters.filter((_, itemIndex) => itemIndex !== index) }));

  const updateNotice = (index: number, field: keyof NoticeItem, value: string) => {
    const next = [...content.notices];
    next[index] = { ...next[index], [field]: value } as NoticeItem;
    setContent((prev) => ({ ...prev, notices: next }));
  };

  const addNotice = () => setContent((prev) => ({ ...prev, notices: [...prev.notices, { title: "New Notice", date: "TBD", attachment: "", excerpt: "Add details here." }] }));
  const removeNotice = (index: number) => setContent((prev) => ({ ...prev, notices: prev.notices.filter((_, itemIndex) => itemIndex !== index) }));

  const updateUpcoming = (index: number, field: keyof UpcomingEventItem, value: string) => {
    const next = [...content.upcomingEventsList];
    next[index] = { ...next[index], [field]: value } as UpcomingEventItem;
    setContent((prev) => ({ ...prev, upcomingEventsList: next }));
  };

  const addUpcoming = () => setContent((prev) => ({ ...prev, upcomingEventsList: [...prev.upcomingEventsList, { title: "New Event", description: "Describe it here.", date: "TBD", venue: "TBD", poster: "" }] }));
  const removeUpcoming = (index: number) => setContent((prev) => ({ ...prev, upcomingEventsList: prev.upcomingEventsList.filter((_, itemIndex) => itemIndex !== index) }));

  const updateCollaboration = (index: number, field: keyof CollaborationItem, value: string) => {
    const next = [...content.collaborations];
    next[index] = { ...next[index], [field]: value } as CollaborationItem;
    setContent((prev) => ({ ...prev, collaborations: next }));
  };

  const addCollaboration = () => setContent((prev) => ({ ...prev, collaborations: [...prev.collaborations, { name: "New Partner", eventName: "New Event", type: "Collaboration", logo: "" }] }));
  const removeCollaboration = (index: number) => setContent((prev) => ({ ...prev, collaborations: prev.collaborations.filter((_, itemIndex) => itemIndex !== index) }));

  const handleApplicationChange = (field: keyof typeof applicationForm, value: string) => {
    setApplicationForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplicationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addApplication(applicationForm);
    setApplicationForm({ name: "", department: "", email: "", semester: "", phone: "", skills: "" });
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Admin Dashboard"
        title="Manage the club website content and incoming applications"
        description="Edit hero content, homepage sections, page metadata, event cards, member profiles, notices, and join-form submissions from one place."
      />

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => setActiveTab("content")} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === "content" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300"}`}>
          Content Editor
        </button>
        <button type="button" onClick={() => setActiveTab("applications")} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === "applications" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300"}`}>
          Applications ({content.applications.length})
        </button>
      </div>

      {activeTab === "content" ? (
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
                <div key={`${slide}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Slide {index + 1}</h3>
                    <button type="button" onClick={() => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: prev.hero.slides.filter((_, itemIndex) => itemIndex !== index) } }))} className="rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                  </div>
                  <div className="mt-4">
                    <ImageUploadField label="Hero Image" value={slide} onChange={(value) => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: prev.hero.slides.map((item, itemIndex) => (itemIndex === index ? value : item)) } }))} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setContent((prev) => ({ ...prev, hero: { ...prev.hero, slides: [...prev.hero.slides, ""] } }))} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Hero Slide</button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Home Page Content</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="About Title" value={content.home.aboutTitle} onChange={(value) => updateHomeField("aboutTitle", value)} />
              <Field label="About Primary Button" value={content.home.aboutPrimaryButtonLabel} onChange={(value) => updateHomeField("aboutPrimaryButtonLabel", value)} />
              <Field label="About Secondary Button" value={content.home.aboutSecondaryButtonLabel} onChange={(value) => updateHomeField("aboutSecondaryButtonLabel", value)} />
              <Field label="Featured Title" value={content.home.featuredTitle} onChange={(value) => updateHomeField("featuredTitle", value)} />
              <Field label="Gallery Title" value={content.home.galleryTitle} onChange={(value) => updateHomeField("galleryTitle", value)} />
              <Field label="Upcoming Title" value={content.home.upcomingTitle} onChange={(value) => updateHomeField("upcomingTitle", value)} />
              <Field label="Notices Title" value={content.home.noticesTitle} onChange={(value) => updateHomeField("noticesTitle", value)} />
              <Field label="Executive Title" value={content.home.executiveTitle} onChange={(value) => updateHomeField("executiveTitle", value)} />
              <Field label="Collaborations Title" value={content.home.collaborationsTitle} onChange={(value) => updateHomeField("collaborationsTitle", value)} />
              <Field label="Testimonials Title" value={content.home.testimonialsTitle} onChange={(value) => updateHomeField("testimonialsTitle", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="About Description" value={content.home.aboutDescription} onChange={(value) => updateHomeField("aboutDescription", value)} />
              </div>
              <div className="md:col-span-2">
                <TextAreaField label="Featured Description" value={content.home.featuredDescription} onChange={(value) => updateHomeField("featuredDescription", value)} />
              </div>
              <div className="md:col-span-2">
                <TextAreaField label="Gallery Description" value={content.home.galleryDescription} onChange={(value) => updateHomeField("galleryDescription", value)} />
              </div>
              <div className="md:col-span-2">
                <TextAreaField label="Upcoming Description" value={content.home.upcomingDescription} onChange={(value) => updateHomeField("upcomingDescription", value)} />
              </div>
              <div className="md:col-span-2">
                <TextAreaField label="Notices Description" value={content.home.noticesDescription} onChange={(value) => updateHomeField("noticesDescription", value)} />
              </div>
              <div className="md:col-span-2">
                <TextAreaField label="Executive Description" value={content.home.executiveDescription} onChange={(value) => updateHomeField("executiveDescription", value)} />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Page Metadata</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="About Eyebrow" value={content.about.eyebrow} onChange={(value) => updatePageField("about", "eyebrow", value)} />
              <Field label="About Title" value={content.about.title} onChange={(value) => updatePageField("about", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="About Description" value={content.about.description} onChange={(value) => updatePageField("about", "description", value)} />
              </div>
              <Field label="Events Eyebrow" value={content.eventsPage.eyebrow} onChange={(value) => updatePageField("eventsPage", "eyebrow", value)} />
              <Field label="Events Title" value={content.eventsPage.title} onChange={(value) => updatePageField("eventsPage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Events Description" value={content.eventsPage.description} onChange={(value) => updatePageField("eventsPage", "description", value)} />
              </div>
              <Field label="Executive Eyebrow" value={content.executivePage.eyebrow} onChange={(value) => updatePageField("executivePage", "eyebrow", value)} />
              <Field label="Executive Title" value={content.executivePage.title} onChange={(value) => updatePageField("executivePage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Executive Description" value={content.executivePage.description} onChange={(value) => updatePageField("executivePage", "description", value)} />
              </div>
              <Field label="Sub Executive Eyebrow" value={content.subExecutivePage.eyebrow} onChange={(value) => updatePageField("subExecutivePage", "eyebrow", value)} />
              <Field label="Sub Executive Title" value={content.subExecutivePage.title} onChange={(value) => updatePageField("subExecutivePage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Sub Executive Description" value={content.subExecutivePage.description} onChange={(value) => updatePageField("subExecutivePage", "description", value)} />
              </div>
              <Field label="Hall of Fame Eyebrow" value={content.hallOfFamePage.eyebrow} onChange={(value) => updatePageField("hallOfFamePage", "eyebrow", value)} />
              <Field label="Hall of Fame Title" value={content.hallOfFamePage.title} onChange={(value) => updatePageField("hallOfFamePage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Hall of Fame Description" value={content.hallOfFamePage.description} onChange={(value) => updatePageField("hallOfFamePage", "description", value)} />
              </div>
              <Field label="Upcoming Eyebrow" value={content.upcomingEventsPage.eyebrow} onChange={(value) => updatePageField("upcomingEventsPage", "eyebrow", value)} />
              <Field label="Upcoming Title" value={content.upcomingEventsPage.title} onChange={(value) => updatePageField("upcomingEventsPage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Upcoming Description" value={content.upcomingEventsPage.description} onChange={(value) => updatePageField("upcomingEventsPage", "description", value)} />
              </div>
              <Field label="Notice Eyebrow" value={content.noticePage.eyebrow} onChange={(value) => updatePageField("noticePage", "eyebrow", value)} />
              <Field label="Notice Title" value={content.noticePage.title} onChange={(value) => updatePageField("noticePage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Notice Description" value={content.noticePage.description} onChange={(value) => updatePageField("noticePage", "description", value)} />
              </div>
              <Field label="Join Eyebrow" value={content.joinPage.eyebrow} onChange={(value) => updatePageField("joinPage", "eyebrow", value)} />
              <Field label="Join Title" value={content.joinPage.title} onChange={(value) => updatePageField("joinPage", "title", value)} />
              <div className="md:col-span-2">
                <TextAreaField label="Join Description" value={content.joinPage.description} onChange={(value) => updatePageField("joinPage", "description", value)} />
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Homepage Stats & Testimonials</h2>
            <div className="mt-6 space-y-4">
              {content.stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Value" value={stat.value} onChange={(value) => updateStats(index, "value", value)} />
                    <Field label="Label" value={stat.label} onChange={(value) => updateStats(index, "label", value)} />
                  </div>
                  <button type="button" onClick={() => removeStats(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addStats} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Stat</button>
            </div>
            <div className="mt-8 space-y-4">
              {content.testimonials.map((testimonial, index) => (
                <div key={`${testimonial.name}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name" value={testimonial.name} onChange={(value) => updateTestimonials(index, "name", value)} />
                    <Field label="Role" value={testimonial.role} onChange={(value) => updateTestimonials(index, "role", value)} />
                    <div className="md:col-span-2">
                      <TextAreaField label="Quote" value={testimonial.quote} onChange={(value) => updateTestimonials(index, "quote", value)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeTestimonial(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addTestimonial} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Testimonial</button>
            </div>
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-white">Gallery Highlights</h3>
              {content.galleryHighlights.map((image, index) => (
                <div key={`${image}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <ImageUploadField label={`Gallery Image ${index + 1}`} value={image} onChange={(value) => updateGallery(index, value)} />
                  <button type="button" onClick={() => removeGalleryImage(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addGalleryImage} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Gallery Image</button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Events & Programs</h2>
            <div className="mt-6 space-y-4">
              {content.featuredEvents.map((event, index) => (
                <EventEditor key={`${event.slug}-${index}`} event={event} onChange={(updated) => updateEventList("featuredEvents", index, updated)} onRemove={() => removeEvent("featuredEvents", index)} />
              ))}
              <button type="button" onClick={() => addEvent("featuredEvents")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Featured Event</button>
            </div>
            <div className="mt-8 space-y-4">
              {content.allEvents.map((event, index) => (
                <EventEditor key={`${event.slug}-${index}-all`} event={event} onChange={(updated) => updateEventList("allEvents", index, updated)} onRemove={() => removeEvent("allEvents", index)} />
              ))}
              <button type="button" onClick={() => addEvent("allEvents")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Event to Calendar</button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Executives, Sub Executives & Hall of Fame</h2>
            <div className="mt-6 space-y-4">
              {content.executiveMembers.map((member, index) => (
                <MemberEditor key={`${member.name}-${index}`} member={member} onChange={(updated) => updateMemberList("executiveMembers", index, updated)} onRemove={() => removeMember("executiveMembers", index)} />
              ))}
              <button type="button" onClick={() => addMember("executiveMembers")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Executive Member</button>
            </div>
            <div className="mt-8 space-y-4">
              {content.subExecutiveMembers.map((member, index) => (
                <MemberEditor key={`${member.name}-${index}-sub`} member={member} onChange={(updated) => updateMemberList("subExecutiveMembers", index, updated)} onRemove={() => removeMember("subExecutiveMembers", index)} />
              ))}
              <button type="button" onClick={() => addMember("subExecutiveMembers")} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Sub Executive Member</button>
            </div>
            <div className="mt-8 space-y-4">
              {content.hallOfFameSemesters.map((semester, index) => (
                <div key={`${semester.slug}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Slug" value={semester.slug} onChange={(value) => updateSemester(index, "slug", value)} />
                    <Field label="Title" value={semester.title} onChange={(value) => updateSemester(index, "title", value)} />
                    <Field label="Year" value={semester.year} onChange={(value) => updateSemester(index, "year", value)} />
                    <div className="md:col-span-2">
                      <TextAreaField label="Description" value={semester.description} onChange={(value) => updateSemester(index, "description", value)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeSemester(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addSemester} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Hall of Fame Semester</button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
            <h2 className="text-2xl font-semibold text-white">Notices, Upcoming Events & Collaborations</h2>
            <div className="mt-6 space-y-4">
              {content.notices.map((notice, index) => (
                <div key={`${notice.title}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={notice.title} onChange={(value) => updateNotice(index, "title", value)} />
                    <Field label="Date" value={notice.date} onChange={(value) => updateNotice(index, "date", value)} />
                    <Field label="Attachment" value={notice.attachment} onChange={(value) => updateNotice(index, "attachment", value)} />
                    <div className="md:col-span-2">
                      <TextAreaField label="Excerpt" value={notice.excerpt} onChange={(value) => updateNotice(index, "excerpt", value)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeNotice(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addNotice} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Notice</button>
            </div>
            <div className="mt-8 space-y-4">
              {content.upcomingEventsList.map((event, index) => (
                <div key={`${event.title}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title" value={event.title} onChange={(value) => updateUpcoming(index, "title", value)} />
                    <Field label="Date" value={event.date} onChange={(value) => updateUpcoming(index, "date", value)} />
                    <Field label="Venue" value={event.venue} onChange={(value) => updateUpcoming(index, "venue", value)} />
                    <div className="md:col-span-2">
                      <TextAreaField label="Description" value={event.description} onChange={(value) => updateUpcoming(index, "description", value)} />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUploadField label="Poster" value={event.poster} onChange={(value) => updateUpcoming(index, "poster", value)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeUpcoming(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addUpcoming} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Upcoming Event</button>
            </div>
            <div className="mt-8 space-y-4">
              {content.collaborations.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name" value={item.name} onChange={(value) => updateCollaboration(index, "name", value)} />
                    <Field label="Event Name" value={item.eventName} onChange={(value) => updateCollaboration(index, "eventName", value)} />
                    <Field label="Type" value={item.type} onChange={(value) => updateCollaboration(index, "type", value)} />
                    <div className="md:col-span-2">
                      <ImageUploadField label="Logo" value={item.logo} onChange={(value) => updateCollaboration(index, "logo", value)} />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeCollaboration(index)} className="mt-4 rounded-full border border-red-400/30 px-3 py-1 text-sm text-red-300">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addCollaboration} className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Add Collaboration</button>
            </div>
          </section>
        </div>
      ) : (
        <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
          <h2 className="text-2xl font-semibold text-white">Incoming Applications</h2>
          <form onSubmit={handleApplicationSubmit} className="mt-6 grid gap-4 rounded-[24px] border border-white/10 bg-black/30 p-5 md:grid-cols-2">
            <Field label="Name" value={applicationForm.name} onChange={(value) => handleApplicationChange("name", value)} />
            <Field label="Department" value={applicationForm.department} onChange={(value) => handleApplicationChange("department", value)} />
            <Field label="Email" type="email" value={applicationForm.email} onChange={(value) => handleApplicationChange("email", value)} />
            <Field label="Semester" value={applicationForm.semester} onChange={(value) => handleApplicationChange("semester", value)} />
            <Field label="Phone" value={applicationForm.phone} onChange={(value) => handleApplicationChange("phone", value)} />
            <Field label="Skills" value={applicationForm.skills} onChange={(value) => handleApplicationChange("skills", value)} />
            <div className="md:col-span-2">
              <button type="submit" className="rounded-full border border-[#00FF66]/30 px-4 py-2 text-sm font-semibold text-[#00FF66]">Submit Demo Application</button>
            </div>
          </form>
          <div className="mt-8 space-y-4">
            {content.applications.length === 0 ? (
              <p className="text-zinc-400">No applications have been submitted yet.</p>
            ) : (
              content.applications.map((application: Applicant) => (
                <div key={application.id} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{application.name}</h3>
                    <span className="text-sm text-[#00FF66]">{application.submittedAt}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-zinc-400 md:grid-cols-2">
                    <p><span className="text-zinc-500">Department:</span> {application.department}</p>
                    <p><span className="text-zinc-500">Email:</span> {application.email}</p>
                    <p><span className="text-zinc-500">Semester:</span> {application.semester}</p>
                    <p><span className="text-zinc-500">Phone:</span> {application.phone}</p>
                    <p className="md:col-span-2"><span className="text-zinc-500">Skills:</span> {application.skills}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
