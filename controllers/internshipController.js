
import db from "../config/database.js";

// Format database records
const formatInternship = (item) => ({
  ...item,
  skills: JSON.parse(item.skills)
});

// GET: List internships with pagination and filters
export const getInternships = (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 5));
  const offset = (page - 1) * limit;

  const { search, domain, mode } = req.query;

  let conditions = [];
  let params = {};

  if (search) {
    conditions.push("(title LIKE @search OR domain LIKE @search)");
    params.search = `%${search}%`;
  }

  if (domain) {
    conditions.push("domain = @domain");
    params.domain = domain;
  }

  if (mode) {
    conditions.push("mode = @mode");
    params.mode = mode;
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const total = db.prepare(
    `SELECT COUNT(*) AS count FROM internships ${whereClause}`
  ).get(params).count;

  const records = db.prepare(`
    SELECT * FROM internships
    ${whereClause}
    ORDER BY id
    LIMIT @limit OFFSET @offset
  `).all({ ...params, limit, offset });

  res.json({
    status: "success",
    data: records.map(formatInternship),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

// GET: Get internship by ID
export const getInternshipById = (req, res) => {
  const record = db.prepare(
    "SELECT * FROM internships WHERE id = ?"
  ).get(req.params.id);

  if (!record) {
    return res.status(404).json({
      status: "error",
      message: "Internship not found"
    });
  }

  res.json({
    status: "success",
    data: formatInternship(record)
  });
};

// POST: Create internship
export const createInternship = (req, res) => {
  const { id, title, domain, mode, location, skills, openings } = req.body;

  const existing = db.prepare(
    "SELECT id FROM internships WHERE id = ?"
  ).get(id);

  if (existing) {
    return res.status(409).json({
      status: "error",
      message: "Internship ID already exists"
    });
  }

  db.prepare(`
    INSERT INTO internships
    (id, title, domain, mode, location, skills, openings)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    title,
    domain,
    mode,
    location,
    JSON.stringify(skills),
    openings
  );

  const created = db.prepare(
    "SELECT * FROM internships WHERE id = ?"
  ).get(id);

  res.status(201).json({
    status: "success",
    message: "Internship created successfully",
    data: formatInternship(created)
  });
};

// PUT: Update internship
export const updateInternship = (req, res) => {
  const existing = db.prepare(
    "SELECT id FROM internships WHERE id = ?"
  ).get(req.params.id);

  if (!existing) {
    return res.status(404).json({
      status: "error",
      message: "Internship not found"
    });
  }

  const { title, domain, mode, location, skills, openings } = req.body;

  db.prepare(`
    UPDATE internships
    SET title = ?, domain = ?, mode = ?,
        location = ?, skills = ?, openings = ?
    WHERE id = ?
  `).run(
    title,
    domain,
    mode,
    location,
    JSON.stringify(skills),
    openings,
    req.params.id
  );

  const updated = db.prepare(
    "SELECT * FROM internships WHERE id = ?"
  ).get(req.params.id);

  res.json({
    status: "success",
    message: "Internship updated successfully",
    data: formatInternship(updated)
  });
};

// DELETE: Delete internship
export const deleteInternship = (req, res) => {
  const result = db.prepare(
    "DELETE FROM internships WHERE id = ?"
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({
      status: "error",
      message: "Internship not found"
    });
  }

  res.json({
    status: "success",
    message: "Internship deleted successfully"
  });
};
