// ===== page reveal =====
window.addEventListener('load', () => {
  document.getElementById('veil').classList.add('hide');
  document.querySelector('.hero').classList.add('loaded');
});
setTimeout(()=>{document.getElementById('veil').classList.add('hide');}, 1800);

// ===== header scroll state =====
const header = document.getElementById('siteHeader');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
  toTop.classList.toggle('show', window.scrollY > 600);
}, {passive:true});
toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// ===== mobile menu =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ===== cursor glow trail (desktop only) =====
const glow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ===== particles canvas =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function initParticles(){
  const count = window.innerWidth < 700 ? 35 : 70;
  particles = Array.from({length: count}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    r: Math.random()*1.8 + 0.4,
    vx: (Math.random()-0.5)*0.25,
    vy: (Math.random()-0.5)*0.25,
    a: Math.random()*0.5 + 0.15,
    hue: Math.random() > 0.5 ? '34,211,238' : '168,85,247'
  }));
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0) p.x = canvas.width; if(p.x > canvas.width) p.x = 0;
    if(p.y < 0) p.y = canvas.height; if(p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.hue},${p.a})`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(${p.hue},0.8)`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
resizeCanvas(); initParticles(); animateParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

// ===== scroll reveal (Intersection Observer) =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// ===== animated counters =====
const counters = document.querySelectorAll('.stat-num');
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target/40));
      const tick = () => {
        cur += step;
        if(cur >= target){ el.textContent = target; }
        else { el.textContent = cur; requestAnimationFrame(tick); }
      };
      tick();
      counterIO.unobserve(el);
    }
  });
}, {threshold:0.4});
counters.forEach(c => counterIO.observe(c));

// ===== skill bar fill on view =====
const skillRows = document.querySelectorAll('.skill-row');
const skillIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const fill = entry.target.querySelector('.skill-fill');
      fill.style.width = entry.target.dataset.pct + '%';
      skillIO.unobserve(entry.target);
    }
  });
}, {threshold:0.4});
skillRows.forEach(r => skillIO.observe(r));

// ===== circular skill badges fill on view =====
const skillBadges = document.querySelectorAll('.skill-badge');
const badgeIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const pct = parseInt(entry.target.dataset.pct, 10);
      const circle = entry.target.querySelector('.fill');
      const circumference = 163;
      const offset = circumference - (pct/100)*circumference;
      circle.style.strokeDashoffset = offset;
      badgeIO.unobserve(entry.target);
    }
  });
}, {threshold:0.4});
skillBadges.forEach(b => badgeIO.observe(b));

// ===== project filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ===== parallax on hero orbit (subtle, mouse-driven) =====
const orbitWrap = document.querySelector('.orbit-wrap');
if (orbitWrap && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;
    orbitWrap.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// ===== reduced motion respect =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('*').forEach(el => {
    el.style.animationDuration = '0.001s';
    el.style.transitionDuration = '0.001s';
  });
}
