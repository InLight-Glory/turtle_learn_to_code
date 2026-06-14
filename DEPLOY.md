# Deployment Guide

This project is a static web application built with HTML, CSS, and vanilla JavaScript. It requires no backend server, making it extremely easy to host.

Note: Progress, points, and avatar data are saved in the browser's `localStorage` on each device.

## Recommended Hosting: GitHub Pages

GitHub Pages is the simplest way to host this project directly from your GitHub repository for free.

### Steps to Deploy

1.  **Push to GitHub:**
    Ensure your latest code is pushed to your repository on GitHub.

2.  **Enable GitHub Pages:**
    - Go to your repository on GitHub.
    - Click on the **Settings** tab.
    - In the left sidebar, click on **Pages**.
    - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
    - Under **Branch**, select `main` (or the branch you want to deploy) and the `/ (root)` folder.
    - Click **Save**.

3.  **Wait for Deployment:**
    - GitHub will kick off a workflow to build and deploy your site. This usually takes less than a minute.
    - Refresh the Pages settings page to see your live URL (usually `https://<username>.github.io/<repo-name>/`).

## Alternative Hosting: Netlify / Vercel

You can also drop the project folder directly into [Netlify](https://www.netlify.com/) or import the repository into [Vercel](https://vercel.com/). Since there is no build step (no `npm build`), simply configure the **Publish directory** to be the root of the repo (or leave it blank).

## Local Development

To run the project locally, you can use Python's built-in HTTP server:

```bash
python3 -m http.server
```

Then open your browser to `http://localhost:8000`.
