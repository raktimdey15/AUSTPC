export interface EventItem {
  slug: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  date: string;
  venue: string;
  image: string;
  featured?: boolean;
}

export interface Member {
  name: string;
  position: string;
  photo: string;
  facebook?: string;
  linkedin?: string;
}

export interface Semester {
  slug: string;
  title: string;
  year: string;
  description: string;
  members: Member[];
}

export interface NoticeItem {
  title: string;
  date: string;
  attachment: string;
  excerpt: string;
}

export interface UpcomingEventItem {
  title: string;
  description: string;
  date: string;
  venue: string;
  poster: string;
}

export interface CollaborationItem {
  name: string;
  eventName: string;
  type: string;
  logo: string;
}

export const featuredEvents: EventItem[] = [
  {
    slug: "lens-and-light-exhibition",
    title: "Lens & Light Exhibition",
    category: "Photography Exhibition",
    description: "A curated showcase of cinematic frames and bold visual stories.",
    longDescription:
      "Join us for a premium exhibition featuring exceptional work from club members and invited photographers. The evening blends visual storytelling, networking, and a live critique session.",
    date: "August 24, 2026",
    venue: "AUST Main Auditorium",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    slug: "golden-hour-photowalk",
    title: "Golden Hour Photowalk",
    category: "Photowalk",
    description: "An evening walk centered on color, movement, and storytelling.",
    longDescription:
      "Capture the city at its most expressive hour with guided prompts, composition tips, and a community critique at the end of the walk.",
    date: "September 10, 2026",
    venue: "Dhaka University Campus",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
];

export const allEvents: EventItem[] = [
  ...featuredEvents,
  {
    slug: "studio-stories-workshop",
    title: "Studio Stories Workshop",
    category: "Workshop",
    description: "Learn advanced lighting setups and portrait direction in a studio environment.",
    longDescription:
      "This hands-on workshop is ideal for photographers who want to improve their portrait work, lighting control, and creative confidence.",
    date: "October 5, 2026",
    venue: "AUST Media Lab",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "frame-forward-seminar",
    title: "Frame Forward Seminar",
    category: "Seminar",
    description: "A strategic talk on building a visual brand and shooting with intent.",
    longDescription:
      "Hear from established creatives about visual identity, portfolio design, and how photography can become a career.",
    date: "November 15, 2026",
    venue: "AUST Innovation Hub",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
];

export const stats = [
  { value: "15+", label: "Annual Events" },
  { value: "300+", label: "Active Members" },
  { value: "50+", label: "Awards Won" },
  { value: "96%", label: "Member Satisfaction" },
];

export const testimonials = [
  {
    quote:
      "The club gave me direction, confidence, and a genuine community of photographers.",
    name: "Nadia Rahman",
    role: "Senior Member",
  },
  {
    quote:
      "Every event feels curated, professional, and inspiring from the first frame to the last.",
    name: "Rafiul Islam",
    role: "Photography Lead",
  },
];

export const galleryHighlights = [
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
];

export const executiveMembers: Member[] = [
  { name: "Farhan Uddin", position: "Advisor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Nusrat Jahan", position: "Treasurer", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Arif Rahman", position: "President", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Mahir Kabir", position: "Vice President", photo: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Shafa Islam", position: "General Secretary", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Sajid Arefin", position: "Executive Member", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
];

export const subExecutiveMembers: Member[] = [
  { name: "Amina Hoque", position: "Graphics", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Tanzim Alam", position: "Photography", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Rifah Chowdhury", position: "Content", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Khalid Hasan", position: "Event Management", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
];

export const hallOfFameSemesters: Semester[] = [
  {
    slug: "spring-2026",
    title: "Spring 2026",
    year: "2026",
    description: "A semester defined by bold exhibitions and community-led projects.",
    members: executiveMembers,
  },
  {
    slug: "fall-2025",
    title: "Fall 2025",
    year: "2025",
    description: "A milestone year of workshops, outreach, and polished portfolio growth.",
    members: executiveMembers.slice(0, 4),
  },
  {
    slug: "spring-2025",
    title: "Spring 2025",
    year: "2025",
    description: "Highlights from a high-energy year of collaboration and public showcases.",
    members: executiveMembers.slice(1, 5),
  },
];

export const notices: NoticeItem[] = [
  {
    title: "New Membership Drive Begins",
    date: "July 18, 2026",
    attachment: "PDF / Flyer",
    excerpt: "Applications for the upcoming semester are now open for passionate creatives.",
  },
  {
    title: "Workshop Registration Deadline",
    date: "July 25, 2026",
    attachment: "Form Link",
    excerpt: "Secure your spot before the workshop seats are filled.",
  },
];

export const upcomingEvents: UpcomingEventItem[] = [
  {
    title: "Streetlight Stories",
    description: "An urban narrative walk exploring light, texture, and composition.",
    date: "August 12, 2026",
    venue: "Old Dhaka",
    poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Portrait Lab Night",
    description: "A focused evening on studio lighting and creative direction.",
    date: "August 30, 2026",
    venue: "AUST Media Studio",
    poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  },
];

export const collaborations: CollaborationItem[] = [
  {
    name: "AUST Media Lab",
    eventName: "Studio Stories Workshop",
    type: "Workshop Partner",
    logo: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Dhaka Design Collective",
    eventName: "Frame Forward Seminar",
    type: "Creative Collaboration",
    logo: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80",
  },
];
