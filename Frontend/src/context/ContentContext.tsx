import { createContext, useContext, useEffect, useState } from "react";
import type { CollaborationItem, EventItem, Member, NoticeItem, Semester, UpcomingEventItem } from "../data/siteContent";
import type { GalleryPhoto } from "../services/galleryService";
import {
  allEvents as initialAllEvents,
  collaborations as initialCollaborations,
  executiveMembers as initialExecutiveMembers,
  featuredEvents as initialFeaturedEvents,
  galleryHighlights as initialGalleryHighlights,
  hallOfFameSemesters as initialHallOfFameSemesters,
  notices as initialNotices,
  stats as initialStats,
  subExecutiveMembers as initialSubExecutiveMembers,
  testimonials as initialTestimonials,
  upcomingEvents as initialUpcomingEvents,
} from "../data/siteContent";
import { fetchSiteContent, updateSiteContent } from "../services/contentService";
import { submitApplication as supabaseSubmitApp } from "../services/applicationService";

export interface Applicant {
  id: string;
  name: string;
  department: string;
  email: string;
  semester: string;
  phone: string;
  skills: string;
  submittedAt: string;
}

export interface SiteContentState {
  hero: { eyebrow: string; title: string; subtitle: string; primaryButtonLabel: string; secondaryButtonLabel: string; slides: string[]; };
  home: { aboutTitle: string; aboutDescription: string; aboutPrimaryButtonLabel: string; aboutSecondaryButtonLabel: string; featuredTitle: string; featuredDescription: string; galleryTitle: string; galleryDescription: string; upcomingTitle: string; upcomingDescription: string; noticesTitle: string; noticesDescription: string; executiveTitle: string; executiveDescription: string; collaborationsTitle: string; testimonialsTitle: string; };
  about: { eyebrow: string; title: string; description: string; };
  eventsPage: { eyebrow: string; title: string; description: string; };
  executivePage: { eyebrow: string; title: string; description: string; };
  subExecutivePage: { eyebrow: string; title: string; description: string; };
  hallOfFamePage: { eyebrow: string; title: string; description: string; };
  upcomingEventsPage: { eyebrow: string; title: string; description: string; };
  noticePage: { eyebrow: string; title: string; description: string; };
  joinPage: { eyebrow: string; title: string; description: string; };
  stats: Array<{ value: string; label: string }>;
  testimonials: Array<{ quote: string; name: string; role: string; category?: string }>;
  galleryHighlights: string[];
  featuredGalleryPhotos: GalleryPhoto[];
  featuredEvents: EventItem[];
  allEvents: EventItem[];
  executiveMembers: Member[];
  subExecutiveMembers: Member[];
  hallOfFameSemesters: Semester[];
  notices: NoticeItem[];
  upcomingEventsList: UpcomingEventItem[];
  collaborations: CollaborationItem[];
  applications: Applicant[];
  membershipDrive: {
    status: "OPEN" | "CLOSED";
    semesterName: string;
    driveFolderId: string;
    spreadsheetId: string;
    formSchema: Array<{ id: string; label: string; type: string; required: boolean; options?: string[] }>;
  };
}

interface ContentContextValue {
  content: SiteContentState;
  setContent: React.Dispatch<React.SetStateAction<SiteContentState>>;
  addApplication: (application: Omit<Applicant, "id" | "submittedAt">) => void;
  saveChanges: () => void;
  isSyncedFromBackend: boolean;
}

const STORAGE_KEY = "austpc-content-v2";

const normalizeSemester = (semester: Partial<Semester>): Semester => ({
  slug: semester.slug ?? "",
  title: semester.title ?? "",
  year: semester.year ?? "",
  description: semester.description ?? "",
  members: Array.isArray(semester.members) ? semester.members.map((member) => ({ ...member })) : [],
});

