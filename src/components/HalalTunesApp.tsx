"use client";

import { useState, useEffect } from "react";

export default function HalalTunesApp() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    const cleanBackendUrl = "https://ithiya-halaltunes.hf.space";

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Connect directly to the Hugging Face API!
      // This bypasses Vercel's 10s timeout limit.
      const res = await fetch(`${cleanBackendUrl}/api/process`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        let errorMsg = "Failed to process the audio";
        try {
            const data = await res.json();
            errorMsg = data.error || errorMsg;
        } catch(e) {}
        throw new Error(errorMsg);
      }

      // The backend returns an audio file directly
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      setResult(audioUrl);
    } catch (err: any) {
      setError(err.message || "Could not connect to Hugging Face backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            HalalTunes 🎶
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Extract vocals using your free Hugging Face API backend.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                id="youtube-url"
                name="url"
                type="url"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
            >
              {loading ? "Processing (Can take 5-10 mins on Free CPU)..." : "Remove Music"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm text-center rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
            <h3 className="text-lg font-medium text-green-800 text-center mb-2">
              Vocals Extracted! 🎉
            </h3>
            <audio controls className="w-full mt-2 mb-4">
              <source src={result} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-4 text-center">
              <a
                href={result}
                download="halal-vocals.wav"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Download Vocals
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}