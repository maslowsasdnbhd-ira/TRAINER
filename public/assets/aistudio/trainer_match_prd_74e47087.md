# Product Requirements Document (PRD): AI-Powered Trainer & Course Matching Platform

## 1. Executive Summary & Objective
The goal of this project is to build an intelligent web application using Google AI Studio that bridges the gap between organizations/individuals seeking professional training and certified Train-the-Trainer (TTT) professionals. 

The platform allows trainers to upload their raw professional profiles, CVs, and TTT certificates. Google AI Studio (utilizing Gemini models with structured outputs and multimodal capabilities) will automatically parse, verify, and tag these documents. For learners or organizations, an intuitive search and filter engine matches their specific course requirements with qualified trainers based on validated qualifications, expertise, and certifications.

---

## 2. Target Audience & Personas
1. **Trainers / Instructors:** Professionals who want to showcase their credentials, upload TTT certificates, and get discovered by clients without manually filling out long profile forms.
2. **Course Seekers / HR Managers / Learners:** Users looking for specific training courses who need to filter trainers based on topic, certification type (e.g., HRD Corp, ISO, Six Sigma), verified credentials, and location or language.

---

## 3. Core Features & User Flow

### 3.1 Trainer Portal & Automated Document Parsing (AI-Powered)
* **Onboarding & Upload:** Trainers securely upload their CV (PDF/Word) and TTT certificate scans/images (PNG/JPG/PDF).
* **AI Extraction via Google AI Studio:** 
  * The backend sends the documents to Gemini using structured JSON output schema.
  * Gemini automatically extracts: Full Name, Years of Experience, Core Expertise/Topics, TTT Issuing Body, Certificate Validity Date, and Bio.
* **Profile Review & Publish:** Trainers review the extracted data in a clean UI form, make any necessary tweaks, and publish their profile to the marketplace directory.

### 3.2 Course Seeker Directory & Intelligent Filtering
* **Dynamic Search & Filters:** Users can filter trainers by:
  * Course category / Keywords (e.g., "Leadership", "AI & Data Science", "Financial Literacy").
  * TTT Certification status (Verified vs. Unverified).
  * Minimum rating or years of experience.
* **AI Matchmaker (Natural Language Search):** Instead of rigid filters, users can type a natural prompt (e.g., *"I need a certified TTT trainer who can teach Python to beginner managers in a 2-day workshop"*), and Google AI Studio parses the prompt to rank and recommend the best matching trainers.

---

## 4. Technology Stack & Google AI Studio Integration

* **Frontend:** React.js or HTML5/Tailwind CSS (Single-page application layout).
* **Backend:** Node.js / Python FastAPI to handle file uploads and API routing.
* **AI & Intelligence Layer (Google AI Studio / Gemini API):**
  * **Multimodal Processing:** Extract text and validate certificate images directly using Gemini's native vision capabilities.
  * **Structured Outputs (JSON Mode):** Ensure Gemini returns consistent schema structures for profile fields.
  * **Semantic Matching / Embeddings:** Use Gemini embeddings or prompt completion for natural language trainer recommendations.

---

## 5. Step-by-Step Implementation Guide in Google AI Studio

### Step 1: Design and Test the Extraction Prompt in Google AI Studio
1. Log into [Google AI Studio](https://aistudio.google.com/).
2. Create a new **Chat Prompt** or **Structured Prompt**.
3. Set the system instructions to act as an expert HR and certificate-parsing assistant.
4. Provide few-shot examples of a sample CV text and certificate image, mapping them to the desired JSON output schema:
   ```json
   {
     "trainer_name": "String",
     "certifications": [{"title": "String", "issuer": "String", "verified": "Boolean"}],
     "expertise_areas": ["String"],
     "years_experience": "Integer"
   }
   ```
5. Test uploading sample certificates and CVs in the playground until the JSON output is 100% reliable.

### Step 2: Export Code and Integrate API Keys
1. Once your prompt is optimized in Google AI Studio, click **Get Code**.
2. Select your preferred language (Python or JavaScript/Node.js).
3. Securely store your `GEMINI_API_KEY` in environment variables (`.env`).

### Step 3: Build the Application UI & Workflow
1. **Upload Component:** Create a drag-and-drop file upload zone for certificates and CVs.
2. **Parsing Pipeline:** When a file is uploaded, pass it to your backend script running the Google AI Studio SDK call.
3. **Database Layer:** Save the structured JSON response returned by Gemini into your database (e.g., Firebase Firestore or PostgreSQL).
4. **Search Interface:** Build the filter UI and connect the natural language search bar to a Gemini prompt query that matches user queries against your trainer database.

---

## 6. Success Metrics & Future Enhancements
* **Parsing Accuracy:** Target >95% accuracy in extracting TTT certificate details correctly on first pass.
* **Onboarding Speed:** Reduce trainer profile creation time from 15 minutes of manual typing to under 60 seconds via AI auto-fill.
* **Future Phase:** Add direct booking integration, automated video intro generation, and client review scoring.