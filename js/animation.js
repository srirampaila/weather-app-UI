/**
 * AuraWeather - Background Animation System
 * Uses HTML5 Canvas and CSS animations to create premium dynamic backgrounds
 */

class WeatherAnimationSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.particles = [];
    this.condition = '';
    this.isNight = false;
    this.width = 0;
    this.height = 0;
    this.flashActive = false;
    this.flashIntensity = 0;
    this.colors = {
      sunny: { bg: ['#0f2e5c', '#1b4d8f', '#2a75d3'], glow: '#f59e0b' },
      cloudy: { bg: ['#0c1524', '#15243a', '#223854'], glow: '#7c8fa6' },
      rain: { bg: ['#050b14', '#0d1828', '#16283e'], glow: '#5b8def' },
      thunderstorm: { bg: ['#03060c', '#09101c', '#0f1b2d'], glow: '#7c5cfc' },
      snow: { bg: ['#080f1d', '#14223c', '#253d66'], glow: '#ffffff' },
      night: { bg: ['#02060c', '#050c18', '#0b162c'], glow: '#3b82f6' }
    };

    // Bind methods
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
  }

  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.initParticles();
  }

  /**
   * Main entry point to switch weather background themes
   * @param {string} rawCondition - OWM main condition (e.g. Clear, Clouds, Rain, Drizzle, Thunderstorm, Snow)
   * @param {boolean} isNight 
   */
  setTheme(rawCondition, isNight) {
    let targetCondition = 'sunny';
    this.isNight = isNight;

    if (isNight) {
      targetCondition = 'night';
    } else {
      const cond = rawCondition.toLowerCase();
      if (cond.includes('clear')) targetCondition = 'sunny';
      else if (cond.includes('cloud')) targetCondition = 'cloudy';
      else if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('mist')) targetCondition = 'rain';
      else if (cond.includes('thunder')) targetCondition = 'thunderstorm';
      else if (cond.includes('snow')) targetCondition = 'snow';
      else targetCondition = 'sunny'; // fallback
    }

    if (this.condition === targetCondition && this.isNight === isNight) return;
    this.condition = targetCondition;

    // Apply background gradients to CSS directly for buttery transition
    const colors = this.colors[targetCondition];
    const container = document.querySelector('.aura-bg-container');
    if (container) {
      container.style.background = `linear-gradient(135deg, ${colors.bg[0]} 0%, ${colors.bg[1]} 50%, ${colors.bg[2]} 100%)`;
    }

    // Set Glow Orbs to match the theme mood
    const orb1 = document.querySelector('.glow-orb-1');
    const orb2 = document.querySelector('.glow-orb-2');
    if (orb1 && orb2) {
      if (targetCondition === 'sunny') {
        orb1.style.background = `radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 80%)`;
        orb2.style.background = `radial-gradient(circle, rgba(91,141,239,0.15) 0%, transparent 80%)`;
      } else if (targetCondition === 'night') {
        orb1.style.background = `radial-gradient(circle, rgba(124,92,252,0.15) 0%, transparent 80%)`;
        orb2.style.background = `radial-gradient(circle, rgba(5,12,24,0.3) 0%, transparent 80%)`;
      } else if (targetCondition === 'rain' || targetCondition === 'thunderstorm') {
        orb1.style.background = `radial-gradient(circle, rgba(91,141,239,0.1) 0%, transparent 80%)`;
        orb2.style.background = `radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 80%)`;
      } else {
        orb1.style.background = `radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 80%)`;
        orb2.style.background = `radial-gradient(circle, rgba(91,141,239,0.1) 0%, transparent 80%)`;
      }
    }

    this.initParticles();

    // Reset/start loop if not active
    if (!this.animationId) {
      this.loop();
    }
  }

  initParticles() {
    this.particles = [];
    const count = this.getParticleCount();

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  getParticleCount() {
    switch (this.condition) {
      case 'sunny': return 40;     // floating light dust
      case 'night': return 120;    // twinkling stars
      case 'rain': return 150;     // falling rain drops
      case 'thunderstorm': return 180;
      case 'snow': return 100;     // drifting snowflakes
      case 'cloudy': return 30;    // mist/fog patches
      default: return 0;
    }
  }

  createParticle(isNew = false) {
    const p = {};
    p.x = Math.random() * this.width;
    p.y = isNew ? -20 : Math.random() * this.height;

    switch (this.condition) {
      case 'sunny':
        p.size = Math.random() * 4 + 1;
        p.speedX = (Math.random() - 0.5) * 0.5;
        p.speedY = -Math.random() * 0.8 - 0.2;
        p.alpha = Math.random() * 0.4 + 0.1;
        p.life = Math.random() * 100;
        break;
      case 'night':
        p.size = Math.random() * 2 + 0.5;
        p.alpha = Math.random() * 0.8 + 0.2;
        p.twinkleSpeed = Math.random() * 0.03 + 0.005;
        p.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        break;
      case 'rain':
      case 'thunderstorm':
        p.length = Math.random() * 20 + 15;
        p.speedY = Math.random() * 15 + 10;
        p.speedX = -Math.random() * 2 - 1; // fall at angle
        p.alpha = Math.random() * 0.3 + 0.15;
        break;
      case 'snow':
        p.size = Math.random() * 5 + 1.5;
        p.speedY = Math.random() * 1.5 + 0.5;
        p.speedX = (Math.random() - 0.5) * 1 + Math.sin(p.y / 30) * 0.5;
        p.alpha = Math.random() * 0.6 + 0.3;
        break;
      case 'cloudy':
        p.size = Math.random() * 120 + 80;
        p.speedX = Math.random() * 0.4 + 0.1;
        p.speedY = (Math.random() - 0.5) * 0.1;
        p.alpha = Math.random() * 0.08 + 0.02;
        break;
    }
    return p;
  }

  updateAndDrawParticles() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render Lightning strike if thunderstorm
    if (this.condition === 'thunderstorm') {
      this.handleLightningFlash();
    }

    const count = this.particles.length;
    for (let i = 0; i < count; i++) {
      const p = this.particles[i];

      switch (this.condition) {
        case 'sunny':
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y < -10) p.y = this.height + 10;
          if (p.x < -10 || p.x > this.width + 10) p.x = Math.random() * this.width;
          
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#fff';
          this.ctx.fill();
          this.ctx.shadowBlur = 0; // reset
          break;

        case 'night':
          // Twinkle logic
          p.alpha += p.twinkleSpeed * p.twinkleDir;
          if (p.alpha >= 1) { p.alpha = 1; p.twinkleDir = -1; }
          else if (p.alpha <= 0.2) { p.alpha = 0.2; p.twinkleDir = 1; }

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          if (p.size > 1.5) {
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#fff';
          }
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
          break;

        case 'rain':
        case 'thunderstorm':
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > this.height) {
            // Splash ripple effect at coordinate
            this.drawRipple(p.x, this.height - 2);
            this.particles[i] = this.createParticle(true);
          } else {
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + p.speedX, p.y + p.length);
            this.ctx.strokeStyle = `rgba(91, 141, 239, ${p.alpha})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
          }
          break;

        case 'snow':
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.y / 30) * 0.3;

          if (p.y > this.height + 10) {
            this.particles[i] = this.createParticle(true);
          } else {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            this.ctx.fill();
          }
          break;

        case 'cloudy':
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x > this.width + p.size) {
            p.x = -p.size;
            p.y = Math.random() * this.height;
          }
          this.ctx.beginPath();
          const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          this.ctx.fillStyle = grad;
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
          break;
      }
    }
  }

  handleLightningFlash() {
    // 0.5% chance to start a flash structure
    if (!this.flashActive && Math.random() < 0.004) {
      this.flashActive = true;
      this.flashIntensity = 1;
    }

    if (this.flashActive) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flashIntensity * 0.75})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.flashIntensity -= 0.08;

      if (this.flashIntensity <= 0) {
        this.flashActive = false;
        // Double strike possibility
        if (Math.random() < 0.3) {
          this.flashActive = true;
          this.flashIntensity = 0.8;
        }
      }
    }
  }

  drawRipple(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI, true);
    this.ctx.strokeStyle = 'rgba(91, 141, 239, 0.1)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  loop() {
    this.updateAndDrawParticles();
    this.animationId = requestAnimationFrame(this.loop);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('resize', this.resize);
  }
}

window.WeatherAnimationSystem = new WeatherAnimationSystem();
