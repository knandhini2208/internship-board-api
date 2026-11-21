
import express from "express";
import dotenv from "dotenv";
import "./config/database.js";
import internshipRoutes from "./routes/internshipRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Internship Board REST API is running!"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "API and database are working!",
    database: "Connected"
  });
});

// Internship routes
app.use("/api/internships", internshipRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("API Error:", err.message);

  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
