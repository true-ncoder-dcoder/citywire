# Verification — 14 September 2026

## Passed

- TypeScript validation and 35 automated channel-configuration tests.
- Ten live HTTP checks: five content endpoints, Tamil stream lookup, and four invalid-input cases.
- Browser selection flows through every one of the 30 preset cities, across all three city groups. Each selected the channel and language shown below.
- Embedded playback verified for TV9 Kannada (Bengaluru), TV9 Telugu (Hyderabad), Puthiya Thalaimurai (Chennai), ABP Asmita (Ahmedabad), Asianet News (Kochi), OTV (Bhubaneswar), News Live (Guwahati), ABP Ananda (Kolkata), ABP Majha (Mumbai) and ABP News (Delhi). Evidence included visible broadcasts, live indicators and/or unpaused video elements with readyState 4 and advancing media time. Ads can pause the underlying broadcast while playing their own video.
- Hindi fallback on unmapped states; city changes reset the player; native source embeds remain inside Citywire. No website-only TV channels remain.
- Light and dark switches, persistence across reload, theme applied before hydration, mobile city search, and phone-width TV layout without horizontal overflow (375 CSS pixels). Fixed low-contrast weather text in dark mode.
- The Tamil endpoint returned the current official YouTube embed.

## City matrix

| City | Default channel | Language |
|---|---|---|
| Delhi | ABP News | Hindi |
| Mumbai | ABP Majha | Marathi |
| Bengaluru | TV9 Kannada | Kannada |
| Hyderabad | TV9 Telugu | Telugu |
| Chennai | Puthiya Thalaimurai | Tamil |
| Kolkata | ABP Ananda | Bengali |
| Pune | ABP Majha | Marathi |
| Ahmedabad | ABP Asmita | Gujarati |
| Jaipur | ABP News | Hindi |
| Lucknow | ABP News | Hindi |
| Indore | ABP News | Hindi |
| Bhopal | ABP News | Hindi |
| Kochi | Asianet News | Malayalam |
| Coimbatore | Puthiya Thalaimurai | Tamil |
| Bhubaneswar | OTV | Odia |
| Guwahati | News Live | Assamese |
| Chandigarh | ABP News | Hindi |
| Nagpur | ABP Majha | Marathi |
| Patna | ABP News | Hindi |
| Visakhapatnam | TV9 Telugu | Telugu |
| Mysuru | TV9 Kannada | Kannada |
| Udaipur | ABP News | Hindi |
| Siliguri | ABP Ananda | Bengali |
| Shillong | ABP News | Hindi |
| Gaya | ABP News | Hindi |
| Alappuzha | Asianet News | Malayalam |
| Satara | ABP Majha | Marathi |
| Haldwani | ABP News | Hindi |
| Dibrugarh | News Live | Assamese |
| Tirunelveli | Puthiya Thalaimurai | Tamil |

## Scope and limits

Statewide programming is not city-exclusive news. A city with no listed regional broadcast uses Hindi; this does not imply that no regional broadcaster exists anywhere for that state. Streams and advertisements remain controlled by their providers. Cross-origin player failures cannot always be detected automatically; Reload player and Switch to Hindi remain available.

Waze map rendering and links work, but completeness of traffic overlays is not guaranteed; an earlier provider GeoRSS request returned HTTP 403.

Production build verification remains blocked by the Windows sandbox's spawn EPERM restriction encountered in earlier build attempts. The development app was tested through the user's running server. No claim of a successful production build or deployment is made.

## English live TV — 14 September 2026

Added India Today via the YouTube embed published on its official /youtube page. The server refreshes the published video ID with a five-minute cache. The /embed-live-tv website player was rejected because it refused third-party framing.

Browser testing on localhost:5173 confirmed the English player displayed Live, a Pause control, and video readyState 4 with paused false. Switching to Bengaluru restored TV9 Kannada as the default; English remained available through its dedicated button. Channel tests cover English availability for all 30 presets and an unknown state while preserving regional/Hindi defaults. Provider availability can change.

## Completed broadcast audit and expanded news — 26 September 2026

The interrupted 19 September audit verified in-app video playback (readyState 4, paused false and a positive playback clock) for ABP Ananda, ABP Majha, TV9 Kannada, TV9 Telugu, ABP Asmita, Asianet News, OTV, News Live, ABP News and Puthiya Thalaimurai. Tamil also had visual confirmation of the channel's LIVE overlay. Chennai was playing during that audit; no permanent source outage was reproduced. The UI previously could not distinguish YouTube playback from failure and showed an unconditional 20-second buffering hint.

Tamil and English now use the official YouTube IFrame API for actual playback status, autoplay-blocked guidance and explicit error/retry controls. Retries request a fresh broadcaster-published ID with no-store caching. Failures retain the chosen language until the user chooses Hindi. Third-party non-YouTube players retain their own controls and error UI; cross-origin restrictions prevent universal automatic health detection. The new wrapper fills the 16:9 player on small screens.

News now merges Google News with direct The Hindu, Hindustan Times and Times of India RSS feeds. Indian Express returned 403 from the app runtime and was not added as a direct source. Its reporting remains available through Google News. All sources are queried for every city; a direct publisher may have no current matching articles for smaller cities. No unrelated filler is added.

Live HTTP verification: all 30 preset city news endpoints returned 200, with no unavailable sources and descending timestamps throughout. There were 95 direct publisher articles across these responses. Chennai and Delhi also had 40 rendered news entries each, with descending DOM time attributes. The suite verifies publication time across timezone offsets, invalid/future/stale date exclusion, duplicate removal, all-city matching, aliases, safe URLs and failed-feed retry caching. Existing 10 API smoke checks passed.

Commands: node --experimental-strip-types tests/news-feeds.test.mjs; node --experimental-strip-types tests/news-live-smoke.mjs; node --experimental-strip-types tests/tv-source.test.mjs; node --experimental-strip-types tests/youtube-player.test.mjs; node --experimental-strip-types tests/tv-channels.test.mjs; node tests/api-smoke.mjs; node node_modules/typescript/bin/tsc --noEmit.

Live availability is a point-in-time result, not a guarantee of uninterrupted broadcaster service. Production deployment/build was not part of this audit.
Final 26 September browser check: Tamil playback and fresh-source reload succeeded; English playback reported playing with readyState 4 and paused false. Stop removed the iframe. The mobile-width player was 491.2 x 276.3 pixels (16:9), with no horizontal overflow. TypeScript and 47 unit checks passed, plus the 30-city news checks and 10 API smoke checks.
