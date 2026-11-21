
import express from "express";
import { body, param } from "express-validator";

import {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
} from "../controllers/internshipController.js";

import { validateRequest } from "../middleware/validate.js";

const router = express.Router();

// Common validation for internship fields
const internshipFieldsValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("domain").trim().notEmpty().withMessage("Domain is required"),

  body("mode")
    .isIn(["Remote", "Hybrid", "On-site"])
    .withMessage("Mode must be Remote, Hybrid, or On-site"),

  body("location").trim().notEmpty().withMessage("Location is required"),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("Skills must be a non-empty array"),

  body("skills.*")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Each skill must be a non-empty string"),

  body("openings")
    .isInt({ min: 0 })
    .withMessage("Openings must be zero or more")
];

// Additional ID validation for POST
const createValidation = [
  body("id").trim().notEmpty().withMessage("ID is required"),
  ...internshipFieldsValidation
];

// List internships
router.get("/", getInternships);

// Get internship by ID
router.get(
  "/:id",
  param("id").trim().notEmpty(),
  validateRequest,
  getInternshipById
);

// Create internship
router.post(
  "/",
  createValidation,
  validateRequest,
  createInternship
);

// Update internship
router.put(
  "/:id",
  param("id").trim().notEmpty(),
  ...internshipFieldsValidation,
  validateRequest,
  updateInternship
);

// Delete internship
router.delete(
  "/:id",
  param("id").trim().notEmpty(),
  validateRequest,
  deleteInternship
);

export default router;
