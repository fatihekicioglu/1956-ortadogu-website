document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.carousel-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const track = document.getElementById(button.dataset.target);
    const step = track.querySelector(':scope > *')?.offsetWidth + 22 || 280;
    track.scrollBy({
      left: button.classList.contains('carousel-next') ? step : -step,
      behavior: 'smooth',
    });
  });
});
