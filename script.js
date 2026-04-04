// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.section > .container, .stat-item, .project-card, .city-row'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-num[data-target]').forEach(num => {
      const target = parseInt(num.dataset.target);
      let current = 0;
      const step = target / 55;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          num.textContent = target.toLocaleString('tr-TR');
          clearInterval(timer);
        } else {
          num.textContent = Math.floor(current).toLocaleString('tr-TR');
        }
      }, 22);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) counterObserver.observe(statsSection);

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.type === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ===== İNTERAKTİF HARİTA (İL TABANLI) =====
const cityData = {
  istanbul:   { name: 'İstanbul',   badge: 'Merkez Ofis · 3+ Proje', projects: ['Belediye Gündüz Bakım Evi', 'İlçe Nüfus Müdürlüğü Binası', 'Konut Projeleri'] },
  konya:      { name: 'Konya',      badge: '2+ Proje',                projects: ['Lüks Villa Projeleri', 'Konut Yapıları'] },
  ankara:     { name: 'Ankara',     badge: '2+ Proje',                projects: ['Kamu Hizmet Binaları', 'Konut Projeleri'] },
  amasya:     { name: 'Amasya',     badge: '2+ Proje',                projects: ['Eğitim Yapıları', 'Altyapı Projeleri'] },
  bodrum:     { name: 'Muğla',      badge: '1+ Proje',                projects: ['Villa ve Konut Projeleri'] },
  malatya:    { name: 'Malatya',    badge: '2+ Proje',                projects: ['Belediye Hizmet Binası', 'Kamu Yapıları'] },
  diyarbakir: { name: 'Diyarbakır', badge: '2+ Proje',                projects: ['Sanayi ve Enerji Tesisleri', 'Konut Projeleri'] },
  gumushane:  { name: 'Gümüşhane', badge: '1 Proje',                 projects: ['Bilim ve Sanat Merkezi'] }
};

const mapStage  = document.getElementById('mapContainer');
const cityCard  = document.getElementById('cityCard');
const cardName  = cityCard.querySelector('.city-card-name');
const cardBadge = cityCard.querySelector('.city-card-badge');
const cardList  = cityCard.querySelector('.city-card-list');

// İl etiketlerini map olarak sakla
const labelMap = {};
document.querySelectorAll('.province-label').forEach(lbl => {
  // data-city yoksa text içeriğine göre eşleştir — atlanabilir
});

function showCard(el, cityKey) {
  const data = cityData[cityKey];
  if (!data) return;

  cardName.textContent  = data.name;
  cardBadge.textContent = data.badge;
  cardList.innerHTML    = data.projects.map(p => `<li>${p}</li>`).join('');

  const stageRect = mapStage.getBoundingClientRect();
  const elRect    = el.getBoundingClientRect();

  let top  = elRect.top  - stageRect.top  - cityCard.offsetHeight - 14;
  let left = elRect.left - stageRect.left + elRect.width / 2 - cityCard.offsetWidth / 2;

  if (top < 8) top = elRect.bottom - stageRect.top + 14;
  left = Math.max(8, Math.min(left, stageRect.width - cityCard.offsetWidth - 8));

  cityCard.style.top  = top  + 'px';
  cityCard.style.left = left + 'px';
  cityCard.classList.add('visible');

  // Alt çubuk butonu aktif
  document.querySelectorAll('.map-city-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.map-city-btn[data-city="${cityKey}"]`);
  if (btn) btn.classList.add('active');

  // İl highlight
  document.querySelectorAll('.active-province').forEach(p => p.classList.remove('highlighted'));
  el.classList.add('highlighted');
}

function hideCard() {
  cityCard.classList.remove('visible');
  document.querySelectorAll('.map-city-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.active-province').forEach(p => p.classList.remove('highlighted'));
}

// İl hover
document.querySelectorAll('.active-province').forEach(province => {
  province.addEventListener('mouseenter', () => showCard(province, province.dataset.city));
  province.addEventListener('mouseleave', hideCard);
});

// Alt çubuk butonları
document.querySelectorAll('.map-city-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const cityKey = btn.dataset.city;
    const province = document.querySelector(`.active-province[data-city="${cityKey}"]`);
    if (province) showCard(province, cityKey);
  });
  btn.addEventListener('mouseleave', hideCard);
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Gönderildi ✓';
    btn.style.background = '#2a2a2a';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.textContent = 'Mesaj Gönder';
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3000);
  });
}
