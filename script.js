// Theme toggle: follows the system setting until the visitor picks one
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

toggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Phone menu: open and close the section links
const header = document.querySelector('.nav');
const menuButton = document.getElementById('menu-toggle');

function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  // Labels come from the page so each language version can use its own words
  menuButton.setAttribute('aria-label', open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel);
}

menuButton.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
document.querySelectorAll('#site-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
matchMedia('(min-width: 1001px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Collapsible sections. Without this script every section simply stays open; the script
// wraps each section's content, turns its heading into a toggle and enables "Collapse all".
const sections = [...document.querySelectorAll('main .section')];
const toggleAll = document.getElementById('toggle-all');

function updateToggleAll() {
  if (!toggleAll) return;
  const expand = sections.some((s) => s.classList.contains('collapsed'));
  toggleAll.dataset.mode = expand ? 'expand' : 'collapse';
  toggleAll.querySelector('.toggle-all-label').textContent = expand ? toggleAll.dataset.expandLabel : toggleAll.dataset.collapseLabel;
}

function setSection(section, open) {
  const isOpen = !section.classList.contains('collapsed');
  if (open === isOpen) return;
  // Content is clipped only while it slides, so card shadows show once it is open
  section.classList.add('animating');
  section.classList.toggle('collapsed', !open);
  section.querySelector('.section-toggle').setAttribute('aria-expanded', String(open));
  section.querySelector('.section-body').inert = !open;
  clearTimeout(section.animTimer);
  section.animTimer = setTimeout(() => section.classList.remove('animating'), 350);
  updateToggleAll();
}

sections.forEach((section) => {
  const title = section.querySelector('.section-title');
  const body = document.createElement('div');
  body.className = 'section-body';
  body.id = `${section.id}-content`;
  const inner = document.createElement('div');
  inner.className = 'section-inner';
  while (title.nextSibling) inner.appendChild(title.nextSibling);
  body.appendChild(inner);
  section.appendChild(body);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'section-toggle';
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-controls', body.id);
  while (title.firstChild) button.appendChild(title.firstChild);
  button.insertAdjacentHTML('beforeend', '<span class="chevron" aria-hidden="true"></span>');
  title.appendChild(button);

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    setSection(section, section.classList.contains('collapsed'));
  });
  // A click anywhere on a collapsed section opens it
  section.addEventListener('click', () => {
    if (section.classList.contains('collapsed')) setSection(section, true);
  });
});

if (toggleAll) {
  toggleAll.hidden = false;
  toggleAll.addEventListener('click', () => {
    const expand = sections.some((s) => s.classList.contains('collapsed'));
    sections.forEach((s) => setSection(s, expand));
  });
}

// Links to a section (menu, "See my projects", in-page links) open it if it is collapsed
function openSectionFor(hash) {
  const target = hash && hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1)));
  const section = target && target.closest('.section');
  if (!section || !section.classList.contains('collapsed')) return;
  setSection(section, true);
  // On a mostly collapsed page the browser cannot scroll far enough until the section has
  // opened, so finish the scroll once it has
  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 360);
}
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) openSectionFor(link.getAttribute('href'));
});
window.addEventListener('hashchange', () => openSectionFor(location.hash));

// Fade cards in as they scroll into view. Whole sections are never hidden, so if this
// script fails or a browser runs an old copy of it, headings and text still show.
const targets = document.querySelectorAll('.project, .edu-card, .ai-card, .skill-group, .athlete');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
  targets.forEach((el) => { el.classList.add('reveal'); observer.observe(el); });
}
