import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

// ======================
// CORS
// ======================

app.use(
  cors({

    origin: [
      "http://localhost:5173",

      "https://ai-resume-assistance-olive.vercel.app",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

    credentials: true,
  })
);

// ======================
// MIDDLEWARE
// ======================

app.use(express.json());

// ======================
// ROUTES
// ======================

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(
  "/api/resume",
  resumeRoutes
);

// ======================
// SERVER
// ======================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );

});