const createInitialState = (): SiteContentState => ({
  hero: {
    eyebrow: "AUST Photography Club",
    title: "Where stories become timeless frames.",
    subtitle: "Explore exhibitions, workshops, and a thriving creative community built around photography, design, and visual leadership.",
    primaryButtonLabel: "Explore Events",
    secondaryButtonLabel: "Join the Club",
    slides: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"],
  },
  home: {
    aboutTitle: "Built for visual thinkers, storytellers, and future leaders.",
    aboutDescription: "AUSTPC brings together ambitious students who want to sharpen their eye, grow through collaboration, and turn passion into visible impact.",
    aboutPrimaryButtonLabel: "Read More",
    aboutSecondaryButtonLabel: "Meet the Team",
    featuredTitle: "Our most awaited experiences",
    featuredDescription: "Every event is designed to be memorable, relevant, and professionally executed.",
    galleryTitle: "Moments shaped by creativity and craft",
    galleryDescription: "A curated look at the visual energy that defines our community.",
    upcomingTitle: "What’s next on the calendar",
    upcomingDescription: "Stay informed with the latest workshops, walks, and gatherings.",
    noticesTitle: "Fresh updates from the club",
    noticesDescription: "The latest announcements and important reminders for members.",
    executiveTitle: "Leaders steering the creative vision",
    executiveDescription: "A dedicated team guiding events, partnerships, and club growth.",
    collaborationsTitle: "Partners who help shape the experience",
    testimonialsTitle: "Members speak about the experience",
  },
  about: { eyebrow: "About the Club", title: "A creative community built on craft and curiosity", description: "AUSTPC helps members grow through exhibitions, collaborations, and leadership-driven experiences.", },
  eventsPage: { eyebrow: "Events", title: "Curated experiences for every creative passion", description: "Discover photography exhibitions, workshops, photowalks, contests, and seminars hosted by the club throughout the year.", },
  executivePage: { eyebrow: "Executive Panel", title: "A leadership structure built for impact", description: "The executive board guides the club’s direction with professionalism, accountability, and a strong creative vision.", },
  subExecutivePage: { eyebrow: "Sub Executive Panel", title: "Dedicated contributors driving every initiative", description: "The sub-executive team supports the club’s programming with energy, specialized skills, and consistent execution.", },
  hallOfFamePage: { eyebrow: "Hall of Fame", title: "Semesters preserved as milestones of excellence", description: "Each semester page highlights the leadership, projects, and achievements that marked that chapter of the club.", },
  upcomingEventsPage: { eyebrow: "Upcoming Events", title: "Register early and secure your place", description: "Planned gatherings, field sessions, and creative workshops for members and collaborators.", },
  noticePage: { eyebrow: "Notice", title: "Important updates for members and applicants", description: "Stay informed with the latest announcements, deadlines, and club communications.", },
  joinPage: { eyebrow: "Join AUSTPC", title: "Apply to become a part of the club", description: "Fill in your details and share your interests so the club can welcome you into its next chapter.", },
  stats: initialStats.map((item) => ({ ...item })),
  testimonials: initialTestimonials.map((item) => ({ ...item })),
  galleryHighlights: [...initialGalleryHighlights],
  featuredGalleryPhotos: [],
  featuredEvents: initialFeaturedEvents.map((item) => ({ ...item })),
  allEvents: initialAllEvents.map((item) => ({ ...item })),
  executiveMembers: initialExecutiveMembers.map((item) => ({ ...item })),
  subExecutiveMembers: initialSubExecutiveMembers.map((item) => ({ ...item })),
  hallOfFameSemesters: initialHallOfFameSemesters.map((item) => ({
    ...item,
    members: item.members.map((member) => ({ ...member })),
  })),
  notices: initialNotices.map((item) => ({ ...item })),
  upcomingEventsList: initialUpcomingEvents.map((item) => ({ ...item })),
  collaborations: initialCollaborations.map((item) => ({ ...item })),
  applications: [],
  membershipDrive: {
    status: "CLOSED",
    semesterName: "",
    driveFolderId: "",
    spreadsheetId: "",
    formSchema: [
      { id: "name", label: "Name", type: "text", required: true },
      { id: "phone", label: "Phone Number", type: "text", required: true },
      { id: "studentId", label: "Student ID", type: "text", required: true },
      { id: "department", label: "Your Department", type: "text", required: true },
      { id: "semester", label: "Year & Semester", type: "text", required: true },
      { id: "email", label: "AUST Student Mail", type: "email", required: true },
      { id: "personalEmail", label: "Personal Email", type: "email", required: true },
      { id: "organizingSkill", label: "Any Previous Organizing Skill? (Write something about your experience)", type: "textarea", required: false },
      { id: "graphicsSkill", label: "Any Graphics Design Skill?", type: "checkbox", required: false },
      { id: "photo", label: "Proper passport size Photo for ID Card", type: "file", required: true },
      { id: "payment", label: "Payment Option", type: "select", required: true, options: ["Cash", "bKash"] },
      { id: "trxid", label: "Transaction ID (If cash payment, then write N/A)", type: "text", required: true },
      { id: "reference", label: "Reference (Which BA or Sub Executive informed you about the club?)", type: "text", required: false },
    ],
  },
});

