/**
 * UI Controller for Chakravyuh 3D (Netflix Kurukshetra Reference)
 * - Drives the 13-stage cinematic text fade-in/out over the 100% 3D WebGL viewport
 * - Updates thin top progress bar, ring tracker dots, and "Scroll to begin" hint
 * - Powers Story / Warriors / IKS Notes modal
 */

import { gsap } from 'gsap';
import { CONFIG } from './config.js';
import { STAGES } from './timeline.js';

const MODAL_CONTENT = {
  story: `
    <h2>The Thirteenth Day · Kurukshetra</h2>
    <p>
      Acharya Drona and Jayadratha conspired to lure Arjuna and Krishna away while opening
      a "gateway to hell"—a seven-ringed spiral of tower shields, war elephants, and steel.
    </p>
    <p>
      Sixteen-year-old <strong>Abhimanyu</strong> charged into the corridor on his golden
      chariot, only for Jayadratha’s shield-bearers to march shut behind him, trapping
      Bheem and the Pandavas outside. Alone at the centre, Abhimanyu defeated Duryodhana’s
      son Lakshman and fought eight Maharathis until Drona’s energy strike shattered his chariot.
    </p>
  `,
  warriors: `
    <h2>The Eight Maharathis at the Centre</h2>
    <p>Surrounding Abhimanyu in the Kurukshetra dust:</p>
    <div class="modal-char-grid">
      ${CONFIG.maharathis
        .map((w) => {
          const hex = '#' + w.color.toString(16).padStart(6, '0');
          return `
          <div class="modal-char-card" style="border-left: 3px solid ${hex}; padding: 12px;">
            <div class="modal-char-name">${w.name}</div>
            <div class="modal-char-role">${w.role}</div>
          </div>
        `;
        })
        .join('')}
    </div>
  `,
  iks: `
    <h2>Indian Knowledge Systems (IKS) Notes</h2>
    <p>
      <strong>Vyuha-Shastra (Spiral Shield Phalanx):</strong> The Chakravyuh combined
      interlocking tower shields (<em>dhaal</em>), war elephants, cavalry, and chariots
      into counter-rotating concentric rings that sealed behind an intruder.
    </p>
    <p>
      <strong>Dharma-Yuddha:</strong> Single combat rules were broken when multiple Maharathis
      attacked Abhimanyu simultaneously after his bow and chariot were destroyed.
    </p>
    <p>
      <em>Seven-ring layout and warrior placement are artistic interpretation of the Drona Parva.</em>
    </p>
  `
};

