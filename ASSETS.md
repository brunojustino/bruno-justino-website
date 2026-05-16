# Assets guide

Place your personal files in these folders:

## Avatar

- **Path:** `assets/img/avatar.png`
- **Recommended:** 96×96 px or larger (square), PNG
- If the file is missing, a pixel placeholder with the letter **B** appears automatically.

## Music

- **Path:** `assets/audio/`
- Add your `.mp3` (or `.ogg`) files and update the playlist in `js/config.js`:

```javascript
musicTracks: [
  { title: { pt: "Minha música", en: "My song" }, src: "assets/audio/meu-arquivo.mp3" },
],
```

- The player only lists tracks that load successfully in the browser.
- With `musicAutoplay: true` in `js/config.js`, playback starts after Press Start (intro). Set it to `false` to require pressing Play manually. Some browsers may still block autoplay if the visitor never interacts.

## Font

- **Path:** `assets/fonts/pixel.woff2`
- Press Start 2P–style pixel font (already included if download succeeded).

## Email

- Edit `email` in `js/config.js` with your real address for the contact button.

## Skills & projects

- Edit arrays in `js/config.js` — no HTML changes needed.
