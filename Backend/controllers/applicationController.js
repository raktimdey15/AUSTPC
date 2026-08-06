import Application from "../models/Application.js";

function toClientShape(application) {
  return {
    id: application._id.toString(),
    name: application.name,
    department: application.department,
    email: application.email,
    semester: application.semester,
    phone: application.phone,
    skills: application.skills,
    status: application.status,
    submittedAt: application.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function createApplication(req, res, next) {
  try {
    const { name = "", department = "", email = "", semester = "", phone = "", skills = "" } = req.body || {};

    if (!name.trim() || !department.trim() || !email.trim() || !semester.trim()) {
      return res.status(400).json({ message: "Name, department, email, and semester are required." });
    }

    const application = await Application.create({
      name,
      department,
      email,
      semester,
      phone,
      skills,
    });

    return res.status(201).json({ application: toClientShape(application) });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
}

export async function listApplications(req, res, next) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await Application.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json({ applications: applications.map(toClientShape) });
  } catch (error) {
    return next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body || {};
    const allowed = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(", ")}` });
    }

    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json({ application: toClientShape(application) });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid application id" });
    }
    return next(error);
  }
}

export async function deleteApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json({ message: "Application deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid application id" });
    }
    return next(error);
  }
}
