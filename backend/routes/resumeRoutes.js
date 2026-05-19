import express from "express";
import multer from "multer";

import { extractTextFromPDF }
from "../services/pdfService.js";

import { analyzeResume }
from "../services/openaiService.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/analyze",
  upload.single("resume"),
  async (req, res) => {

    try {

      const filePath =
        req.file.path;

      const resumeText =
        await extractTextFromPDF(
          filePath
        );

      const jobDescription =
        req.body.jobDescription;

      // IMPORTANT
      const result =
        await analyzeResume(
          resumeText,
          jobDescription
        );

      res.json({
        success: true,

        analysis:
          result.analysis,

        questions:
          result.questions,

        coverLetter:
          result.coverLetter,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }
);

export default router;