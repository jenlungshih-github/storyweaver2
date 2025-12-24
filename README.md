# Storyweaver (v0.2.0)

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
*   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
*   **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Features

- [x] **Firebase Authentication**: Secure access with guest login support.
- [x] **AI Story Generation**:
  - **Story Ideas**: Generate creative starting points for narratives.
  - **Outline Expansion**: Transform brief outlines into rich, multi-language children's stories.
  - **Story Feedback**: Get AI-powered critiques and suggestions.
- [x] **Writing Techniques**: A dedicated section to help users improve their storytelling with practical tips.
- [x] **Submit Feedback**: Direct channel for users to share their work and get professional input.
- [x] **Story Management**: Save, view, and organize your creative work with Firestore.
- [x] **Connectivity Monitoring**: Real-time status display for Firebase services.
- [x] **Modern UI**: A responsive, theme-aware interface built with Tailwind CSS and Radix UI.

## Version History

### v0.3.0
- **AI Story Feedback**: Implemented a new Genkit flow (`provide-story-feedback`) that uses a specialized prompt to deliver expert-level editorial feedback on children's stories, focusing on clarity, engagement, character, theme, and descriptive writing.

### v0.2.0
- Implemented Guest Login and environment-based configuration.
- Added Writing Skills and Submit Feedback pages.
- Refactored Story Expansion UI and integrated Gemini API key.
- Added real-time Firebase connectivity status monitoring.

### v0.1.0
- Initial implementation of Authentication and Story Management features.
- Integration with Genkit for AI-driven narratives.
- UI components setup with Shadcn.
