
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const db = new Database(
  process.env.DB_PATH || "./data/internships.db"
);

// Enable foreign key constraints
db.pragma("foreign_keys = ON");

// Create internships table
db.exec(`
  CREATE TABLE IF NOT EXISTS internships (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    mode TEXT NOT NULL,
    location TEXT NOT NULL,
    skills TEXT NOT NULL,
    openings INTEGER NOT NULL DEFAULT 1
  );
`);

// Create applications table
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internship_id TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (internship_id, applicant_email),

    FOREIGN KEY (internship_id)
    REFERENCES internships(id)
    ON DELETE CASCADE
  );
`);

// EdVyro sample internship records
const internships = [
  {
    id: "INT-101",
    title: "Frontend Intern",
    domain: "Full Stack Development",
    mode: "Remote",
    location: "India",
    skills: ["HTML", "CSS", "JavaScript"],
    openings: 3
  },
  {
    id: "INT-102",
    title: "API Engineer Intern",
    domain: "Full Stack Development",
    mode: "Hybrid",
    location: "Pune",
    skills: ["Node.js", "SQL", "Testing"],
    openings: 2
  },
  {
    id: "INT-103",
    title: "UI/UX Intern",
    domain: "UI/UX",
    mode: "Remote",
    location: "India",
    skills: ["Figma", "Research", "Accessibility"],
    openings: 1
  },
  {
    id: "INT-104",
    title: "Data Analyst Intern",
    domain: "Data Analytics",
    mode: "On-site",
    location: "Bengaluru",
    skills: ["Excel", "SQL", "Data visualisation"],
    openings: 2
  },
  {
    id: "INT-105",
    title: "Security Operations Intern",
    domain: "Cyber Security",
    mode: "Remote",
    location: "India",
    skills: ["Linux", "Logs", "Networking"],
    openings: 1
  }
];

// Insert sample records without duplicating them
const insertInternship = db.prepare(`
  INSERT OR IGNORE INTO internships
  (id, title, domain, mode, location, skills, openings)
  VALUES (
    @id, @title, @domain, @mode,
    @location, @skills, @openings
  )
`);

const seedDatabase = db.transaction((records) => {
  for (const record of records) {
    insertInternship.run({
      ...record,
      skills: JSON.stringify(record.skills)
    });
  }
});

seedDatabase(internships);

console.log("SQLite database connected successfully!");
console.log("EdVyro sample internship records inserted.");

export default db;