const loadInitialState = () => {
  if (typeof window === "undefined") return createInitialState();
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return createInitialState();
  try {
    const parsed = JSON.parse(saved) as SiteContentState;
    const defaults = createInitialState();
    return {
      ...defaults,
      ...parsed,
      hallOfFameSemesters: Array.isArray(parsed.hallOfFameSemesters)
        ? parsed.hallOfFameSemesters.map((semester) => normalizeSemester(semester as Partial<Semester>))
        : defaults.hallOfFameSemesters,
      membershipDrive: {
        ...defaults.membershipDrive,
        ...(parsed.membershipDrive ?? {}),
        formSchema:
          parsed.membershipDrive?.formSchema?.length >= defaults.membershipDrive.formSchema.length
            ? parsed.membershipDrive.formSchema
            : defaults.membershipDrive.formSchema,
      },
      featuredGalleryPhotos: Array.isArray(parsed.featuredGalleryPhotos)
        ? parsed.featuredGalleryPhotos
        : defaults.featuredGalleryPhotos,
    };
  } catch {
    return createInitialState();
  }
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentState>(loadInitialState);
  const [isSyncedFromBackend, setIsSyncedFromBackend] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncFromBackend = async () => {
      try {
        // Fetch site content and actual gallery photos in parallel
        const { fetchGalleryPhotos } = await import("../services/galleryService");
        const [data, actualGalleryPhotos] = await Promise.all([
          fetchSiteContent(),
          fetchGalleryPhotos(),
        ]);
        if (!isMounted || !data) {
          return;
        }

        const backendState = data;
        const defaults = createInitialState();

        // Build a Set of all gallery photo IDs that actually exist in the DB
        const existingPhotoIds = new Set(actualGalleryPhotos.map((p) => p.id));

        // Filter out any featured photos that no longer exist in the gallery
        const rawFeatured = Array.isArray(backendState.featuredGalleryPhotos)
          ? backendState.featuredGalleryPhotos
          : defaults.featuredGalleryPhotos;
        const validFeatured = rawFeatured.filter((fp) => existingPhotoIds.has(fp.id));

        const mergedState = {
          ...defaults,
          ...backendState,
          hallOfFameSemesters: Array.isArray(backendState.hallOfFameSemesters)
            ? backendState.hallOfFameSemesters.map((semester) => normalizeSemester(semester as Partial<Semester>))
            : defaults.hallOfFameSemesters,
          // Smart merge for membershipDrive: keep new formSchema fields if backend has fewer
          membershipDrive: {
            ...defaults.membershipDrive,
            ...(backendState.membershipDrive ?? {}),
            formSchema:
              backendState.membershipDrive?.formSchema?.length >= defaults.membershipDrive.formSchema.length
                ? backendState.membershipDrive.formSchema
                : defaults.membershipDrive.formSchema,
          },
          // Use validated featured gallery photos (orphans removed)
          featuredGalleryPhotos: validFeatured,
        } as SiteContentState;

        setContent(mergedState);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
        setIsSyncedFromBackend(true);

        // If orphaned photos were removed, persist the cleaned state back to Supabase
        if (validFeatured.length !== rawFeatured.length) {
          console.log(`[content] Removed ${rawFeatured.length - validFeatured.length} orphaned featured photo(s)`);
          updateSiteContent(mergedState).catch(console.error);
        }
      } catch (error) {
        console.error("[content] Supabase sync failed, using local cache", error);
      }
    };

    void syncFromBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveChanges = async () => {
    try {
      // 1. Save to Supabase
      await updateSiteContent(content);
      // 2. Also save to local cache so reload is fast
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      alert("✅ Updates saved successfully to Supabase!");
    } catch (error) {
      console.error("Storage Error:", error);
      alert("❌ Save Failed: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const addApplication = async (application: Omit<Applicant, "id" | "submittedAt">) => {
    try {
      const savedApp = await supabaseSubmitApp(application);
      setContent((prev) => {
        const newState = {
          ...prev,
          applications: [savedApp, ...prev.applications],
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        return newState;
      });
    } catch (error) {
      console.error("Could not save application to Supabase", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return <ContentContext.Provider value={{ content, setContent, addApplication, saveChanges, isSyncedFromBackend }}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useSiteContent must be used within ContentProvider");
  return context;
}