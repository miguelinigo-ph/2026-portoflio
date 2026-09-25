const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    behavior: smooth && !prefersReducedMotion ? 'smooth' : 'auto'
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
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    requestAnimationFrame(() => scrollToHash(window.location.hash, false));
  }
});


const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const button = contactForm.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;

    button.disabled = true;
    button.textContent = 'Sending…';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Inquiry sent. Thank you!';
      } else {
        const data = await response.json().catch(() => null);
        formStatus.className = 'form-status error';
        formStatus.textContent = data?.errors?.map(error => error.message).join(' ') || 'Something went wrong. Please try again.';
      }
    } catch (error) {
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Something went wrong. Please try again.';
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
}
