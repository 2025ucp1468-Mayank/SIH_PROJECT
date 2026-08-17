/**
 * AyurSutra Cinematic Ayurvedic Medicine-Making Entrance Animation
 * Storyboard:
 * 0.0 - 1.0s: Ambient sanctuary lighting & wooden mortar emerges
 * 1.0 - 2.5s: Natural herbs (Tulsi, Neem, Turmeric, Roots) tumble into mortar with parallax
 * 2.5 - 4.5s: Traditional pestle enters and grinds herbs with rhythmic strokes & impact dust
 * 4.5 - 5.5s: Herbs break down and transform into fine golden-green powder (Churna)
 * 5.5 - 6.5s: Luminous herbal vapor & prana mist rise from the mortar
 * 6.5 - 7.5s: Particles coalesce into "AYURSUTRA" & "Ancient Wisdom. Modern Wellness."
 * 7.5 - 8.2s: Smooth cinematic dissolve into the existing homepage
 */

class AyurIntroCinematic {
  constructor(options = {}) {
    this.overlay = document.getElementById('ayur-intro-overlay');
    this.canvas = document.getElementById('ayur-intro-canvas');
    this.skipBtn = document.getElementById('ayur-intro-skip');
    if (!this.overlay || !this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.startTime = null;
    this.elapsedTime = 0;
    this.duration = 8.0; // total cinematic seconds
    this.isComplete = false;
    this.animFrameId = null;

    // Interactive mouse parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // Prefers reduced motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Audio integration (if available)
    this.hasPlayedPestleChime = false;
    this.hasPlayedLogoChime = false;

    // Particle & Entity systems
    this.herbs = [];
    this.impactDust = [];
    this.vaporParticles = [];
    this.textParticles = [];
    this.powderCompaction = 0; // 0 to 1

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Handle skip intro
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishIntro();
      });
    }

    // Press Escape to skip
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.isComplete) {
        this.finishIntro();
      }
    });

    // Initialize entities
    this.initHerbs();
    this.initTextParticles();

    // Start requestAnimationFrame loop
    this.startTime = performance.now();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / this.width - 0.5) * 2;
    this.targetMouseY = (e.clientY / this.height - 0.5) * 2;
  }

  // Generate authentic Ayurvedic botanical ingredients
  initHerbs() {
    const cx = this.width / 2;
    const cy = this.height * 0.54;

    const herbTypes = [
      { type: 'tulsi', color: '#2d6a4f', accent: '#40916c', size: 28, count: 5 },
      { type: 'neem', color: '#1b4332', accent: '#52b788', size: 34, count: 4 },
      { type: 'turmeric', color: '#e09f3e', accent: '#d4af37', size: 22, count: 3 },
      { type: 'ashwagandha', color: '#8d6e63', accent: '#a1887f', size: 26, count: 3 },
      { type: 'floret', color: '#c5a059', accent: '#dfc07b', size: 18, count: 4 }
    ];

    herbTypes.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const startDist = 260 + Math.random() * 240;
        const targetOffsetRadius = Math.random() * 45;
        const targetOffsetAngle = Math.random() * Math.PI * 2;

        this.herbs.push({
          type: group.type,
          color: group.color,
          accent: group.accent,
          size: group.size * (0.8 + Math.random() * 0.4),
          // Start position in air
          x: cx + Math.cos(angle) * startDist + (Math.random() - 0.5) * 100,
          y: cy - 280 - Math.random() * 200,
          // Target landing spot in mortar
          targetX: cx + Math.cos(targetOffsetAngle) * targetOffsetRadius,
          targetY: cy + 10 + Math.sin(targetOffsetAngle) * (targetOffsetRadius * 0.35),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          wobble: Math.random() * Math.PI,
          wobbleSpeed: 0.03 + Math.random() * 0.03,
          delay: 0.8 + Math.random() * 1.2, // 1.0 - 2.2s
          progress: 0,
          isCrushed: 0 // 0 to 1
        });
      }
    });
  }

  // Pre-calculate target coordinates for text formation "AYURSUTRA"
  initTextParticles() {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1000;
    offscreen.height = 300;
    const octx = offscreen.getContext('2d');

    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    
    // Draw AYURSUTRA title
    octx.font = 'bold 72px "Cinzel", serif';
    octx.fillStyle = '#ffffff';
    octx.fillText('AYURSUTRA', 500, 110);

    // Draw subtitle
    octx.font = '500 22px "Plus Jakarta Sans", sans-serif';
    octx.fillText('Ancient Wisdom. Modern Wellness.', 500, 180);

    const imgData = octx.getImageData(0, 0, 1000, 300);
    const data = imgData.data;
    const step = 6; // sample density

    const cx = this.width / 2;
    const cy = this.height * 0.38;

    for (let y = 0; y < 300; y += step) {
      for (let x = 0; x < 1000; x += step) {
        const index = (y * 1000 + x) * 4;
        if (data[index + 3] > 140) {
          const isSubtitle = y > 140;
          this.textParticles.push({
            tx: cx + (x - 500) * 0.82,
            ty: cy + (y - 150) * 0.82,
            x: cx + (Math.random() - 0.5) * 120,
            y: this.height * 0.56 + Math.random() * 30, // originates from mortar
            color: isSubtitle ? 'rgba(214, 230, 220, ' : (Math.random() > 0.3 ? 'rgba(212, 175, 55, ' : 'rgba(167, 243, 208, '),
            size: isSubtitle ? (1.0 + Math.random() * 1.0) : (1.5 + Math.random() * 2.0),
            speed: 0.03 + Math.random() * 0.04,
            alpha: 0,
            swirlAngle: Math.random() * Math.PI * 2,
            swirlRadius: 15 + Math.random() * 40
          });
        }
      }
    }
  }

  // Trigger impact herbal dust bursts on pestle strikes
  triggerImpactDust(cx, cy, intensity = 1.0) {
    const count = Math.floor(18 * intensity);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5 * intensity;
      this.impactDust.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: cy + (Math.random() - 0.5) * 15,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 1.5 + Math.random() * 3.0,
        color: Math.random() > 0.4 ? '#d4af37' : '#52b788',
        alpha: 0.85,
        decay: 0.02 + Math.random() * 0.03
      });
    }

    // Play subtle wooden impact chime if available
    if (window.AyurSoundscape && typeof window.AyurSoundscape.playSingingBowlChime === 'function') {
      window.AyurSoundscape.playSingingBowlChime(480 + Math.random() * 80, 0.4);
    }
  }

  // Spawn rising organic herbal vapor
  spawnVapor(cx, cy) {
    if (Math.random() > 0.35) return;
    this.vaporParticles.push({
      x: cx + (Math.random() - 0.5) * 70,
      y: cy + (Math.random() - 0.5) * 15,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.8 - Math.random() * 1.4,
      radius: 12 + Math.random() * 24,
      maxRadius: 50 + Math.random() * 40,
      growth: 0.4 + Math.random() * 0.5,
      color: Math.random() > 0.5 ? 'rgba(52, 211, 153, ' : 'rgba(212, 175, 55, ',
      alpha: 0.45,
      decay: 0.005 + Math.random() * 0.005,
      seed: Math.random() * 100
    });
  }

  animate() {
    if (this.isComplete) return;

    this.animFrameId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    this.elapsedTime = (now - this.startTime) / 1000;

    // Smooth mouse parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const t = this.elapsedTime;
    const cx = this.width / 2;
    const cy = this.height * 0.54;

    // 1. Draw Ambient Sanctuary Backdrop (0 - 8s)
    this.drawSanctuaryBackground(t);

    // 2. Draw Wooden Mortar Base & Cavity (0 - 8s)
    const mortarAlpha = Math.min(t / 0.9, 1.0);
    this.drawMortar(cx, cy, mortarAlpha);

    // 3. Falling & Ground Herbs inside Mortar (1.0s - 5.5s)
    this.updateAndDrawHerbs(cx, cy, t);

    // 4. Ground Herbal Powder Accumulation (4.0s - 8s)
    if (t >= 3.0) {
      this.drawHerbalPowder(cx, cy, t);
    }

    // 5. Pestle Entrance & Grinding Motion (2.5s - 5.5s)
    if (t >= 2.2 && t <= 5.8) {
      this.updateAndDrawPestle(cx, cy, t);
    }

    // 6. Impact Dust Particles
    this.updateAndDrawImpactDust();

    // 7. Rising Herbal Vapor (5.2s - 8s)
    if (t >= 5.0) {
      this.updateAndDrawVapor(cx, cy, t);
    }

    // 8. Logo & Motto Particle Formation (6.2s - 8s)
    if (t >= 6.0) {
      this.updateAndDrawLogoText(cx, cy, t);
    }

    // 9. Smooth Transition to Homepage at end
    if (t >= this.duration && !this.isComplete) {
      this.finishIntro();
    }
  }

  // Draw rich sanctuary ambiance with soft volumetric lighting
  drawSanctuaryBackground(t) {
    const pX = this.mouseX * 25;
    const pY = this.mouseY * 20;

    // Deep Vedic botanical sanctuary gradient
    const bgGrad = this.ctx.createRadialGradient(
      this.width / 2 + pX * 0.5,
      this.height * 0.45 + pY * 0.5,
      50,
      this.width / 2,
      this.height / 2,
      Math.max(this.width, this.height) * 0.85
    );
    bgGrad.addColorStop(0, '#0a2e21');
    bgGrad.addColorStop(0.35, '#052117');
    bgGrad.addColorStop(0.75, '#03140e');
    bgGrad.addColorStop(1, '#010906');

    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Soft warm golden light cone from top
    const lightGrad = this.ctx.createRadialGradient(
      this.width / 2 + pX,
      this.height * 0.2 + pY,
      10,
      this.width / 2 + pX,
      this.height * 0.45 + pY,
      320
    );
    lightGrad.addColorStop(0, 'rgba(212, 175, 55, 0.14)');
    lightGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.06)');
    lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = lightGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Draw traditional carved wooden mortar (Khalva Yantra) with depth
  drawMortar(cx, cy, alpha) {
    if (alpha <= 0) return;

    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    const pX = this.mouseX * 12;
    const pY = this.mouseY * 8;
    const mX = cx + pX;
    const mY = cy + pY;

    // Mortar Drop Shadow
    const shadowGrad = this.ctx.createRadialGradient(mX, mY + 65, 10, mX, mY + 65, 140);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = shadowGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(mX, mY + 65, 140, 32, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Outer Mortar Body (Polished teak / rosewood)
    const bodyGrad = this.ctx.createLinearGradient(mX - 110, mY - 20, mX + 110, mY + 60);
    bodyGrad.addColorStop(0, '#5a3d28');
    bodyGrad.addColorStop(0.3, '#3e2718');
    bodyGrad.addColorStop(0.7, '#2a1a0f');
    bodyGrad.addColorStop(1, '#1d1108');

    this.ctx.fillStyle = bodyGrad;
    this.ctx.beginPath();
    // Smooth traditional bowl curve
    this.ctx.moveTo(mX - 100, mY);
    this.ctx.bezierCurveTo(mX - 110, mY + 45, mX - 60, mY + 62, mX - 45, mY + 62);
    this.ctx.lineTo(mX + 45, mY + 62);
    this.ctx.bezierCurveTo(mX + 60, mY + 62, mX + 110, mY + 45, mX + 100, mY);
    this.ctx.closePath();
    this.ctx.fill();

    // Traditional Brass Ring Ornamentation around Mortar
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    this.ctx.lineWidth = 2.0;
    this.ctx.beginPath();
    this.ctx.ellipse(mX, mY + 32, 75, 12, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    // Mortar Rim Top (Wood thickness)
    const rimGrad = this.ctx.createLinearGradient(mX - 100, mY - 10, mX + 100, mY + 10);
    rimGrad.addColorStop(0, '#6d4c33');
    rimGrad.addColorStop(0.5, '#8d6343');
    rimGrad.addColorStop(1, '#4e3321');

    this.ctx.fillStyle = rimGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(mX, mY, 100, 26, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Mortar Inner Bowl Cavity (Deep hollow where herbs sit)
    const innerGrad = this.ctx.createRadialGradient(mX, mY + 6, 8, mX, mY + 6, 85);
    innerGrad.addColorStop(0, '#150d07');
    innerGrad.addColorStop(0.65, '#22150d');
    innerGrad.addColorStop(1, '#3a2315');

    this.ctx.fillStyle = innerGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(mX, mY + 4, 88, 20, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  // Update and draw falling/tumbling leaves and herbal slices
  updateAndDrawHerbs(cx, cy, t) {
    const pX = this.mouseX * 15;
    const pY = this.mouseY * 10;

    this.herbs.forEach((h) => {
      // Herb fall timing (1.0s to 2.5s)
      if (t < h.delay) return;

      const progress = Math.min((t - h.delay) / 1.1, 1.0);
      // Smooth natural cubic easing with bounce
      const ease = 1 - Math.pow(1 - progress, 3);

      const currentX = h.x + (h.targetX - h.x) * ease + pX * (1 - ease * 0.3);
      const currentY = h.y + (h.targetY - h.y) * ease + pY * (1 - ease * 0.3);
      const currentRot = h.rotation + Math.sin(t * 3 + h.wobble) * 0.3;

      // When grinding starts (2.8s - 4.8s), herbs crush down
      if (t >= 2.8) {
        h.isCrushed = Math.min((t - 2.8) / 1.8, 1.0);
      }

      this.ctx.save();
      this.ctx.translate(currentX, currentY);
      this.ctx.rotate(currentRot);

      // Crushed herbs shrink and flatten
      const scale = (1 - h.isCrushed * 0.75);
      this.ctx.scale(scale, scale * (1 - h.isCrushed * 0.35));
      this.ctx.globalAlpha = Math.max(0.08, 1 - h.isCrushed * 0.9);

      // Draw specialized botanical geometry
      if (h.type === 'tulsi') {
        this.drawTulsiLeaf(h.color, h.accent, h.size);
      } else if (h.type === 'neem') {
        this.drawNeemLeaf(h.color, h.accent, h.size);
      } else if (h.type === 'turmeric') {
        this.drawTurmericSlice(h.color, h.accent, h.size);
      } else {
        this.drawHerbalRoot(h.color, h.accent, h.size);
      }

      this.ctx.restore();
    });
  }

  // Draw authentic Tulsi (Holy Basil) leaf with central vein
  drawTulsiLeaf(color, accent, size) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = accent;
    this.ctx.lineWidth = 1.2;

    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.bezierCurveTo(size * 0.55, -size * 0.6, size * 0.55, size * 0.5, 0, size);
    this.ctx.bezierCurveTo(-size * 0.55, size * 0.5, -size * 0.55, -size * 0.6, 0, -size);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Central vein
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size * 0.85);
    this.ctx.lineTo(0, size * 0.85);
    this.ctx.stroke();
  }

  // Draw slender serrated Neem leaf
  drawNeemLeaf(color, accent, size) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = accent;
    this.ctx.lineWidth = 1.0;

    this.ctx.beginPath();
    this.ctx.moveTo(0, -size * 1.2);
    this.ctx.bezierCurveTo(size * 0.4, -size * 0.4, size * 0.35, size * 0.6, 0, size);
    this.ctx.bezierCurveTo(-size * 0.35, size * 0.6, -size * 0.4, -size * 0.4, 0, -size * 1.2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  // Draw Golden Turmeric (Haridra) rhizome cross-section
  drawTurmericSlice(color, accent, size) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = accent;
    this.ctx.lineWidth = 1.8;

    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.8, size * 0.55, 0.2, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Concentric growth rings
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.45, size * 0.3, 0.2, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  // Draw woody Ayurvedic herbal root (Ashwagandha / Shatavari)
  drawHerbalRoot(color, accent, size) {
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = accent;
    this.ctx.lineWidth = 1.2;

    this.ctx.beginPath();
    this.ctx.moveTo(-size * 0.6, -size * 0.2);
    this.ctx.lineTo(size * 0.6, -size * 0.35);
    this.ctx.lineTo(size * 0.5, size * 0.3);
    this.ctx.lineTo(-size * 0.55, size * 0.25);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  // Draw traditional wooden pestle executing 3-4 smooth grinding orbits & taps
  updateAndDrawPestle(cx, cy, t) {
    const pX = this.mouseX * 14;
    const pY = this.mouseY * 9;
    const mX = cx + pX;
    const mY = cy + pY;

    // Pestle timing:
    // 2.2 - 2.8s: enters from above
    // 2.8 - 4.8s: 4 grinding orbits with rhythmic impact taps
    // 4.8 - 5.5s: lifts gracefully back up
    let pestleX = mX;
    let pestleY = mY - 140;
    let pestleAngle = -0.18;
    let pestleAlpha = 1.0;

    if (t < 2.8) {
      // Entering from above
      const progress = (t - 2.2) / 0.6;
      const ease = Math.sin((progress * Math.PI) / 2);
      pestleY = (mY - 260) + (140) * ease;
      pestleAlpha = Math.min(progress * 1.5, 1.0);
    } else if (t >= 2.8 && t <= 4.8) {
      // Active grinding cycle (4 orbits)
      const grindT = (t - 2.8) * 4.2; // angular speed
      const radiusX = 28;
      const radiusY = 10;

      pestleX = mX + Math.cos(grindT) * radiusX;
      pestleY = mY - 5 + Math.sin(grindT) * radiusY;
      pestleAngle = -0.15 + Math.sin(grindT) * 0.22;

      // Spawn impact dust bursts at bottom of stroke
      if (Math.sin(grindT) > 0.85 && Math.random() > 0.45) {
        this.triggerImpactDust(pestleX, pestleY + 12, 1.2);
      }
    } else if (t > 4.8) {
      // Lifting back up
      const progress = (t - 4.8) / 0.7;
      pestleY = (mY - 5) - (220) * progress;
      pestleAlpha = Math.max(0, 1 - progress);
      pestleAngle = -0.15 + progress * 0.2;
    }

    if (pestleAlpha <= 0) return;

    this.ctx.save();
    this.ctx.globalAlpha = pestleAlpha;
    this.ctx.translate(pestleX, pestleY);
    this.ctx.rotate(pestleAngle);

    // Pestle Body Shadow
    const shadowGrad = this.ctx.createLinearGradient(0, 0, 24, 0);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = shadowGrad;

    // Wooden Pestle Handle & Head
    const woodGrad = this.ctx.createLinearGradient(-18, 0, 18, 0);
    woodGrad.addColorStop(0, '#5a3821');
    woodGrad.addColorStop(0.35, '#8c5934');
    woodGrad.addColorStop(0.65, '#a46d43');
    woodGrad.addColorStop(1, '#432815');

    this.ctx.fillStyle = woodGrad;

    // Pestle shape (bulbous rounded grinding head + slender ergonomic handle)
    this.ctx.beginPath();
    this.ctx.moveTo(-12, -180); // top tip
    this.ctx.lineTo(12, -180);
    this.ctx.bezierCurveTo(14, -80, 24, -20, 22, 10);
    this.ctx.bezierCurveTo(20, 28, -20, 28, -22, 10);
    this.ctx.bezierCurveTo(-24, -20, -14, -80, -12, -180);
    this.ctx.closePath();
    this.ctx.fill();

    // Polished Brass Grip Band on Pestle
    const brassGrad = this.ctx.createLinearGradient(-14, 0, 14, 0);
    brassGrad.addColorStop(0, '#997316');
    brassGrad.addColorStop(0.5, '#f5d76e');
    brassGrad.addColorStop(1, '#785507');

    this.ctx.fillStyle = brassGrad;
    this.ctx.fillRect(-14, -100, 28, 12);
    this.ctx.fillRect(-16, -10, 32, 8);

    this.ctx.restore();
  }

  // Draw accumulating fine golden-green Ayurvedic Churna (Powder)
  drawHerbalPowder(cx, cy, t) {
    const pX = this.mouseX * 12;
    const pY = this.mouseY * 8;
    const mX = cx + pX;
    const mY = cy + pY;

    const progress = Math.min((t - 3.0) / 2.0, 1.0); // 3.0s to 5.0s
    this.powderCompaction = progress;

    if (progress <= 0) return;

    this.ctx.save();
    this.ctx.globalAlpha = progress * 0.95;

    // Rich textured golden-emerald herbal mound
    const powderGrad = this.ctx.createRadialGradient(mX, mY + 6, 5, mX, mY + 6, 75);
    powderGrad.addColorStop(0, '#d4af37'); // glowing golden core
    powderGrad.addColorStop(0.4, '#84a98c'); // sage green
    powderGrad.addColorStop(0.75, '#52796f'); // rich herbal tone
    powderGrad.addColorStop(1, '#2f3e46');

    this.ctx.fillStyle = powderGrad;
    this.ctx.beginPath();
    this.ctx.ellipse(mX, mY + 6, 78 * progress, 18 * progress, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle fine powder texture granules
    const granuleCount = Math.floor(40 * progress);
    this.ctx.fillStyle = 'rgba(245, 215, 110, 0.7)';
    for (let i = 0; i < granuleCount; i++) {
      const angle = (i * 137.5 * Math.PI) / 180;
      const r = Math.sqrt(i / granuleCount) * (65 * progress);
      const gx = mX + Math.cos(angle) * r;
      const gy = mY + 6 + Math.sin(angle) * (r * 0.24);
      this.ctx.fillRect(gx, gy, 1.5, 1.5);
    }

    this.ctx.restore();
  }

  // Update & draw dynamic impact dust from pestle strikes
  updateAndDrawImpactDust() {
    for (let i = this.impactDust.length - 1; i >= 0; i--) {
      const p = this.impactDust[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.impactDust.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;
  }

  // Update & draw organic green-and-golden aromatic herbal vapor
  updateAndDrawVapor(cx, cy, t) {
    const pX = this.mouseX * 12;
    const pY = this.mouseY * 8;

    this.spawnVapor(cx + pX, cy + pY);

    for (let i = this.vaporParticles.length - 1; i >= 0; i--) {
      const v = this.vaporParticles[i];
      v.x += v.vx + Math.sin(t * 2 + v.seed) * 0.4;
      v.y += v.vy;
      v.radius = Math.min(v.radius + v.growth, v.maxRadius);
      v.alpha -= v.decay;

      if (v.alpha <= 0) {
        this.vaporParticles.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, v.radius);
      grad.addColorStop(0, `${v.color}${v.alpha})`);
      grad.addColorStop(0.5, `${v.color}${v.alpha * 0.4})`);
      grad.addColorStop(1, `${v.color}0)`);

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(v.x, v.y, v.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Particle Swirl and Reveal for "AYURSUTRA" & "Ancient Wisdom. Modern Wellness."
  updateAndDrawLogoText(cx, cy, t) {
    // 6.2s - 7.5s
    const textProgress = Math.min((t - 6.2) / 1.2, 1.0);
    const ease = 1 - Math.pow(1 - textProgress, 3);

    // Play singing bowl chime when logo starts forming
    if (!this.hasPlayedLogoChime && window.AyurSoundscape && typeof window.AyurSoundscape.playSingingBowlChime === 'function') {
      window.AyurSoundscape.playSingingBowlChime(528, 3.5);
      this.hasPlayedLogoChime = true;
    }

    const pX = this.mouseX * 8;
    const pY = this.mouseY * 6;

    // Draw text particles moving into position
    this.textParticles.forEach((tp) => {
      // Swirling trajectory towards target letter position
      const currentX = tp.x + (tp.tx - tp.x) * ease + Math.cos(tp.swirlAngle + t * 4) * tp.swirlRadius * (1 - ease) + pX;
      const currentY = tp.y + (tp.ty - tp.y) * ease + Math.sin(tp.swirlAngle + t * 4) * (tp.swirlRadius * 0.4) * (1 - ease) + pY;
      const alpha = Math.min(ease * 1.3, 1.0);

      this.ctx.fillStyle = `${tp.color}${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, tp.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // When fully formed (>7.0s), render clean crisp golden text typography with gentle shimmer
    if (textProgress > 0.8) {
      const textAlpha = (textProgress - 0.8) / 0.2;
      this.ctx.save();
      this.ctx.globalAlpha = textAlpha;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      const textY = this.height * 0.38 + pY;

      // Golden radiance glow
      this.ctx.shadowColor = 'rgba(212, 175, 55, 0.75)';
      this.ctx.shadowBlur = 18;

      // AYURSUTRA title
      this.ctx.font = 'bold 58px "Cinzel", serif';
      const goldGrad = this.ctx.createLinearGradient(cx - 200, textY - 30, cx + 200, textY + 30);
      goldGrad.addColorStop(0, '#fff7d6');
      goldGrad.addColorStop(0.5, '#d4af37');
      goldGrad.addColorStop(1, '#aa8210');

      this.ctx.fillStyle = goldGrad;
      this.ctx.fillText('AYURSUTRA', cx + pX, textY - 24);

      // Subtitle
      this.ctx.shadowBlur = 8;
      this.ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
      this.ctx.fillStyle = '#a7f3d0';
      this.ctx.fillText('Ancient Wisdom. Modern Wellness.', cx + pX, textY + 32);

      this.ctx.restore();
    }
  }

  // Seamless transition back to the existing homepage
  finishIntro() {
    if (this.isComplete) return;
    this.isComplete = true;

    // Save session flag
    sessionStorage.setItem('ayursutra_intro_seen', 'true');

    if (this.overlay) {
      this.overlay.classList.add('fade-out');
      setTimeout(() => {
        this.overlay.style.display = 'none';
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
        }
      }, 700);
    }
  }
}

window.AyurIntroCinematic = AyurIntroCinematic;

document.addEventListener('DOMContentLoaded', () => {
  new AyurIntroCinematic();
});
