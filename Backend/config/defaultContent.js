// Canonical default site content. Mirrors the initial state used by the
// frontend (Frontend/src/data/siteContent.ts + ContentContext.createInitialState)
// so a freshly seeded database renders the site exactly like the static build.

const featuredEvents = [
  {
    slug: "lens-and-light-exhibition",
    title: "Lens & Light Exhibition",
    category: "Photography Exhibition",
    description: "A curated showcase of cinematic frames and bold visual stories.",
    longDescription:
      "Join us for a premium exhibition featuring exceptional work from club members and invited photographers. The evening blends visual storytelling, networking, and a live critique session.",
    date: "August 24, 2026",
    venue: "AUST Main Auditorium",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
];

const allEvents = [
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
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  },
];

const executiveMembers = [
  { name: "Farhan Uddin", position: "Advisor", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Nusrat Jahan", position: "Treasurer", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Arif Rahman", position: "President", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Mahir Kabir", position: "Vice President", photo: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Shafa Islam", position: "General Secretary", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Sajid Arefin", position: "Executive Member", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
];

const subExecutiveMembers = [
  { name: "Amina Hoque", position: "Graphics", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Tanzim Alam", position: "Photography", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Rifah Chowdhury", position: "Content", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
  { name: "Khalid Hasan", position: "Event Management", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80", facebook: "#", linkedin: "#" },
];

const hallOfFameSemesters = [
  {
    slug: "spring-2026",
    title: "Spring 2026",
    year: "2026",
    description: "A semester defined by bold exhibitions and community-led projects.",
    members: executiveMembers,
    panelists: [
      { name: "Arif Rahman", role: "President", email: "arif@example.com", bio: "Led the semester's major exhibitions and partnerships." },
      { name: "Mahir Kabir", role: "Vice President", email: "mahir@example.com", bio: "Coordinated event strategy and member growth." },
      { name: "Shafa Islam", role: "General Secretary", email: "shafa@example.com", bio: "Managed communication, documentation, and club operations." },
      { name: "Sajid Arefin", role: "Joint Secretary", email: "sajid@example.com", bio: "Supported logistics and volunteer management." },
    ],
  },
  {
    slug: "fall-2025",
    title: "Fall 2025",
    year: "2025",
    description: "A milestone year of workshops, outreach, and polished portfolio growth.",
    members: executiveMembers.slice(0, 4),
    panelists: [
      { name: "Nusrat Jahan", role: "President", email: "nusrat@example.com", bio: "Directed the semester's workshop series and outreach." },
      { name: "Farhan Uddin", role: "Vice President", email: "farhan@example.com", bio: "Led event planning and partnership development." },
      { name: "Rifah Chowdhury", role: "General Secretary", email: "rifah@example.com", bio: "Oversaw club documentation and planning." },
      { name: "Amina Hoque", role: "Joint Secretary", email: "amina@example.com", bio: "Managed member onboarding and volunteer coordination." },
    ],
  },
  {
    slug: "spring-2025",
    title: "Spring 2025",
    year: "2025",
    description: "Highlights from a high-energy year of collaboration and public showcases.",
    members: executiveMembers.slice(1, 5),
    panelists: [
      { name: "Farhan Uddin", role: "President", email: "farhan@example.com", bio: "Steered the semester's community showcases." },
      { name: "Shafa Islam", role: "Vice President", email: "shafa@example.com", bio: "Managed club events and member engagement." },
      { name: "Arif Rahman", role: "General Secretary", email: "arif@example.com", bio: "Handled records, communications, and approvals." },
      { name: "Tanzim Alam", role: "Joint Secretary", email: "tanzim@example.com", bio: "Supported event volunteers and execution." },
    ],
  },
];

export const defaultSiteContent = {
  hero: {
    eyebrow: "AUST Photography Club",
    title: "Where stories become timeless frames.",
    subtitle:
      "Explore exhibitions, workshops, and a thriving creative community built around photography, design, and visual leadership.",
    primaryButtonLabel: "Explore Events",
    secondaryButtonLabel: "Join the Club",
    // Served from Frontend/public — these paths work in dev AND in the production build.
    slides: ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg"],
  },
  home: {
    aboutTitle: "Built for visual thinkers, storytellers, and future leaders.",
    aboutDescription:
      "AUSTPC brings together ambitious students who want to sharpen their eye, grow through collaboration, and turn passion into visible impact.",
    aboutPrimaryButtonLabel: "Read More",
    aboutSecondaryButtonLabel: "Meet the Team",
    featuredTitle: "Our most awaited experiences",
    featuredDescription: "Every event is designed to be memorable, relevant, and professionally executed.",
    galleryTitle: "Moments shaped by creativity and craft",
    galleryDescription: "A curated look at the visual energy that defines our community.",
    upcomingTitle: "What's next on the calendar",
    upcomingDescription: "Stay informed with the latest workshops, walks, and gatherings.",
    noticesTitle: "Fresh updates from the club",
    noticesDescription: "The latest announcements and important reminders for members.",
    executiveTitle: "Leaders steering the creative vision",
    executiveDescription: "A dedicated team guiding events, partnerships, and club growth.",
    collaborationsTitle: "Partners who help shape the experience",
    testimonialsTitle: "Members speak about the experience",
  },
  about: {
    eyebrow: "About the Club",
    title: "A creative community built on craft and curiosity",
    description: "AUSTPC helps members grow through exhibitions, collaborations, and leadership-driven experiences.",
  },
  eventsPage: {
    eyebrow: "Events",
    title: "Curated experiences for every creative passion",
    description:
      "Discover photography exhibitions, workshops, photowalks, contests, and seminars hosted by the club throughout the year.",
  },
  executivePage: {
    eyebrow: "Executive Panel",
    title: "A leadership structure built for impact",
    description:
      "The executive board guides the club's direction with professionalism, accountability, and a strong creative vision.",
  },
  subExecutivePage: {
    eyebrow: "Sub Executive Panel",
    title: "Dedicated contributors driving every initiative",
    description:
      "The sub-executive team supports the club's programming with energy, specialized skills, and consistent execution.",
  },
  hallOfFamePage: {
    eyebrow: "Hall of Fame",
    title: "Semesters preserved as milestones of excellence",
    description:
      "Each semester page highlights the leadership, projects, and achievements that marked that chapter of the club.",
  },
  upcomingEventsPage: {
    eyebrow: "Upcoming Events",
    title: "Register early and secure your place",
    description: "Planned gatherings, field sessions, and creative workshops for members and collaborators.",
  },
  noticePage: {
    eyebrow: "Notice",
    title: "Important updates for members and applicants",
    description: "Stay informed with the latest announcements, deadlines, and club communications.",
  },
  joinPage: {
    eyebrow: "Join AUSTPC",
    title: "Apply to become a part of the club",
    description: "Fill in your details and share your interests so the club can welcome you into its next chapter.",
  },
  stats: [
    { value: "15+", label: "Annual Events" },
    { value: "300+", label: "Active Members" },
    { value: "50+", label: "Awards Won" },
    { value: "96%", label: "Member Satisfaction" },
  ],
  testimonials: [
    {
      quote: "The club gave me direction, confidence, and a genuine community of photographers.",
      name: "Nadia Rahman",
      role: "Senior Member",
    },
    {
      quote: "Every event feels curated, professional, and inspiring from the first frame to the last.",
      name: "Rafiul Islam",
      role: "Photography Lead",
    },
  ],
  galleryHighlights: [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80",
  ],
  featuredEvents,
  allEvents,
  executiveMembers,
  subExecutiveMembers,
  hallOfFameSemesters,
  notices: [
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
  ],
  upcomingEventsList: [
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
  ],
  collaborations: [
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
  ],
};

export function cloneDefaultSiteContent() {
  return JSON.parse(JSON.stringify(defaultSiteContent));
}
