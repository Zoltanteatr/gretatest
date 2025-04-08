// Инициализация сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Настройка камеры
camera.position.z = 15;

// Освещение
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Параметры спирали
const CARD_COUNT = 12;
const SPIRAL_RADIUS = 8;
const SPIRAL_HEIGHT = 10;
const CARD_WIDTH = 4;
const CARD_HEIGHT = 2.5;

// Создание карточек
const cards = [];
const cardGeometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, 0.1);
const cardMaterial = new THREE.MeshPhongMaterial({ 
  color: 0xffffff,
  side: THREE.DoubleSide
});

for (let i = 0; i < CARD_COUNT; i++) {
  const card = new THREE.Mesh(cardGeometry, cardMaterial.clone());
  
  // Позиционирование в спирали
  const angle = (i / CARD_COUNT) * Math.PI * 2;
  const x = Math.cos(angle) * SPIRAL_RADIUS;
  const y = (i / CARD_COUNT) * SPIRAL_HEIGHT - SPIRAL_HEIGHT / 2;
  const z = Math.sin(angle) * SPIRAL_RADIUS;
  
  card.position.set(x, y, z);
  card.rotation.y = angle;
  
  // Сохраняем оригинальные параметры для анимации
  card.userData = { angle, index: i };
  
  // Добавляем текст на карточку (можно заменить на текстуру)
  addTextToCard(card, `Product ${i + 1}`);
  
  scene.add(card);
  cards.push(card);
}

// Добавление текста на карточку (упрощённая версия)
function addTextToCard(card, text) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.fillStyle = '#333333';
  context.font = 'Bold 80px Arial';
  context.textAlign = 'center';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  card.material.map = texture;
  card.material.needsUpdate = true;
}

// Анимация
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  
  time += 0.005;
  
  cards.forEach(card => {
    const newAngle = card.userData.angle + time;
    const x = Math.cos(newAngle) * SPIRAL_RADIUS;
    const z = Math.sin(newAngle) * SPIRAL_RADIUS;
    
    card.position.x = x;
    card.position.z = z;
    card.rotation.y = newAngle;
  });
  
  renderer.render(scene, camera);
}

// Обработка ресайза
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
