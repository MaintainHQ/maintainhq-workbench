# MaintainHQ Workbench

A modern, multi-project desktop dashboard for managing Node/React apps and databases—no terminal required.

---

## ✨ Features

- **Multi-app/project control:** Start, stop, and restart multiple Node/React projects from one place
- **Sidebar navigation:** Clean, branded UI with your logo and colors
- **Port customisation:** Change dev server ports from the UI
- **Database management:** Check/install PostgreSQL/MySQL (Homebrew/Docker), open Bytebase for DB admin
- **Onboarding guide:** Interactive walkthrough for first-time users
- **App icon:** MaintainHQ circles icon for desktop and taskbar
- **No gradients, no clutter:** Minimal, foolproof experience

---

## 🖥️ Installation & Setup

1. **Install dependencies:**
   ```sh
   npm install
   npm install --save-dev webpack webpack-cli @babel/core @babel/preset-env @babel/preset-react babel-loader
   npm install react react-dom express electron
   ```
2. **Build the client:**
   ```sh
   npm run build:client
   ```
3. **Start the Electron app:**
   ```sh
   npm run electron
   ```
   The dashboard will open as a desktop app. If not, run `npm run electron` again or check for errors in your terminal.

---

## 🧭 Using MaintainHQ Workbench

- **Sidebar:** Navigate between Dashboard, Projects, Settings, and Help
- **Add/manage projects:** Use the Projects section to add folders and control multiple apps
- **Port customisation:** Change the port for any app in Settings
- **Database tools:** Check/install DBs and open Bytebase from the Database section
- **Onboarding:** The app will guide you through setup on first launch

---

## 🖼️ Screenshots

> _Replace these with real screenshots before release_

![Dashboard Screenshot](assets/placeholder-dashboard.png)
![Project Control Screenshot](assets/placeholder-projects.png)

---

## 🛠️ Troubleshooting

- **App won’t start?**
  - Make sure you’ve run all install/build steps
  - Check for errors in your terminal
- **Port in use?**
  - Change the port in Settings or close the conflicting app
- **Missing features?**
  - Some features (DB install, Bytebase integration) may require Homebrew or Docker installed on your system

---

## 📝 License

MIT License

---

## About

MaintainHQ Workbench is designed for developers who want a clean, foolproof way to manage multiple Node/React projects and databases—without touching the terminal. Built with Electron, React, and Express. 