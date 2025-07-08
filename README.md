# MaintainHQ Workbench

## Dependencies

Before you start, make sure you have the following installed globally:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

You will also need to install project dependencies:

```sh
npm install
npm install --save-dev webpack webpack-cli @babel/core @babel/preset-env @babel/preset-react babel-loader
npm install react react-dom express
```

## First-time Setup

1. **Install dependencies:**
   ```sh
   npm install
   npm install --save-dev webpack webpack-cli @babel/core @babel/preset-env @babel/preset-react babel-loader
   npm install react react-dom express
   ```
2. **Build the client:**
   ```sh
   npm run build:client
   ```
3. **Start the dashboard server:**
   ```sh
   npm run start:web
   ```
4. **Open your browser:**
   Go to http://localhost:5050

---

A web-based task manager for Procfile-based or npm-based applications, with additional features for database management and developer workflow automation.

## 🚀 Installation

```
$ npm install -g maintainhq-workbench
```

## 📄 Usage

To start MaintainHQ Workbench you can use `mhq [command] [options]` (or longer alias `maintainhq-workbench [command] [options]`).

Application provides two commands: `mhq start` and `mhq web` (read below).

Need help? Use command:

```
$ mhq --help
# or simply
$ mhq
```

## 💻 Console version (`mhq start`)

```
$ mhq start [options]
```

Run tasks from `Procfile` or `package.json`

Options:

* `-p, --package` - using package.json for managing tasks.
* `-t, --tasks [tasks]` - list of tasks to run asynchronously (example: `mhq start --tasks start,start:dev,start-server`)

## 💻 Web version (`mhq web`)

```
$ mhq web [options]
```

Launch the web application task manager. Reads `Procfile` and `package.json` and allows launching scripts from these files together.

Options:

* `-t, --tasks [tasks]` - list of tasks to manage in the web application
* `-p, --port <PORT>` - sets the server port, default `5050`
* `-n, --name <NAME>` - sets the project name. Defaults to the name in `package.json` or 'MaintainHQ Workbench'

## Features

- Start/stop/restart npm/Procfile scripts from a web UI
- Minimal, clean interface (no gradients)
- Database management (PostgreSQL/MySQL) coming soon
- One-click DB install (Homebrew/Docker)
- Open Bytebase for DB admin (new tab)
- Port customisation for dev server

## License

MIT License 