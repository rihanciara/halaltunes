"use client";

import { useState } from "react";

export default function HalalTunesApp() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Send the URL to our backend to process
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process the audio");
      }

      setResult(data.audioUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            HalalTunes
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Remove music from YouTube videos and keep only the vocals.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="youtube-url" className="sr-only">
                YouTube URL
              </label>
              <input
                id="youtube-url"
                name="url"
                type="url"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Paste YouTube link here..."
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
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? "Processing..." : "Remove Music"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="text-lg font-medium text-green-800 text-center mb-2">
              Vocals Extracted!
            </h3>
            <audio controls className="w-full">
              <source src={result} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="mt-4 text-center">
              <a
                href={result}
                download="halal-vocals.mp3"
                className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
              >
                Download Audio
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
