(() => {
  const button = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mobile = window.matchMedia('(max-width: 900px)');
  if (!button || !sidebar) return;
  document.documentElement.classList.add('nav-ready');
  // Portrait reference guide is shared by all bestiary pages; older static
  // pages keep their original HTML while receiving the same navigation entry.
  const bestiary = Array.from(sidebar.querySelectorAll('.nav-group')).find(group => group.querySelector('summary')?.textContent.trim() === 'Bestiaire');
  if (bestiary && !bestiary.querySelector('a[href="Portraits_Ombraux.html"]')) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = 'Portraits_Ombraux.html';
    link.textContent = 'Portraits ombraux · méthode';
    item.append(link);
    bestiary.querySelector('ul')?.append(item);
  }
  // Gestion des ombres V23
  const group = Array.from(sidebar.querySelectorAll('.nav-group')).find(g => /Systèmes|Jouabilité|Modes/.test(g.querySelector('summary')?.textContent || '')) || bestiary;
  if (group && !group.querySelector('a[href="Gestion_Ombres.html"]')) {
    for (const [href, label] of [['Gestion_Ombres.html', 'Gestion des ombres · I'], ['Combat_Camera_V22.html', 'Combat et caméra V22']]) {
      const li = document.createElement('li'); const a = document.createElement('a'); a.href=href; a.textContent=label; li.append(a); group.querySelector('ul')?.append(li);
    }
  }
  const close = () => {
    document.body.classList.remove('nav-open');
    button.setAttribute('aria-expanded', 'false');
  };
  button.addEventListener('click', () => {
    const open = !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    button.setAttribute('aria-expanded', String(open));
  });
  sidebar.addEventListener('click', event => {
    if (mobile.matches && event.target.closest('a')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
      close(); button.focus();
    }
  });
  mobile.addEventListener('change', close);
  // Deep links into historical sections also reveal their collapsed parent.
  const reveal = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let parent = target.parentElement;
    while (parent) {
      if (parent.tagName === 'DETAILS') parent.open = true;
      parent = parent.parentElement;
    }
    requestAnimationFrame(() => target.scrollIntoView({block: 'start'}));
  };
  window.addEventListener('hashchange', reveal);
  if (location.hash) reveal();
})();
