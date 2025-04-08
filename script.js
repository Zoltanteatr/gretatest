document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.cards-wrapper');
  const cardsCount = 12; // Количество карточек
  const radius = 300; // Радиус спирали
  const speed = 0.005; // Скорость вращения
  
  // Создаем карточки
  for (let i = 0; i < cardsCount; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>Товар ${i + 1}</h3>`; // Замените на свои данные
    card.addEventListener('click', () => {
      alert(`Карточка ${i + 1} кликнута!`); // Действие при клике
    });
    container.appendChild(card);
  }

  // Анимация спирали
  let angle = 0;
  function animate() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      const spiralAngle = angle + (index * Math.PI * 2 / cardsCount);
      const x = Math.cos(spiralAngle) * radius;
      const y = index * 20; // Высота спирали
      const z = Math.sin(spiralAngle) * radius;
      
      card.style.transform = `
        translate3d(calc(50% + ${x}px), calc(50% + ${y}px), ${z}px)
        rotateY(${spiralAngle}rad)
      `;
    });
    
    angle += speed;
    requestAnimationFrame(animate);
  }
  
  animate();
});
