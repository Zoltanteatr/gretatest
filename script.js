document.addEventListener('DOMContentLoaded', () => {
    // Прелоадер
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloader-video');
    const skipButton = document.getElementById('skip-button');
    const mobileSrc = 'https://2317ef0e-0005-4aeb-bb8b-5150104e8a1e.selstorage.ru/vertilac%20mini.mp4';
    const desktopSrc = 'https://2317ef0e-0005-4aeb-bb8b-5150104e8a1e.selstorage.ru/%D0%9E%D0%B1%D1%80%D0%B5%D0%B7%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5%20(1).mp4';

    video.querySelector('source').src = window.innerWidth <= 768 ? mobileSrc : desktopSrc;
    video.load();

    function hidePreloader() {
        preloader.classList.add('hide');
        setTimeout(() => preloader.remove(), 1000);
    }

    video.addEventListener('ended', hidePreloader);
    skipButton.addEventListener('click', hidePreloader);
    setTimeout(hidePreloader, 15000);
    video.play().catch(err => console.log('Ошибка воспроизведения:', err));

    // Анимации с GSAP
    gsap.from('.hero__title', { opacity: 0, y: 50, duration: 1.5, ease: 'power2.out' });
    gsap.from('.hero__subtitle', { opacity: 0, y: 30, duration: 1.5, delay: 0.3, ease: 'power2.out' });
    gsap.from('.hero__button', { opacity: 0, scale: 0.8, duration: 1, delay: 0.6, ease: 'back.out(1.7)' });
    gsap.from('.info__title', { opacity: 0, y: 50, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: '.info' } });
    gsap.from('.info__text', { opacity: 0, y: 30, duration: 1.5, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: '.info' } });
});
