# FocusFlow

This is an AI summary. I can't confirm if all the steps are accurate. I'm not going to test, but if I learn of an issue I can revise! I'm personally trying to test and learn the application myself.

FocusFlow is a single-task productivity application tailored to neurodivergent executive function and ADHD execution support. It eliminates activation paralysis, temporal distortion, and context collapse using single-task containment, visual time-blindness sweeps, and non-punitive momentum tracking.

---

## Features

* **Single-Task Execution Stage:** Eliminates multi-tasking overwhelm by locking focus onto one leaf task at a time.
* **Analog Radial Sweep & Flow Zone:** Replaces high-anxiety countdown digits with a visual radial arc that turns into an amber overtime halo rather than a punitive alarm.
* **Park & Resume Context Anchors:** Intercepts pauses to capture "Where I stopped" and the "Next 60-second action," mitigating working memory decay upon return.
* **1-Click Micro-Step Decomposer:** Splits overwhelming goals into atomic $\le$ 5-minute steps directly on the active clock.
* **3-Tier Project Hierarchy:** Enforces an organized structure: **Main Project → Sub-Project → Component Project**, reserving task execution strictly for leaf levels.
* **Calendar & Temporal Horizons:** Chunks deadlines into **Today**, **Next 7 Days**, and a shame-free **Gentle Recalibration** tray with 1-click `+1 Day`, `+3 Days`, and `+1 Week` rescheduling.
* **Momentum Blueprint:** Import complex roadmaps planned in an AI chat via natural Markdown outlines.
* **Personal Cloud Persistence:** Synchronizes seamlessly with Firebase Firestore, locked down to your private Google account.

---

## Architecture Overview

FocusFlow runs completely client-side as a static web application:

* **Frontend:** Vanilla ES6 JavaScript, HTML5, and Tailwind CSS.
* **Hosting:** GitHub Pages (Zero-cost, static hosting).
* **Backend:** Google Firebase (Firestore for JSON document storage, Firebase Auth for OAuth 2.0 verification).
* **Security Model:** Firestore security rules enforce strict authentication so that only your verified Google email can read or write database records.

---

## Deployment & Setup Guide

Follow this guide to fork the repository, set up your own free Firebase backend, and deploy a personal, private instance of FocusFlow on GitHub Pages.

### 1. Fork the Repository

1. Click the **Fork** button in the top-right corner of this repository.
2. Under **Owner**, select your GitHub account.
3. Keep the repository name as `FocusFlow` (or any name you prefer).
4. Ensure **Copy the `main` branch only** is checked, then click **Create fork**.

---

### 2. Create a Free Firebase Project

1. Navigate to the [Firebase Console](https://console.firebase.google.com/?utm_source=gemini) and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g., `my-focus-flow`), disable Google Analytics (not required), and click **Create project**.
4. Once created, click **Continue** to open the Project Overview dashboard.

---

### 3. Register a Web App & Retrieve Credentials

1. On the Project Overview page, click the **Web icon** (`</>`) to add a web application.
2. Enter an **App nickname** (e.g., `FocusFlow Web`).
3. Leave **Firebase Hosting** unchecked, and click **Register app**.
4. Look for the `const firebaseConfig = { ... };` block in the setup snippet. Copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};

```

---

### 4. Enable Google Authentication

1. In the Firebase Console left-hand menu, navigate to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Google** in the list of providers.
4. Toggle the **Enable** switch.
5. Choose a **Project support email** from the dropdown, then click **Save**.

#### Authorize Your GitHub Pages Domain

Firebase blocks authentication pop-ups from unapproved web domains:

1. In **Authentication**, click the **Settings** tab at the top.
2. Select **Authorized domains** from the sub-menu.
3. Click **Add domain**.
4. Type your GitHub Pages domain:
```text
<your-github-username>.github.io

```


5. Click **Done**.

---

### 5. Create the Firestore Database & Security Rules

1. In the left-hand menu, go to **Build > Firestore Database**.
2. Click **Create database**.
3. Choose a geographic region close to you and leave Database ID as `(default)`.
4. Select **Start in production mode** and click **Create**.
5. Once the database is provisioned, click on the **Rules** tab at the top of the Firestore console.
6. Replace the existing rules with the code below. **Make sure to change `your.email@gmail.com` to your actual lowercase Gmail address:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow read/write access to the specific authenticated account
    match /focus_flow/user_workspace {
      allow read, write: if request.auth != null 
                         && request.auth.token.email.lower() == "your.email@gmail.com";
    }
    // Block all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

```

7. Click **Publish**.

---

### 6. Update `js/storage.js` with Your Firebase Keys

1. Go to your forked `FocusFlow` repository on GitHub.
2. Open the file **`js/storage.js`**.
3. Click the **pencil icon** (Edit this file).
4. Locate the `firebaseConfig` object near the top of the file:
```javascript
const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

```


5. Replace the template values with the exact keys from **Step 3**.
6. Click **Commit changes...** and confirm.

---

### 7. Enable GitHub Pages

1. In your forked repository on GitHub, click the **Settings** tab.
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Under **Branch**, select **`main`** and leave the folder set to **`/(root)`**.
5. Click **Save**.
6. Wait 60–90 seconds. Refresh the Settings page until you see:
> *Your site is live at `https://<your-github-username>.github.io/FocusFlow/*`



---

### 8. Verification & Usage

1. Open your live GitHub Pages link: `https://<your-github-username>.github.io/FocusFlow/`.
2. In the left-hand sidebar, click **Sign in with Google**.
3. Authenticate with the Gmail address you placed in your Firestore security rules.
4. Create a task or update your project goals, then click **Save State to Cloud**.
5. When the button displays **`Saved to Cloud!`**, your private database is operational.

---

## File Structure

```text
FocusFlow/
├── index.html          # Application layout, stage cards, and modal dialogs
├── README.md           # Deployment and user documentation
├── css/
│   └── style.css       # Keyframe animations, radial dials, and responsive styles
└── js/
    ├── mascots.js      # Focus companion vector illustrations and tiers
    ├── storage.js      # Firebase authentication, state migration, and persistence
    ├── audio.js        # Web Audio API synthesizers and random sound profiles
    ├── analytics.js    # 20-metric ADHD biofeedback telemetry calculation engine
    ├── calendar.js     # Temporal horizon deck and non-punitive rescheduling
    ├── blueprint.js    # Markdown/JSON roadmap parser and AI prompt exporter
    └── app.js          # Core focus clock, micro-steps, and workspace routing

```

---

## Using Momentum Blueprint with AI

You can turn rough brainstorming sessions from an AI model (ChatGPT, Gemini, Claude) into active workspaces inside FocusFlow:

1. Click **Momentum Blueprint** in the sidebar.
2. Click **Copy Stage 1: Architect Prompt** and paste it into your AI conversation to organize your thoughts into realistic time blocks.
3. Review the proposed steps and fill in your target minute estimates.
4. Click **Copy Stage 2: Formatter Prompt** to format the output into clean FocusFlow Markdown syntax:
```markdown
# Project Title [YYYY-MM-DD]
Goal: Deliverable statement
## Sub-Project Milestone [YYYY-MM-DD]
### Component Track
- Atomic task name (25m) [YYYY-MM-DD]
- Secondary step (15m)

```


5. Paste the markdown into the Blueprint modal and click **Ingest Blueprint**. Your projects, sub-projects, tasks, and calendar dates will populate instantly.
