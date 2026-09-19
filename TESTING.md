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
