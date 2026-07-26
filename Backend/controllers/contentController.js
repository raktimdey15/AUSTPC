import { getOrCreateContentDocument } from "../services/contentService.js";

export async function getSiteContent(_req, res) {
  try {
    const document = await getOrCreateContentDocument();
    return res.json(document.state || {});
  } catch (error) {
    return res.status(500).json({ message: "Failed to load content", error: error.message });
  }
}

export async function saveSiteContent(req, res) {
  try {
    const incomingState = req.body?.state ?? req.body;
    const document = await getOrCreateContentDocument();
    document.state = incomingState || {};
    await document.save();
    return res.json({ message: "Content saved", state: document.state });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save content", error: error.message });
  }
}

export async function submitApplication(req, res) {
  try {
    const { name = "", department = "", email = "", semester = "", phone = "", skills = "" } = req.body || {};

    if (!name.trim() || !department.trim() || !email.trim() || !semester.trim()) {
      return res.status(400).json({ message: "Name, department, email, and semester are required." });
    }

    const document = await getOrCreateContentDocument();
    const currentState = document.state && typeof document.state === "object" ? document.state : {};
    const application = {
      id: `${Date.now()}`,
      name: name.trim(),
      department: department.trim(),
      email: email.trim(),
      semester: semester.trim(),
      phone: phone.trim(),
      skills: skills.trim(),
      submittedAt: new Date().toISOString(),
    };

    document.state = {
      ...currentState,
      applications: [application, ...(Array.isArray(currentState.applications) ? currentState.applications : [])],
    };

    await document.save();
    return res.status(201).json({ application });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
}