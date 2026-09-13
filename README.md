# VerifyLens — Context-Aware Media Investigation

> *"VerifyLens does not only ask whether media is fake. It investigates whether the complete story attached to the media is trustworthy."*

VerifyLens is an advanced, prototype platform designed for journalists, researchers, and OSINT investigators to scrutinize media assets. It moves beyond standard "deepfake detection" by examining the **context** of a claim—cross-referencing visual authenticity with historical provenance, source independence, and semantic claims.

## Main Differentiator

Most tools tell you if an image is manipulated. Very few tell you if an authentic image is being used to tell a lie. 

VerifyLens introduces **Contextual Verification**: checking whether the claimed event, location, and date align with the media's historical footprint. We highlight "Authentic but False Context" as a primary category of misinformation.

## Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel (or standard Node.js server)

## Architecture Overview

VerifyLens follows a clear, privacy-first architectural flow:
1. **Intake & Privacy**: Users upload media with an optional claim. The client interface ensures strong privacy defaults ("Delete after analysis", "No-training-on-uploads").
2. **Analysis Simulation**: The `/investigate/[id]/processing` route acts as a pipeline orchestrator. (In a production environment, this delegates to heavy backend ML microservices).
3. **Data Aggregation**: The `AnalysisEngine` structures data into a comprehensive `InvestigationReport` (defined in `lib/types.ts`).
4. **Interactive Dashboard**: The `ReportView` parses the complex data into understandable, distinct panels (Overview, Evidence Graph, Timeline, Explainability, Counterfactuals, Provenance, Sources).

## Demo Instructions

1. Start the development server (`npm run dev`).
2. Navigate to `http://localhost:3000`.
3. Click "Start Investigation".
4. To test different outcomes, you can modify the simulated responses in `lib/mock-data.ts`, or bypass analysis directly to view these specific mock cases by navigating to their URLs:
   - **False Context Demo**: `/report/sample-001`
   - **Conflicting Evidence Demo**: `/report/conflicting-evidence`
   - **Insufficient Evidence Demo**: `/report/insufficient-evidence`

## Future AI Integrations

While currently a front-end prototype simulation, the architecture is designed to integrate with:
- **Vision-Language Models (VLMs)**: For semantic comparison between video content and written claims.
- **Audio/Lip-sync Models**: For detecting subtle temporal mismatches in speech generation.
- **Forensic Ensembles**: Error Level Analysis (ELA), DCT quantization, and noise print analysis.
- **Web Scraping & Reverse Image Search Pipelines**: To automatically build the Evidence Graph and Timeline.

## Known Limitations

- **Simulated Backend**: The current build uses mock data for the analysis engine. File uploads do not actually trigger ML workloads.
- **Graph Library**: The Evidence Graph uses a simplified, static CSS-based node layout rather than a robust physics-based graph library (like D3.js or Cytoscape) for the sake of the lightweight prototype.
- **C2PA Checking**: Actual cryptographic signature validation for Content Credentials is not yet implemented client-side.

## Local Setup

```bash
# Clone the repository
git clone https://github.com/your-org/verify-lens.git

# Navigate to the directory
cd verify-lens

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
