# Music AI Recommendations

This project is a simple recommendation system for music albums, artists, and songs. The system is built using [Nx](https://nx.dev/) and powered by [Google Gemini](https://gemini.google.com/?hl=pt-BR) and [Spotify Api](https://developer.spotify.com/documentation/web-api).


https://github.com/user-attachments/assets/3dcd28d0-1087-443c-badc-d948365054e5


### How it works

---

The system will create a session for each user and store their interaction history for 15 minutes. During this time, we can interact with the platform to get recommendations. Every time you change the type of recommendations (artist, music, album, or tags), the history is reset.

The system also tracks usage of LLM tokens and will throw an error if the token limit is exceeded.

### Setup

---

Before running the project, you need to setup a few things:

- Make sure to have a [Redis](https://redis.io/) instance running.
- Setup a `.env` file in the directory `apps/music-ai-server` with the following variables:

```bash
NODE_ENV=development
PORT=3000
SESSION_SECRET=MY_SESSION_SECRET
SESSION_STORE_PREFIX=musicai:
CSRF_SECRET=MY_CSRF_SECRET
CSRF_COOKIE_NAME=CSRF_TOKEN
MUSIC_UI_APP_URL=http://localhost:4200
REDIS_URL=redis://localhost:6379
AI_KEY=GEMINI_API_KEY
RECOMMENDATION_LENGTH=3
CONTEXT_CACHE=true
MODEL=gemini-2.5-flash
SPOTIFY_CLIENT_ID=SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET=SPOTIFY_CLIENT_SECRET
```

### Running the project

Use Nx to run the project:

```bash
$ npx nx run-many --target=serve --all
```
