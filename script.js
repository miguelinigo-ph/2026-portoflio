const mainColumn = document.querySelector('.main-column');
const profileColumn = document.querySelector('.profile-column');

function getScrollTarget(target) {
  if (!target) return null;

  if (target === profileColumn) {
    return { container: profileColumn, top: 0 };
  }

  if (target === mainColumn) {
    return { container: mainColumn, top: 0 };
  }

  const container = target.closest('.profile-column') || target.closest('.main-column');
  if (!container) return null;

  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop;

  return { container, top };
}

function scrollToHash(hash, smooth = true) {
  if (!hash) return;

  const target = document.querySelector(hash);
  const result = getScrollTarget(target);
  if (!result) return;

  result.container.scrollTo({
    top: result.top,
    behavior: smooth ? 'smooth' : 'auto'
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    const result = getScrollTarget(target);
    if (!result) return;

    event.preventDefault();
    history.pushState(null, '', hash);
    result.container.scrollTo({
      top: result.top,
      behavior: 'smooth'
    });
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    requestAnimationFrame(() => scrollToHash(window.location.hash, false));
  }
});
