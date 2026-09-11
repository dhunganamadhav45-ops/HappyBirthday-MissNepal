/* ==========================================================================
   ASMI DIGITAL BIRTHDAY CARD - JAVASCRIPT ENGINE
   Flowers & Love Sign Particles, Interactive Click Burst, Lightbox, & Audio Synth
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Envelope & Entrance Reveal
     -------------------------------------------------------------------------- */
  const openCardBtn = document.getElementById('openCardBtn');
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const mainApp = document.getElementById('mainApp');
  const bgAudio = document.getElementById('bgAudio');

  openCardBtn.addEventListener('click', () => {
    envelopeOverlay.classList.add('fade-out');

    // Start real audio on user gesture (satisfies browser autoplay policy)
    if (bgAudio) {
      bgAudio.volume = 0.75;
      bgAudio.play().then(() => {
        equalizerIcon.classList.add('playing');
        audioLabel.textContent = 'Pause Music';
      }).catch(() => {
        // Autoplay blocked silently – user can still press the button
      });
    }

    setTimeout(() => {
      mainApp.classList.remove('hidden-content');
      initScrollObserver();
    }, 400);
  });

  /* --------------------------------------------------------------------------
     2. Canvas Floating Flowers & Love Sign Particle System
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Floating Flower Petal Class
  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -20 - Math.random() * 50;
      this.size = Math.random() * 9 + 6;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.55 + 0.35;
      this.color = Math.random() > 0.4 ? 'rgba(244, 114, 182, ' : 'rgba(251, 113, 133, ';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size, 0, 0);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
      ctx.restore();
    }
  }

  // Floating Love Sign Heart Class
  class FloatingLoveSign {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 14 + 10;
      this.speedY = Math.random() * 1.2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.symbol = ['💖', '🌸', '💕', '✨', '🌺'][Math.floor(Math.random() * 5)];
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.font = `${this.size}px sans-serif`;
      ctx.globalAlpha = this.opacity;
      ctx.fillText(this.symbol, this.x, this.y);
      ctx.restore();
    }
  }

  const petals = Array.from({ length: 35 }, () => new Petal());
  const loveSigns = Array.from({ length: 25 }, () => new FloatingLoveSign());

  // Interactive Touch/Click Burst Particles
  const clickBurstParticles = [];

  class ClickBurstParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.symbol = ['💖', '🌸', '💕', '✨'][Math.floor(Math.random() * 4)];
      this.size = Math.random() * 18 + 14;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4 - 2;
      this.opacity = 1;
      this.life = 60;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      this.opacity -= 1 / this.life;
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.font = `${this.size}px sans-serif`;
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillText(this.symbol, this.x, this.y);
      ctx.restore();
    }
  }

  window.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      clickBurstParticles.push(new ClickBurstParticle(e.clientX, e.clientY));
    }
  });

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    loveSigns.forEach(sign => {
      sign.update();
      sign.draw();
    });

    petals.forEach(petal => {
      petal.update();
      petal.draw();
    });

    for (let i = clickBurstParticles.length - 1; i >= 0; i--) {
      const p = clickBurstParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0) {
        clickBurstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  /* --------------------------------------------------------------------------
     3. Real Audio Playback – Donald Av 2.m4a (Autoplay & Loop)
     -------------------------------------------------------------------------- */
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const equalizerIcon = document.getElementById('equalizerIcon');
  const audioLabel = document.getElementById('audioLabel');

  // Toggle play / pause on the real audio element
  audioToggleBtn.addEventListener('click', () => {
    if (!bgAudio) return;

    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        equalizerIcon.classList.add('playing');
        audioLabel.textContent = 'Pause Music';
      }).catch(err => console.warn('Audio play failed:', err));
    } else {
      bgAudio.pause();
      equalizerIcon.classList.remove('playing');
      audioLabel.textContent = 'Play Music 🎵';
    }
  });

  // Sync button state whenever audio starts/stops for any reason
  if (bgAudio) {
    bgAudio.addEventListener('play', () => {
      equalizerIcon.classList.add('playing');
      audioLabel.textContent = 'Pause Music';
    });
    bgAudio.addEventListener('pause', () => {
      equalizerIcon.classList.remove('playing');
      audioLabel.textContent = 'Play Music 🎵';
    });
  }

  /* --------------------------------------------------------------------------
     4. Photo Gallery Lightbox Interactivity
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      const fullSrc = item.getAttribute('data-fullsrc') || (imgEl ? imgEl.src : '');
      const caption = item.getAttribute('data-caption') || '';
      
      lightboxImage.src = fullSrc;
      lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
    });
  });

  function closeLightboxModal() {
    lightboxModal.classList.remove('active');
  }

  if (closeLightbox) closeLightbox.addEventListener('click', closeLightboxModal);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightboxModal();
    });
  }

  /* --------------------------------------------------------------------------
     5. Scroll Reveal Intersection Observer
     -------------------------------------------------------------------------- */
  function initScrollObserver() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  /* --------------------------------------------------------------------------
     6. Interactive Exam Modal
     -------------------------------------------------------------------------- */
  const examWishBtn = document.getElementById('examWishBtn');
  const examModal = document.getElementById('examModal');
  const closeExamModal = document.getElementById('closeExamModal');
  const modalOkBtn = document.getElementById('modalOkBtn');

  function openExamModal() {
    examModal.classList.add('active');
  }

  function closeExamModalFunc() {
    examModal.classList.remove('active');
  }

  if (examWishBtn) examWishBtn.addEventListener('click', openExamModal);
  if (closeExamModal) closeExamModal.addEventListener('click', closeExamModalFunc);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeExamModalFunc);

  if (examModal) {
    examModal.addEventListener('click', (e) => {
      if (e.target === examModal) closeExamModalFunc();
    });
  }
});
