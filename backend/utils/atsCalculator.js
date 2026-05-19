export const calculateATSScore = (
  resumeText,
  extractedSkills
) => {

  const resume =
    resumeText.toLowerCase();

  // =========================
  // DYNAMIC FILTER PATTERNS
  // =========================

  const unwantedPatterns = [

    // LOCATIONS

    /\bindia\b/i,
    /\bmumbai\b/i,
    /\bpune\b/i,
    /\bdelhi\b/i,
    /\bbangalore\b/i,
    /\bhyderabad\b/i,
    /\bchennai\b/i,
    /\bkolkata\b/i,

    /\bnew york\b/i,
    /\blondon\b/i,
    /\btokyo\b/i,
    /\bdubai\b/i,

    // JOB TYPES

    /full[- ]?time/i,
    /part[- ]?time/i,
    /internship/i,
    /fresher/i,
    /entry[- ]?level/i,

    // SOFT SKILLS

    /communication/i,
    /leadership/i,
    /teamwork/i,
    /critical thinking/i,
    /problem[- ]?solving/i,
    /time management/i,
    /detail[- ]?oriented/i,
    /analytical/i,

    // BENEFITS

    /career growth/i,
    /work environment/i,
    /learning opportunities/i,

    // GENERIC WORDS

    /experience/i,
    /knowledge/i,
    /ability/i,
    /responsible/i,
    /responsibilities/i,

  ];

  // =========================
  // FILTER SKILLS
  // =========================

  const filteredSkills =

    extractedSkills.filter(skill => {

      return !unwantedPatterns.some(
        pattern =>
          pattern.test(skill)
      );

    });

  // =========================
  // MATCHING
  // =========================

  let matchedSkills = [];
  let missingSkills = [];

  filteredSkills.forEach(skill => {

    if (
      resume.includes(skill)
    ) {

      matchedSkills.push(skill);

    } else {

      missingSkills.push(skill);

    }

  });

  // =========================
  // BASE SCORE
  // =========================

  let score = 0;

  if (
    filteredSkills.length > 0
  ) {

    score = Math.round(

      (matchedSkills.length /
        filteredSkills.length) * 100

    );

  }

  // =========================
  // BONUS SCORING
  // =========================

  const bonusSections = [

    "project",
    "projects",

    "experience",

    "certification",
    "certifications",

    "education",

    "achievement",
    "achievements",

  ];

  let bonus = 0;

  bonusSections.forEach(section => {

    if (
      resume.includes(section)
    ) {

      bonus += 2;

    }

  });

  score += bonus;

  // =========================
  // REMOVE DUPLICATES
  // =========================

  matchedSkills =
    [...new Set(matchedSkills)];

  missingSkills =
    [...new Set(missingSkills)];

  // =========================
  // LIMIT SCORE
  // =========================

  if (score > 100) {
    score = 100;
  }

  return {

    score,

    matchedSkills,

    missingSkills,

  };

};