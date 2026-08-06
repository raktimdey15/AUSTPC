import { createContext, useContext, useEffect, useState } from "react";
import type { CollaborationItem, EventItem, Member, NoticeItem, Panelist, Semester, UpcomingEventItem } from "../data/siteContent";
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
import { api, submitApplication } from "../utils/api";

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
  testimonials: Array<{ quote: string; name: string; role: string }>;
  galleryHighlights: string[];
  featuredEvents: EventItem[];
  allEvents: EventItem[];
  executiveMembers: Member[];
  subExecutiveMembers: Member[];
  hallOfFameSemesters: Semester[];
  notices: NoticeItem[];
  upcomingEventsList: UpcomingEventItem[];
  collaborations: CollaborationItem[];
  applications: Applicant[];
}

interface ContentContextValue {
  content: SiteContentState;
  setContent: React.Dispatch<React.SetStateAction<SiteContentState>>;
  addApplication: (application: Omit<Applicant, "id" | "submittedAt">) => void;
  saveChanges: () => void;
  isSyncedFromBackend: boolean;
}

const STORAGE_KEY = "austpc-content-v1";

const normalizeSemester = (semester: Partial<Semester>): Semester => ({
  slug: semester.slug ?? "",
  title: semester.title ?? "",
  year: semester.year ?? "",
  description: semester.description ?? "",
  members: Array.isArray(semester.members) ? semester.members.map((member) => ({ ...member })) : [],
  panelists: Array.isArray(semester.panelists) ? semester.panelists.map((panelist) => ({ ...panelist })) : [],
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
  featuredEvents: initialFeaturedEvents.map((item) => ({ ...item })),
  allEvents: initialAllEvents.map((item) => ({ ...item })),
  executiveMembers: initialExecutiveMembers.map((item) => ({ ...item })),
  subExecutiveMembers: initialSubExecutiveMembers.map((item) => ({ ...item })),
  hallOfFameSemesters: initialHallOfFameSemesters.map((item) => ({
    ...item,
    members: item.members.map((member) => ({ ...member })),
    panelists: item.panelists.map((panelist: Panelist) => ({ ...panelist })),
  })),
  notices: initialNotices.map((item) => ({ ...item })),
  upcomingEventsList: initialUpcomingEvents.map((item) => ({ ...item })),
  collaborations: initialCollaborations.map((item) => ({ ...item })),
  applications: [],
});

const loadInitialState = () => {
  if (typeof window === "undefined") return createInitialState();
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return createInitialState();
  try {
    const parsed = JSON.parse(saved) as SiteContentState;
    return {
      ...createInitialState(),
      ...parsed,
      hallOfFameSemesters: Array.isArray(parsed.hallOfFameSemesters)
        ? parsed.hallOfFameSemesters.map((semester) => normalizeSemester(semester as Partial<Semester>))
        : createInitialState().hallOfFameSemesters,
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
        const { data } = await api.get("/content");
        if (!isMounted || !data || typeof data !== "object") {
          return;
        }

        const backendState = data as Partial<SiteContentState>;
        const mergedState = {
          ...createInitialState(),
          ...backendState,
          hallOfFameSemesters: Array.isArray(backendState.hallOfFameSemesters)
            ? backendState.hallOfFameSemesters.map((semester) => normalizeSemester(semester as Partial<Semester>))
            : createInitialState().hallOfFameSemesters,
        } as SiteContentState;

        setContent(mergedState);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
        setIsSyncedFromBackend(true);
      } catch (error) {
        console.error("[content] backend sync failed, using local cache", error);
      }
    };

    void syncFromBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveChanges = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      alert("✅ Updates saved to the server. Visitors will now see the new content.");
    } catch (error) {
      console.error("Storage Error:", error);
      alert("⚠️ Saved to the server, but the local cache is full. Use uploaded/linked images instead of Base64 URLs.");
    }
  };

  const addApplication = (application: Omit<Applicant, "id" | "submittedAt">) => {
    void submitApplication(application).catch((error) => {
      console.error("Could not save application to backend", error);
    });

    setContent((prev) => {
      const newState = {
        ...prev,
        applications: [
          { ...application, id: `${Date.now()}`, submittedAt: new Date().toISOString() },
          ...prev.applications,
        ],
      };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error("Could not auto-save application", e);
      }
      return newState;
    });
  };

  return <ContentContext.Provider value={{ content, setContent, addApplication, saveChanges, isSyncedFromBackend }}>{children}</ContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useSiteContent must be used within ContentProvider");
  return context;
}