// ===== HERO CANVAS AUTOMATION BG =====
(function () {
  const canvas = document.getElementById('heroBg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLS1 = '#6aab5e';
  const COLS2 = '#c4843a';
  const COL_DIM = 'rgba(106,171,94,0.18)';

  // ── MATRIX CODE RAIN ──
  const fontSize = 13;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]()=>+-*/&|%$#@!?';
  let cols, drops;

  function initRain() {
    cols = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }
  initRain();
  window.addEventListener('resize', initRain);

  function drawRain() {
    ctx.fillStyle = 'rgba(13,27,42,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // lead char bright
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.fillText(char, x, y);

      // trailing chars in theme color
      ctx.fillStyle = COL_DIM;
      ctx.font = `${fontSize - 1}px monospace`;
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize * 2);

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }
  }

  // ── NODES & CONNECTIONS ──
  const NODE_COUNT = 28;
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 3 + 2,
    pulse: Math.random() * Math.PI * 2,
  }));

  function drawNodes() {
    const now = Date.now() / 1000;

    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(106,171,94,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();

          // animated data packet along line
          const t = (now * 0.4 + i * 0.3) % 1;
          const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
          const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,132,58,${alpha * 2})`;
          ctx.fill();
        }
      }
    }

    // node circles
    nodes.forEach(n => {
      n.pulse += 0.04;
      const glow = Math.sin(n.pulse) * 0.4 + 0.6;

      // outer ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(106,171,94,${glow * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // core
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(106,171,94,${glow * 0.8})`;
      ctx.fill();

      // move
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
  }

  // ── CIRCUIT LINES ──
  const circuits = Array.from({ length: 10 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    len: Math.random() * 120 + 60,
    dir: Math.floor(Math.random() * 4),
    progress: Math.random(),
    speed: Math.random() * 0.004 + 0.002,
    alpha: Math.random() * 0.3 + 0.1,
  }));

  function drawCircuits() {
    circuits.forEach(c => {
      c.progress += c.speed;
      if (c.progress > 1) {
        c.progress = 0;
        c.x = Math.random() * canvas.width;
        c.y = Math.random() * canvas.height;
        c.dir = Math.floor(Math.random() * 4);
        c.len = Math.random() * 120 + 60;
      }
      const dx = [c.len, 0, -c.len, 0][c.dir];
      const dy = [0, c.len, 0, -c.len][c.dir];
      const ex = c.x + dx * c.progress;
      const ey = c.y + dy * c.progress;

      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(170,205,220,${c.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,196,180,${c.alpha * 1.5})`;
      ctx.fill();
    });
  }

  // ── MAIN LOOP ──
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRain();
    drawCircuits();
    drawNodes();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== ROLE TYPEWRITER =====
const roles = ['Web Developer', 'Python Developer', 'AI Automation Specialist'];
let ri = 0, ci = 0, deleting = false;
const roleEl = document.getElementById('roleText');

function typeRole() {
  const word = roles[ri];
  if (!deleting) {
    roleEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeRole, 1800); return; }
  } else {
    roleEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 60 : 110);
}
typeRole();

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Add fade-in to key elements
document.querySelectorAll(
  '.about-text, .about-stats, .skill-category, .project-card, .contact-info, .contact-form, .stat-card, .timeline-card, .edu-card'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(num => {
        const target = +num.dataset.target;
        let count = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          num.textContent = count + (target >= 25 ? '+' : '');
          if (count >= target) clearInterval(timer);
        }, 40);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const aboutStats = document.querySelector('.about-stats');
if (aboutStats) counterObserver.observe(aboutStats);

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type=submit]');
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background = '';
    this.reset();
  }, 3000);
});
