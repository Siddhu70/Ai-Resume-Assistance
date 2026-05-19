import { useState } from "react";
import axios from "axios";

export default function Home() {

  const [file, setFile] = useState(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [analysis, setAnalysis] =
    useState("");

  const [questions, setQuestions] =
    useState("");

  const [coverLetter, setCoverLetter] =
    useState("");

  const handleAnalyze = async () => {

    if (!file) {
      alert("Upload resume");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);

      formData.append(
        "jobDescription",
        jobDescription
      );

      const response = await axios.post(
        "http://localhost:5000/api/resume/analyze",
        formData
      );

      setAnalysis(response.data.analysis);

      setQuestions(
        response.data.questions
      );

      setCoverLetter(
        response.data.coverLetter
      );

    } catch (error) {

      console.log(error);

      alert("Error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 text-white p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          AI Resume Assistant
        </h1>

        <p className="text-slate-400 mb-10">
          Analyze your Resume using AI and Job Description.
        </p>

        <div className="bg-slate-800 p-8 rounded-3xl">

          <div className="mb-6">

            <label className="block mb-3">
              Upload Resume
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              className="w-full bg-slate-700 p-3 rounded-xl"
            />

          </div>

          <div className="mb-6">

            <label className="block mb-3">
              Job Description
            </label>

            <textarea
              rows="8"
              placeholder="Paste job description..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(
                  e.target.value
                )
              }
              className="w-full bg-slate-700 p-4 rounded-xl"
            />

          </div>

          <button
            onClick={handleAnalyze}
            className="bg-blue-600 px-8 py-4 rounded-xl"
          >

            {loading
              ? "Analyzing..."
              : "Analyze Resume"}

          </button>

        </div>

        {/* ATS RESULT */}

        {analysis && (

          <div className="bg-slate-800 p-8 rounded-3xl mt-10">

            <h2 className="text-3xl font-bold mb-5">
              ATS Analysis
            </h2>

            <div className="whitespace-pre-wrap leading-8 text-slate-300">
              {analysis}
            </div>

          </div>

        )}

        {/* INTERVIEW QUESTIONS */}

        {questions && (

          <div className="bg-slate-800 p-8 rounded-3xl mt-10">

            <h2 className="text-3xl font-bold mb-5">
              Interview Questions
            </h2>

            <div className="whitespace-pre-wrap leading-8 text-slate-300">
              {questions}
            </div>

          </div>

        )}

        {/* COVER LETTER */}

        {coverLetter && (

          <div className="bg-slate-800 p-8 rounded-3xl mt-10">

            <h2 className="text-3xl font-bold mb-5">
              Cover Letter
            </h2>

            <div className="whitespace-pre-wrap leading-8 text-slate-300">
              {coverLetter}
            </div>

          </div>

        )}

      </div>

    </div>

  );

}