export function createUI() {
  const progressBarFill = document.getElementById('progress-bar-fill');
  const scrollHint = document.getElementById('scroll-hint');
  const eyebrowEl = document.getElementById('stage-eyebrow');
  const headingEl = document.getElementById('stage-heading');
  const hindiEl = document.getElementById('stage-hindi');
  const captionEl = document.getElementById('stage-caption');
  const quoteEl = document.getElementById('stage-quote');
  const stageFrameEl = document.getElementById('stage-frame');
  const ringDots = document.querySelectorAll('#ring-tracker .ring-dot');
  const loadingScreen = document.getElementById('loading-screen');
  const loaderBarFill = document.getElementById('loader-bar-fill');

  // Background Music (Hai Katha Sangram Ki)
  const audioEl = document.getElementById('bgm-audio');
  const audioToggle = document.getElementById('audio-toggle');
  let isPlaying = false;
  let userMuted = false;

  // Shloka Vocal Narration Engine
  const shlokaToggle = document.getElementById('shloka-toggle');
  const replayShlokaBtn = document.getElementById('replay-shloka-btn');
  const quoteContainer = document.getElementById('stage-quote-container');
  let shlokaEnabled = true;
  let currentShlokaAudio = null;
  let shlokaPendingId = null;

  function duckBgm(duck) {
    if (!audioEl || !isPlaying) return;
    gsap.killTweensOf(audioEl);
    gsap.to(audioEl, {
      volume: duck ? 0.16 : 0.45,
      duration: duck ? 0.4 : 0.8,
      ease: 'power2.out'
    });
  }

  function stopCurrentShloka() {
    if (currentShlokaAudio) {
      try {
        currentShlokaAudio.pause();
        currentShlokaAudio.currentTime = 0;
      } catch (_) {}
      currentShlokaAudio.onended = null;
      currentShlokaAudio.onerror = null;
      currentShlokaAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (quoteContainer) quoteContainer.classList.remove('is-chanting');
    duckBgm(false);
  }

  function speakShlokaFallback(stageId) {
    if (!('speechSynthesis' in window) || !shlokaEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const stage = STAGES.find((s) => s.id === stageId);
      if (!stage || !stage.quote) return;

      const shlokaMatch = stage.quote.match(/“([^”]+)”/);
      const textToSpeak = shlokaMatch ? shlokaMatch[1] : stage.quote;

      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.rate = 0.85;
      utter.pitch = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(
        (v) =>
          v.lang.startsWith('hi') ||
          v.lang.startsWith('sa') ||
          v.name.includes('Lekha') ||
          v.name.includes('Rishi')
      );
      if (hiVoice) utter.voice = hiVoice;

      utter.onstart = () => {
        if (quoteContainer) quoteContainer.classList.add('is-chanting');
        duckBgm(true);
      };
      utter.onend = () => {
        if (quoteContainer) quoteContainer.classList.remove('is-chanting');
        duckBgm(false);
      };
      window.speechSynthesis.speak(utter);
    } catch (_) {}
  }

  function playShlokaForStage(stageId) {
    if (!shlokaEnabled) {
      stopCurrentShloka();
      return;
    }
    stopCurrentShloka();

    const audio = new Audio(`./audio/shlokas/stage_${stageId}.mp3`);
    currentShlokaAudio = audio;
    audio.volume = 0.95;

    audio.onplay = () => {
      if (quoteContainer) quoteContainer.classList.add('is-chanting');
      duckBgm(true);
    };

    audio.onended = () => {
      if (quoteContainer) quoteContainer.classList.remove('is-chanting');
      duckBgm(false);
      currentShlokaAudio = null;
    };

    audio.onerror = () => {
      speakShlokaFallback(stageId);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        shlokaPendingId = stageId;
      });
    }
  }

  function setAudioState(playing) {
    isPlaying = playing;
    if (audioToggle) {
      audioToggle.classList.toggle('is-playing', playing);
      audioToggle.setAttribute('aria-pressed', String(playing));
      audioToggle.textContent = playing ? '♪ Playing' : '♪ Music';
    }
  }

  function tryStartAudio() {
    if (!audioEl || isPlaying || userMuted) return;
    audioEl.volume = 0.45;
    audioEl
      .play()
      .then(() => setAudioState(true))
      .catch(() => {
        // Browser blocked autoplay before user gesture; will retry on next interaction
      });
  }

  if (audioToggle && audioEl) {
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        audioEl.pause();
        userMuted = true;
        setAudioState(false);
      } else {
        userMuted = false;
        audioEl.volume = 0.45;
        audioEl.play().then(() => setAudioState(true)).catch(() => {});
      }
    });
  }

  if (shlokaToggle) {
    shlokaToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      shlokaEnabled = !shlokaEnabled;
      shlokaToggle.classList.toggle('is-active', shlokaEnabled);
      shlokaToggle.classList.toggle('is-muted', !shlokaEnabled);
      shlokaToggle.setAttribute('aria-pressed', String(shlokaEnabled));
      shlokaToggle.textContent = shlokaEnabled ? 'ॐ Shlokas' : 'ॐ Muted';
      if (!shlokaEnabled) {
        stopCurrentShloka();
      } else if (activeStageId > 0) {
        playShlokaForStage(activeStageId);
      }
    });
  }

  if (replayShlokaBtn) {
    replayShlokaBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeStageId > 0) {
        shlokaEnabled = true;
        if (shlokaToggle) {
          shlokaToggle.classList.add('is-active');
          shlokaToggle.classList.remove('is-muted');
          shlokaToggle.textContent = 'ॐ Shlokas';
        }
        playShlokaForStage(activeStageId);
      }
    });
  }

  // Auto-start theme music & queued shloka on first interaction
  function handleFirstInteraction() {
    tryStartAudio();
    if (shlokaPendingId !== null) {
      const pid = shlokaPendingId;
      shlokaPendingId = null;
      playShlokaForStage(pid);
    }
  }

  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((evt) => {
    window.addEventListener(evt, handleFirstInteraction, { once: true, passive: true });
  });

  // Keep 100% pure 3D canvas unobstructed
  if (stageFrameEl) {
    stageFrameEl.style.display = 'none';
  }

  const modal = document.getElementById('info-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = modal?.querySelector('.info-modal-backdrop');
  const navButtons = document.querySelectorAll('.nav-btn');

  let activeStageId = -1;

  function openModal(key) {
    if (!modal || !modalContent || !MODAL_CONTENT[key]) return;
    modalContent.innerHTML = MODAL_CONTENT[key];
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  navButtons.forEach((btn) => btn.addEventListener('click', () => openModal(btn.dataset.modal)));
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function showStage(stage) {
    if (!stage || stage.id === activeStageId) return;
    activeStageId = stage.id;

    // Trigger vocal narration for this frame's shloka
    playShlokaForStage(stage.id);

    const animTargets = [eyebrowEl, headingEl, hindiEl, captionEl, quoteEl, quoteContainer].filter(Boolean);
    gsap.killTweensOf(animTargets);
    gsap.to(animTargets, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        eyebrowEl.textContent = stage.eyebrow;
        headingEl.textContent = stage.heading;
        if (hindiEl) hindiEl.textContent = stage.hindi || '';
        captionEl.textContent = stage.caption;
        if (quoteEl) quoteEl.textContent = stage.quote || '';

        gsap.fromTo(eyebrowEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
        gsap.fromTo(headingEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.04, ease: 'power3.out' });
        if (hindiEl) {
          gsap.fromTo(hindiEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.08, ease: 'power3.out' });
        }
        gsap.fromTo(captionEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.12, ease: 'power3.out' });
        if (quoteContainer) {
          gsap.fromTo(quoteContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.16, ease: 'power3.out' });
        }
        if (quoteEl) {
          gsap.fromTo(quoteEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.16, ease: 'power3.out' });
        }
      }
    });
  }

  showStage(STAGES[0]);

  return {
    setLoadProgress: (pct) => {
      if (loaderBarFill) {
        loaderBarFill.style.width = `${Math.min(100, Math.max(0, pct))}%`;
      }
    },

    hideLoader: () => {
      if (loaderBarFill) loaderBarFill.style.width = '100%';
      setTimeout(() => {
        loadingScreen?.classList.add('is-hidden');
      }, 260);
    },

    update: (progress) => {
      if (progressBarFill) {
        progressBarFill.style.width = `${(progress * 100).toFixed(2)}%`;
      }

      if (scrollHint) {
        scrollHint.classList.toggle('is-hidden', progress > 0.015);
      }

      const currentRing = progress < 0.16
        ? 0
        : Math.min(7, Math.floor(((progress - 0.16) / 0.55) * 7) + 1);

      ringDots.forEach((dot, idx) => {
        const ringNum = idx + 1;
        dot.classList.toggle('is-active', ringNum === currentRing);
        dot.classList.toggle('is-passed', ringNum < currentRing);
      });

      const stage = STAGES.find((s) => progress >= s.start && progress <= s.end) || STAGES[STAGES.length - 1];
      showStage(stage);
    }
  };
}

export default { createUI };
