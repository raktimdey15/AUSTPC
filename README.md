<div align="center">
  <h1>📸 AUST Photography Club (AUSTPC) Official Website</h1>
  <p>The official web platform and content management system for the Ahsanullah University of Science and Technology Photography Club.</p>
</div>

<br />

Welcome to the **AUSTPC** website repository! This project is a modern, blazing-fast single-page application built with React, Vite, and TailwindCSS. It features a complete custom-built Admin Dashboard allowing the executive committee to manage 100% of the site's content dynamically via a serverless Supabase backend—no code changes required!

## ✨ Features

### Public Facing
- **Dynamic Hero & Galleries:** High-performance image loading and masonry grids.
- **Events & Notices:** Real-time updates for upcoming photography events and official club notices.
- **Executive Committee & Hall of Fame:** A beautifully designed, boxless, minimalist organizational hierarchy showcasing current and past committee members.
- **Join/Recruitment:** Integrated application forms for recruiting new members directly to the database.

### Admin Dashboard (`/admin`)
- **No-Code Content Management:** Update text, images, and links across every single page.
- **Single Source of Truth:** All website content is stored as a single, optimized JSON blob in Supabase for incredibly fast reads.
- **Panel Archiving System:** Automatically migrate an outgoing Executive Committee into the Hall of Fame with a single click, preserving all data (photos, departments, designations, and social links).
- **Media Management:** Direct integrations with Supabase Storage for uploading, updating, and deleting site imagery.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, Vite
- **Routing:** React Router (SPA configured for Vercel)
- **Styling:** Tailwind CSS, framer-motion (for animations), lucide-react / react-icons
- **Backend as a Service (BaaS):** Supabase (PostgreSQL, Authentication, Storage)
- **State Management:** React Context API (Global Content State)
- **Deployment:** Vercel

---

## 🏗️ Architecture & Data Flow

Unlike traditional CMS platforms, AUSTPC is built for maximum speed and minimal latency. 

1. **The JSONB Blob:** Instead of querying dozens of relational tables, the entire website's content (text, member lists, event lists) is stored as a single structured JSON object in a Supabase table (`site_content`).
2. **Global Context:** On load, `ContentContext.tsx` fetches this JSON object once and distributes it globally to all components.
3. **Admin Writes:** When an admin edits content in the dashboard, the entire JSON object is mutated in-memory and then upserted back to Supabase.
4. **Media Storage:** Images are uploaded to Supabase Storage buckets, and their public URLs are injected into the JSON object.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/AUSTPC.git
cd AUSTPC/Frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the `Frontend/` directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Development Server
```bash
npm run dev
```
The website will now be running at `http://localhost:5173`. 

*Note: To access the Admin panel locally, navigate to `http://localhost:5173/admin` and log in using your authorized Supabase Auth credentials.*

---

## 🌍 Deployment

This repository is optimized for deployment on **Vercel**. 

1. Connect your GitHub repository to Vercel.
2. Set the Root Directory to `Frontend`.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel's Environment Variables settings.
4. Deploy! 

*(The `vercel.json` file is already included to handle React Router SPA rewrites and prevent 404s on page refresh).*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">
  <p>Built with ❤️ by the AUSTPC Web Development Team</p>
</div>
