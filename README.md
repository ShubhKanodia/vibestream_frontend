# ⚡️ VibeStream Frontend — The Bhindi × Spotify Super-Agent Playground
_A gorgeous React + Vite UI that lets you sign-in with Spotify, grab your tokens and start jamming with the `spotify` agent inside Bhindi._

---

## 🎸 Why a dedicated frontend?
Bhindi already lets you talk to our Spotify super-agent through plain chat, but _getting the right OAuth tokens there first_ can be a hassle. This little web app solves that by providing:

1. **One-click Spotify Login** – we run the full OAuth flow for you and safely cache `access_token` + `refresh_token` in `localStorage`.
2. **Copy-paste Bhindi prompt** – automatically formats both tokens into a Markdown snippet that you can drop straight into Bhindi.
3. **Deep-link to Bhindi** – a handy button that opens Bhindi in a new tab already filled with your freshly minted tokens.
4. **Responsive, production-ready UI** – built with React 19, Vite 6, React-Router 7 and Bootstrap 5 for blazing-fast DX _and_ good looks.

> TL;DR – this repo is the quickest way to bootstrap yourself (or your team) into music-powered AI workflows.

---

## 🚀 Quick Start
1. **Clone & install dependencies**
   ```bash
   git clone https://github.com/your-org/vibestream_frontend.git
   cd vibestream_frontend
   pnpm i    # or npm install / yarn install
   ```
2. **Configure environment variables**
   Create a `.env` file at the project root and override anything you need. All variables are prefixed with `VITE_` so they are exposed to the client:
   ```dotenv
   # .env
   # Base URL of the VibeStream backend (defaults to the public cloud instance)
   VITE_API_BASE=https://vibe-stream-be.vercel.app
   ```
3. **Run locally (with HMR)**
   ```bash
   pnpm dev
   # 👉︎ visits http://localhost:5173
   ```
4. **Build & preview a production bundle**
   ```bash
   pnpm build      # bundles to ./dist
   pnpm preview    # serves ./dist at http://localhost:4173 for a final smoke test
   ```
5. **Lint** (optional but recommended)
   ```bash
   pnpm lint
   ```

---

## 🖥️ Project Structure (TL;DR)
```
├─ src/
│  ├─ pages/          # Login, AuthSuccess & router glue
│  ├─ assets/         # SVGs, PNGs & misc static files
│  ├─ App.jsx         # Route definitions
│  └─ ...             # Styles & helpers
├─ public/            # vite-served static files (favicon, logos)
├─ index.html         # single-page Shell injected by Vite
└─ vite.config.js     # Vite + React plugin config
```

---

## 🌐 Backend REST API Reference (for future hacking)
_The frontend uses only a subset of these endpoints today – the full list is here for dev convenience._

Base URL: `${VITE_API_BASE}` (defaults to `https://vibe-stream-be.vercel.app`)

### Health
| Verb | Endpoint | Purpose |
|------|----------|---------|
| GET  | `/health` | Liveness probe |

### Spotify OAuth
| Verb | Endpoint | Description |
|------|----------|-------------|
| GET | `/api/spotify-login` | Redirects the browser to Spotify's consent screen |
| GET | `/api/callback?code=…&state=…` | Backend exchange of `code` for tokens, then redirects back to `/auth-success` |
| GET | `/api/user-info` | Current Spotify profile – Requires `Authorization: Bearer <access_token>` |

### Bhindi Agent Endpoints
| Verb | Endpoint | Notes |
|------|----------|-------|
| GET | `/:agent` | Existence check (currently only `spotify`) |
| GET | `/:agent/tools` | JSON schema of all tools the agent exposes |
| POST | `/:agent/tools/:toolName` | Executes a tool.<br/>Headers:<br/>`x-spotify-access` — **access_token**<br/>`x-spotify-refresh` — **refresh_token**<br/>Body: JSON matching the tool's parameter schema |

---

## 🛠️ Exposed Tools (`spotify` agent)
| Tool | Purpose | Required Params | Optional Params |
|------|---------|-----------------|-----------------|
| `search_tracks` | Search tracks by text | `query` | `limit`, `offset` |
| `search_artists` | Search artists by text | `query` | `limit`, `offset` |
| `create_playlist` | Create a playlist in the current user's library | `name` | `description`, `public` |
| `add_tracks_to_playlist` | Push tracks into a playlist | `playlist_id`, `track_ids` | `position` |
| `remove_tracks_from_playlist` | Delete tracks from a playlist | `playlist_id`, `track_ids` | – |
| `get_playlist_items` | List tracks inside a playlist | `playlist_id` | `limit`, `offset` |
| `get_current_playback` | Inspect what the user is currently listening to | – | – |
| `get_recommendations` | Get Spotify's track recommendations | `seed_genres` | `limit`, `market` |
| `get_recently_played` | Fetch the user's last played tracks | – | `limit` |
| `get_user_profile` | Grab the current user's profile object | – | – |

> **All tools require the two headers mentioned above for authentication.**

---

## 🌟 Live Demo
The production build is auto-deployed to **https://vibestream-frontend.vercel.app**. Feel free to fork, brand & self-host – everything runs 100 % on the client.

---

## 🤝 Contributing
PRs, issues and feature requests are welcome! If you plan a larger change (e.g. adding dark-mode or a brand-new agent), please open an issue first so we can scope it together.

1. Fork the repo and create your branch: `git checkout -b feat/my-new-feature`
2. Commit your changes: `git commit -m "feat: add my new feature"`
3. Push to the branch: `git push origin feat/my-new-feature`
4. Open a Pull Request 🚀

---

## 📜 License
[MIT](LICENSE)

---

### Built with 🤖 by **Silvanites**
