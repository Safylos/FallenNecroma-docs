(() => {
  const button = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const top = document.querySelector('.top');
  const mobile = window.matchMedia('(max-width: 900px)');
  if (!button || !sidebar) return;
  document.documentElement.classList.add('nav-ready');
  const sizeHeader = () => document.documentElement.style.setProperty('--header-height', `${top.getBoundingClientRect().height}px`);
  if (window.ResizeObserver) new ResizeObserver(sizeHeader).observe(top);
  sizeHeader();
  const close = () => {
    document.body.classList.remove('nav-open');
    button.setAttribute('aria-expanded', 'false');
  };
  button.addEventListener('click', () => {
    const open = !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    button.setAttribute('aria-expanded', String(open));
    if (open) sidebar.querySelector('[aria-current="page"]')?.scrollIntoView({block: 'nearest'});
  });
  // Keep the reader's place in the complete guide list across page changes.
  const scrollKey = 'fallen-docs-navigation-scroll';
  if (!mobile.matches) {
    try { sidebar.scrollTop = Number(sessionStorage.getItem(scrollKey)) || 0; } catch {}
    const active = sidebar.querySelector('[aria-current="page"]');
    if (active) {
      const rect = active.getBoundingClientRect();
      const panel = sidebar.getBoundingClientRect();
      if (rect.top < panel.top || rect.bottom > panel.bottom) sidebar.scrollTop += rect.top - panel.top - 80;
    }
  }
  sidebar.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    try { sessionStorage.setItem(scrollKey, String(sidebar.scrollTop)); } catch {}
    if (mobile.matches) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      close(); button.focus();
    }
  });
  document.addEventListener('click', event => {
    if (mobile.matches && !sidebar.contains(event.target) && !button.contains(event.target)) close();
  });
  mobile.addEventListener('change', close);
  // Historical deep links still reveal their collapsed parent guide.
  const reveal = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
  };
  window.addEventListener('hashchange', reveal);
  if (location.hash) reveal();
})();
