# مولّد المنيمونكس الياباني — Japanese Mnemonic Builder

An interactive tool for Arabic speakers learning Japanese. Enter a Japanese word written phonetically in Arabic script (e.g. "كونيتشيوا"), and the app splits it into syllables then surfaces matching Arabic words for each syllable so you can craft a memorable mnemonic sentence.

## How It Works

1. Type a Japanese word in Arabic phonetic spelling
2. The app calls an AI model (via Netlify AI Gateway) to split it into syllables
3. Each syllable is matched against a local Arabic dictionary (`arabic.json`) — no API call needed for word lookup
4. Click any Arabic word to add it to your mnemonic builder
5. Write your mnemonic sentence in the builder card at the bottom

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Plain CSS with CSS custom properties (no framework) |
| Fonts | Cairo + Tajawal (Google Fonts) |
| AI (syllable splitting) | Anthropic Claude via Netlify AI Gateway |
| Word lookup | Local JSON dictionary (client-side filtering) |
| Deployment | Netlify |

## Running Locally

```bash
npm install
netlify dev
```

The app runs on `http://localhost:8888`. Netlify Dev emulates all Netlify features locally, including the AI Gateway environment variables required by the syllable-splitting function.

> **Note:** Netlify AI Gateway requires at least one production deploy before it activates. For local development you can set `ANTHROPIC_API_KEY` in a `.env` file.
