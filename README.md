# HalalTunes 🎶

HalalTunes is a Next.js application designed to make copied YouTube songs or videos "music less" by extracting only the vocals. This application is optimized for deployment on Vercel.

## 🚀 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Architecture for Vercel

Since audio processing (like vocal isolation via Demucs/Spleeter models) requires heavy computational resources (GPUs) and exceeds Vercel's serverless function time limits and 50MB execution limits, this project is built using a decoupled architecture:

1. **Frontend**: A highly responsive Next.js App directory frontend hosted seamlessly on Vercel.
2. **Backend/API (Simulated)**: The `/api/process` endpoint currently simulates the process by returning a mock audio response.

### How to Implement Real Vocal Isolation:

To make this production-ready, you need to integrate a 3rd-party API in `src/app/api/process/route.ts`:

1. **Get Audio:** Use a service or library (like `ytdl-core` in a separate long-running worker or RapidAPI) to convert the YouTube link to an audio file.
2. **Audio Separation:** Use an API like **Replicate** (e.g., `cjwbw/demucs`) to process the audio file and isolate vocals from the instruments.
3. **Response:** Return the separated vocal audio URL to the Next.js frontend to be displayed and downloaded.

### 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Import the repository into your Vercel dashboard.
3. Add any necessary environment variables (e.g., `REPLICATE_API_TOKEN`).
4. Click **Deploy**.

## 📝 Technologies Used
* Next.js 14
* React
* Tailwind CSS
* Vercel Serverless Functions
