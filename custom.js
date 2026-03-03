/**
 * custom.js — Música de fondo y navegación auxiliar
 * Fuente ÚNICA de control de audio para todo el juego.
 */
(function () {
  'use strict';

  const audio = document.getElementById('bgm');
  const toggle = document.getElementById('bgmToggle');
  const startBtn = document.getElementById('startBtn');

  /* ── Playlist ── */
  const playlist = [
    'assets/music/Glitch_in_the_Shadows.mp3',
    'assets/music/Glitch.mp3'
  ];
  let trackIndex = 0;
  let started = false;
  let muted = false;

  function setTrack(i) {
    trackIndex = ((i % playlist.length) + playlist.length) % playlist.length;
    if (audio) audio.src = playlist[trackIndex];
  }

  function safePlay() {
    if (!audio) return;
    audio.volume = muted ? 0 : 0.4;
    audio.play().catch(function () { /* el navegador bloquea autoplay sin gesto */ });
  }

  function startPlayback() {
    if (started) return;
    started = true;
    setTrack(0);
    safePlay();
  }

  /* Iniciar música con el primer gesto del usuario */
  document.addEventListener('click', startPlayback, { once: true });
  if (startBtn) startBtn.addEventListener('click', startPlayback, { once: true });

  /* Siguiente pista si la actual falla */
  if (audio) {
    audio.addEventListener('error', function () {
      setTrack(trackIndex + 1);
      safePlay();
    });
  }

  /* Toggle mute */
  if (toggle) {
    toggle.addEventListener('click', function () {
      muted = !muted;
      if (audio) audio.volume = muted ? 0 : 0.4;
      toggle.textContent = muted ? '🔇 Música' : '🔈 Música';
    });
  }

  /* ── Ducking (usado por game_script.js si se necesita) ── */
  function duckBGM(ms, down, up) {
    if (!audio) return;
    ms = ms || 1200;
    down = down || 0.08;
    up = up || 0.4;
    audio.volume = down;
    setTimeout(function () { audio.volume = muted ? 0 : up; }, ms);
  }
  window.__duckBGM = duckBGM;
})();