import dotenv from "dotenv";
import OpenAI from "openai";

import {
  calculateATSScore,
} from "../utils/atsCalculator.js";

dotenv.config();

const openai = new OpenAI({
  apiKey:
    process.env.OPENROUTER_API_KEY,

  baseURL:
    "https://openrouter.ai/api/v1",

  defaultHeaders: {
    "HTTP-Referer":
      "http://localhost:5173",

    "X-Title":
      "AI Resume Assistant",
  },
});

export const analyzeResume = async (
  resumeText,
  jobDescription
) => {

  try {

    // =========================
    // EXTRACT TECHNICAL SKILLS
    // =========================

    const skillPrompt = `
Extract ONLY technical ATS keywords
from this job description.

Include ONLY:
- programming languages
- frameworks
- libraries
- databases
- tools
- cloud platforms
- software
- technical skills
- technologies

DO NOT include:
- locations
- benefits
- soft skills
- education
- personality traits
- generic words
- job type

Return ONLY comma-separated keywords.

Job Description:
${jobDescription}
`;

    const skillResponse =
      await openai.chat.completions.create({

        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: skillPrompt,
          },
        ],

      });

    // =========================
    // CONVERT TO ARRAY
    // =========================

    const extractedSkills =

      skillResponse
        .choices[0]
        .message
        .content

        .split(",")

        .map(skill =>
          skill
            .trim()
            .toLowerCase()
        )

        .filter(skill => skill);

    // =========================
    // ATS SCORE
    // =========================

    const atsData =
      calculateATSScore(
        resumeText,
        extractedSkills
      );

    // =========================
    // ATS ANALYSIS PROMPT
    // =========================

    const analysisPrompt = `
You are a professional ATS optimization assistant.

ATS SCORE:
${atsData.score}/100

MATCHED SKILLS:
${atsData.matchedSkills.join(", ")}

MISSING SKILLS:
${atsData.missingSkills.join(", ")}

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide:

1. Resume Improvements

2. Better Professional Summary

3. ATS Improvement Tips
`;

    const analysisResponse =
      await openai.chat.completions.create({

        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: analysisPrompt,
          },
        ],

      });

    // =========================
    // INTERVIEW QUESTIONS
    // =========================

    const questionPrompt = `
Generate 10 interview questions
for this candidate.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const questionResponse =
      await openai.chat.completions.create({

        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: questionPrompt,
          },
        ],

      });

    // =========================
    // COVER LETTER
    // =========================

    const coverLetterPrompt = `
Write a professional cover letter
for this candidate.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const coverLetterResponse =
      await openai.chat.completions.create({

        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: coverLetterPrompt,
          },
        ],

      });

    // =========================
    // RETURN RESPONSE
    // =========================

    return {

      analysis: `

ATS Score: ${atsData.score}/100

Matched Skills:
${atsData.matchedSkills.join(", ")}

Missing Skills:
${atsData.missingSkills.join(", ")}

${analysisResponse
  .choices[0]
  .message.content}

`,

      questions:

        questionResponse
          .choices[0]
          .message.content,

      coverLetter:

        coverLetterResponse
          .choices[0]
          .message.content,

    };

  } catch (error) {

    console.log(error);

    return {

      analysis:
        "AI service unavailable.",

      questions:
        "No questions generated.",

      coverLetter:
        "No cover letter generated.",

    };

  }

};