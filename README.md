# Storyweaver (v0.4.6)

This is a Next.js application built with Firebase, featuring AI-powered story generation, writing techniques, and comprehensive story management.

To get started, take a look at `src/app/page.tsx`.

## Technical Details

This project is built with the following technologies:

*   **Framework**: [Next.js](https://nextjs.org/) (v15.5.9)
*   **UI Library**: [React](https://react.dev/) (v19.2.1)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (v5)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v3.4.1)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (v1.20.0) with Google Gemini AI
*   **Backend & Auth**: [Firebase](https://firebase.google.com/) (v11.9.1)
*   **Database**: [Firestore](https://firebase.google.com/docs/firestore)
*   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Features

- [x] **Firebase Authentication**: Secure access with guest login support.
- [x] **AI Story Generation**:
  - **Story Ideas**: Generate creative starting points for narratives.
  - **Outline Expansion**: Transform brief outlines into rich, multi-language children's stories.
  - **Story Feedback**: Get AI-powered critiques and suggestions.
- [x] **Story Image Management**: Upload and replace cover images for every story. Automatic **4:3 landscape ratio** enforcement for a consistent UI.
- [x] **Writing Techniques**: A dedicated section to help users improve their storytelling with practical tips.
- [x] **Submit Feedback**: Direct channel for users to share their work and get professional input.
- [x] **Story Management**: Save, view, and organize your creative work with Firestore.
- [x] **Connectivity Monitoring**: Real-time status display for Firebase services.
- [x] **Professional UI**: A responsive, high-performance interface built with Tailwind CSS and Radix UI.

## Production Deployment & Secret Management

Deploying this application to Firebase App Hosting requires special configuration for the `GOOGLE_GENAI_API_KEY` to ensure the AI features work in a production environment.

The application is configured in `apphosting.yaml` to use a secret named `GOOGLE_GENAI_API_KEY`. This secret must be created in Google Cloud Secret Manager and the App Hosting backend needs to be granted access to it.

### Secret Setup Steps:

1.  **Login to Firebase:**
    ```bash
    firebase login --reauth
    ```

2.  **Set the Secret:** This command will create the secret if it doesn't exist or update it. You will be prompted to paste your API key.
    ```bash
    npx firebase apphosting:secrets:set GOOGLE_GENAI_API_KEY
    ```

3.  **Grant Access to the Backend:** You need to grant the App Hosting backend permission to access the secret. Replace `storyweaver2` with your backend ID if it's different (you can find it with `npx firebase apphosting:backends:list`).
    ```bash
    npx firebase apphosting:secrets:grantaccess GOOGLE_GENAI_API_KEY --backend=storyweaver2
    ```

4.  **Deploy:**
    ```bash
    firebase deploy
    ```

## Version History

### v0.4.6
- **Default Landing Page**: Changed the root redirect to land users on the "Story Collections" page by default for a better first-time experience.
- **Guest Welcome Banner**: Added a prominent and localized welcome banner for guest users on the collections page, emphasizing that signing in unlocks story creation and personal libraries.

### v0.4.5
- **Traditional Chinese Localization**: Translated all guest restriction messages and onboarding content into Traditional Chinese, ensuring a seamless experience for localized users.

### v0.4.4
- **Guest Access Restrictions**: Restricted guests (anonymous users) to reading Story Collections only. Create and Personal Library features are now locked with clear instructions for Guests to sign in.
- **Sidebar UI Improvements**: Added visual lock indicators to the sidebar for restricted features when logged in as a Guest.

### v0.4.3
- **Story Collections Deletion**: Added a delete button and confirmation dialog for stories in the Story Collections page, allowing for better organization.

### v0.4.2
- **Story Collections Fix**: Resolved a critical issue where stories in the "Story Collections" were not accessible after being copied.
- **Dynamic Versioning**: Centralized the version display (pulling from `package.json`) to ensure consistency across the UI.
- **Robust Field Handling**: Improved fault tolerance for stories with missing metadata (e.g., timestamps) in the collections view.
- **Enhanced Debugging**: Upgraded image upload error reporting to provide specific feedback on Firebase Storage permission issues.

### v0.4.1
- **Interactive Image Uploads**: Transformed story images into clickable triggers for replacement.
- **Hover Feedback**: Added a sleek dark overlay with progress indicators to improve the upload UX.
- **Unified Logic**: Streamlined the `ImageReplace` component to support both child-based triggers and standalone buttons.

### v0.4.0
- **Story Image Uploads**: Integrated Firebase Storage to allow users to upload and replace story cover images.
- **Aspect Ratio Enforcement**: Forced a 4:3 landscape aspect ratio across the UI for consistency.
- **UI Polish**: Added "Replace Image" buttons to both the story library and detail pages.

### v0.3.2
- **Robust API Protection**: Implemented self-healing logic to detect and de-duplicate mangled API keys (e.g., if pasted twice in the secret manager).
- **Diagnostics**: Added a temporary diagnostic tool to verify API key validity in production.

### v0.3.1
- **Production Hotfix**: Resolved a critical deployment issue where the Firebase App Hosting backend failed to access the `GOOGLE_GENAI_API_KEY`. This involved correctly setting up the secret in Google Cloud Secret Manager and granting the App Hosting backend explicit permission to access it.

### v0.3.0.1
- **AI Story Feedback**: Implemented a new Genkit flow (`provide-story-feedback`) that uses a specialized prompt to deliver expert-level editorial feedback on children's stories.

### v0.2.0
- Implemented Guest Login and environment-based configuration.
- Added Writing Skills and Submit Feedback pages.
- Refactored Story Expansion UI and integrated Gemini API key.
- Added real-time Firebase connectivity status monitoring.

### v0.1.0
- Initial implementation of Authentication and Story Management features.
- Integration with Genkit for AI-driven narratives.
- UI components setup with Shadcn.
