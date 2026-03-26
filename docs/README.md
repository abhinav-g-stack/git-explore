# Local Setup Guide for EcomWave

This document provides instructions on how to set up and run the EcomWave project on your local machine for development and learning purposes.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

### 1. Copy Project Files

Since there is no direct download option from the web editor, you will need to manually recreate the project structure and copy the code for each file from Firebase Studio to your local computer.

Create a new directory for your project, and then create the following files and folders, copying the content from the editor:

- `package.json`
- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `components.json`
- `apphosting.yaml`
- `.env` (it can be empty)
- The entire `src/` directory, maintaining its internal structure.

### 2. Install Dependencies

Open a terminal or command prompt in the root directory of your project (where `package.json` is located) and run the following command to install all the required packages:

```bash
npm install
```

### 3. Set Up Environment Variables (for AI Features)

The AI features for generating product images are powered by Genkit and Google's Gemini models. To use these features, you'll need to set up authentication.

1.  Ensure the `.env` file exists in the root of your project (it can be empty).
2.  You will need a Google Cloud project with the "Vertex AI API" enabled.
3.  Set up Application Default Credentials (ADC) for your local environment. You can do this by running:
    ```bash
    gcloud auth application-default login
    ```
    This requires having the [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed.

### 4. Run the Development Servers

This project requires two separate development servers running simultaneously: one for the Next.js application and one for the Genkit AI flows.

**Terminal 1: Start the Next.js App**
```bash
npm run dev
```
Your application should now be running at [http://localhost:9002](http://localhost:9002).

**Terminal 2: Start the Genkit AI Server**
```bash
npm run genkit:watch
```
This command starts the Genkit server and will automatically restart it if you make changes to your AI flows. The Genkit development UI will be available at [http://localhost:4000](http://localhost:4000).

You are now all set up to run and modify the EcomWave application locally!
