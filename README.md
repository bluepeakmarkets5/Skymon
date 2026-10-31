# Skymon — Pocket Dragonborn: Journeys

An unofficial personal fan adventure: Skyrim's villages and cities reimagined as an original pixel-art creature RPG. All artwork, dialogue, game code and synthesized music are created for this project; no extracted commercial assets are included. This is not an official Bethesda, Nintendo, Game Freak, or Pokémon release.

## Play

Download `play/Riverwood-Adventure.html` for the original Riverwood adventure, or `play/Skymon-Journeys.html` for the expanded game. Open the downloaded HTML file in a desktop browser. Click **Begin adventure** to enable music. The HTML files include the game engine, art generator, music and all game logic; no login or game server is required.

The expansion is under active testing. It includes Whiterun, Riften, two countryside maps, nine companion species, capture encounters, three-companion parties, gym apprentices and leaders, badge rewards, and distinctive interiors. See `STATUS.md` for verified checks and remaining work.

## Controls

- WASD / arrow keys: walk. Shift: run.
- E / Space: interact. Enter: select.
- Escape: menu. J: journal. P: companions. M: travel.
- Battle: click/tap a move, or use arrows + Enter / number keys 1–4.
- Touch: directional pad and A button; all battle choices are tappable. Landscape is recommended.

Sven's original chicken-versus-bear battle remains in Riverwood. Use **M → Whiterun Tundra** to start collecting animals. Whiterun's gym is in Jorrvaskr; Riften's gym overlooks the canal. Defeat each gym's apprentice before its leader. Riften's leader requires the Skyforge Badge.

## Save data

Progress saves in browser local storage. The expanded game migrates original Riverwood saves at the same browser address. Saves are separate for downloaded files, localhost, and hosted URLs. Use **Menu → Import / export save** to move an expanded journey between them. Development verification (`?qa`) uses a separate test save and is excluded from production builds.

## Develop and build

Requires Node.js 20.19+ (Node 22 LTS recommended).

```sh
npm install
npm run dev
npm test
npm run build
```

The server prints the localhost and local-network addresses. The production site is generated in `dist/`; the build also packages a standalone game at `play/Skymon-Journeys.html`.

For an iPhone on the same Wi-Fi, open the server's **Network** URL in Safari, leaving the Mac running. `localhost` on your phone refers to the phone, not the Mac. Tap Begin/Continue to unlock audio. Physical iPhone Safari testing has not yet been completed.

To host, upload the contents of `dist/` to any static HTTPS host, or host the standalone HTML as an `index.html`. No backend, authentication, API key, or database is needed. The production site includes a web manifest and service worker for home-screen use after the first online visit. Browser storage and offline installation behaviour depend on the platform.

## Structure

- `src/world.ts`, `src/data.ts`: Riverwood exploration, original residents and quest.
- `src/expedition.ts`, `src/regions.ts`: cities, countryside, rooms, gyms and wildlife.
- `src/creatures.ts`, `src/encounter.ts`: species, abilities, affinities, team combat and capture.
- `src/battle.ts`, `src/battle-scene.ts`: original Sven encounter.
- `src/art.ts`, `src/expansion-art.ts`: original pixel assets, generated locally.
- `src/audio.ts`: original Web Audio score and sound effects.
- `src/state.ts`, `src/ui.ts`, `src/collection-ui.ts`: saves, menus, collection and travel.
- `tests/`: deterministic game-system tests.
- `play/`: self-contained playable HTML releases.

Geographic and character references: [Whiterun](https://skyrimmap.com/whiterun-map), [Riften](https://skyrimmap.com/location/riften), and [Riverwood roster](https://www.nexusmods.com/skyrimspecialedition/articles/3133). Dialogue and crossover gym roles are original fiction.
