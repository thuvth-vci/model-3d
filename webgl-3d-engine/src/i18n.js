// Minimal VI/EN language toggle for the fixed header bar.
// Intentionally plain: no framework/library, just a variable + a dictionary.

let lang = 'vi';

const dict = {
  vi: {
    title: 'Trình xem mô hình 3D',
    langBtn: 'EN'
  },
  en: {
    title: '3D Model Viewer',
    langBtn: 'VI'
  }
};

function applyLang() {
  const titleEl = document.getElementById('app-title');
  const langBtn = document.getElementById('lang-toggle-btn');

  if (titleEl) titleEl.textContent = dict[lang].title;
  if (langBtn) langBtn.textContent = dict[lang].langBtn;
}

function toggleLang() {
  lang = lang === 'vi' ? 'en' : 'vi';
  applyLang();
}

function initHeader() {
  const header = document.getElementById('app-header');
  const langBtn = document.getElementById('lang-toggle-btn');
  const hideBtn = document.getElementById('hide-header-btn');
  const restoreBtn = document.getElementById('restore-header-btn');

  if (langBtn) {
    langBtn.addEventListener('click', toggleLang);
  }

  if (hideBtn && header && restoreBtn) {
    hideBtn.addEventListener('click', () => {
      header.style.display = 'none';
      restoreBtn.style.display = 'flex';
      restoreBtn.style.alignItems = 'center';
      restoreBtn.style.justifyContent = 'center';
    });

    restoreBtn.addEventListener('click', () => {
      header.style.display = 'flex';
      restoreBtn.style.display = 'none';
    });
  }

  applyLang();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}

export { dict, applyLang, toggleLang, initHeader };
