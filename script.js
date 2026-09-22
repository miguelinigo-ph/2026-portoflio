const mainColumn = document.querySelector('.main-column');
const profileColumn = document.querySelector('.profile-column');

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();

    if (target.closest('.profile-column') && profileColumn) {
      profileColumn.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    } else if (target.closest('.main-column') && mainColumn) {
      mainColumn.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  });
});
