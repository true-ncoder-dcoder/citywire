# Citywire

Indian-city news, events, weather, traffic and embedded live TV. English interface with regional-language broadcasts.

## One-click start on Windows

Double-click **Start Citywire.cmd** in the project root. Install Node.js 22.13 or later first. The launcher installs dependencies if needed, starts the local server, and opens your default browser when ready. Keep its window open while using Citywire; press Ctrl+C to stop it. The first installation and live content need internet access.

## Run in Windows PowerShell

Use Node.js 22.13 or later. In this folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

Skip installation if dependencies are already installed. Open the address printed in the terminal, normally http://localhost:5173. Keep the terminal open; Ctrl+C stops it. Reload the browser after updating source if hot reload misses a change.

## Live TV

Select a city, open Live TV, and click Watch live. Channels play inside the app. Cities with a listed regional source select it automatically; all other cities, including places found through search, default to embedded Hindi ABP News. The Switch to Hindi button also works during a regional broadcast. National channels now contains Hindi; former website-only English options have been removed.

| State / coverage | Language | Broadcaster |
|---|---|---|
| West Bengal | Bengali | [ABP Ananda](https://bengali.abplive.com/live-tv) |
| Maharashtra | Marathi | [ABP Majha](https://marathi.abplive.com/live-tv) |
| Karnataka | Kannada | [TV9 Kannada](https://tv9kannada.com/live-tv) |
| Telangana, Andhra Pradesh | Telugu | [TV9 Telugu](https://tv9telugu.com/live-tv) |
| Gujarat | Gujarati | [ABP Asmita](https://gujarati.abplive.com/live-tv) |
| Kerala | Malayalam | [Asianet News](https://www.asianetnews.com/live-tv) |
| Odisha | Odia | [OTV](https://odishatv.in/live-tv) |
| Assam | Assamese | [News Live](https://newslivetv.com/live-tv/) |
| Tamil Nadu, Puducherry | Tamil | [Puthiya Thalaimurai](https://www.puthiyathalaimurai.com/live-tv) |
| National / fallback | Hindi | [ABP News](https://www.abplive.com/live-tv) |

These are statewide or national channels, not city-exclusive broadcasts. Broadcasters control programming, advertisements, controls and availability. No broadcasts are proxied and ads are not removed. The Tamil source resolves the broadcaster's current published video ID on playback and caches it for five minutes. If that source lookup fails, the app switches to Hindi. A cross-origin player can still fail independently; use Reload player or Switch to Hindi if playback stalls.

## Appearance

Use the Light mode / Dark mode switch in the header. The choice persists across reloads. With no saved choice, the app follows the device preference on initial load. The theme applies to the interface; broadcaster videos and third-party maps keep their own appearance.

## Other live data

News and traffic reports use English Google News RSS. Open-Meteo supplies weather and Indian-city search. AllEvents supplies upcoming dates, venues and ticket links; prices appear only when provided. BookMyShow is a separate event-discovery link. Waze supplies the map; overlays can be incomplete, so Google Maps traffic is also linked prominently. No fabricated fallback records are used.

No paid API keys are required. Provider commercial-use rules still apply, including Open-Meteo's public API restriction to non-commercial use. Event listings are organiser submitted; confirm details before booking.

## Checks

```powershell
node --experimental-strip-types tests/tv-channels.test.mjs
node tests/api-smoke.mjs
node node_modules/typescript/bin/tsc --noEmit
```

API checks need the dev server running. See TESTING.md for browser results. Production build: npm.cmd run build; then npm.cmd start serves the generated Worker locally. Production build verification remains limited by the Codex Windows sandbox's process restrictions; run the build in normal PowerShell. This package is source code, not a public deployment.
