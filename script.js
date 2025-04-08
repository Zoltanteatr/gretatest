// Инициализация сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true // Прозрачный фон
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Загрузка фона
const textureLoader = new THREE.TextureLoader();
textureLoader.load('https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D1%88%D0%BA%D0%B0%D1%84.png', (texture) => {
  scene.background = texture;
});

// Настройка камеры
camera.position.z = 15;

// Освещение
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Загрузка 3D-модели в центре
const loader = new THREE.GLTFLoader();
loader.load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/tripo_pbr_model_83e27b47-5346-4e55-bbaa-1bba61837d12.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(3, 3, 3);
    scene.add(model);
  }
);

// Текстуры для карточек
const cardTextures = [
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%94%D0%96%D0%9E%D0%A0%D0%94%D0%96%20%D0%A1%D0%96%D0%90%D0%A2.png',
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%9E%D0%91%D0%9B%D0%9E%D0%96%D0%9A%D0%90%20%D0%9F%D0%A0%D0%98%D0%9C%D0%90%20%E2%80%94%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.png',
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0%20%D1%81%D0%B6%D0%B0%D1%82%D0%B0.png',
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%BE%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0%2013.png'
];

// Параметры спирали
const CARD_COUNT = 12;
const SPIRAL_RADIUS = 10;
const SPIRAL_HEIGHT = 12;
const CARD_WIDTH = 4;
const CARD_HEIGHT = 5.5;

// Создание карточек
const cards = [];
const cardGeometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, 0.1);

for (let i = 0; i < CARD_COUNT; i++) {
  const cardMaterial = new THREE.MeshPhongMaterial({ 
    side: THREE.DoubleSide
  });
  
  const card = new THREE.Mesh(cardGeometry, cardMaterial);
  
  // Используем разные текстуры для первых 4 карточек
  if (i < 4) {
    textureLoader.load(cardTextures[i], (texture) => {
      card.material.map = texture;
      card.material.needsUpdate = true;
    });
  } else {
    // Для остальных - стандартный дизайн
    addTextToCard(card, `Product ${i + 1}`);
  }
  
  // Позиционирование
  const angle = (i / CARD_COUNT) * Math.PI * 2;
  const x = Math.cos(angle) * SPIRAL_RADIUS;
  const y = (i / CARD_COUNT) * SPIRAL_HEIGHT - SPIRAL_HEIGHT / 2;
  const z = Math.sin(angle) * SPIRAL_RADIUS;
  
  card.position.set(x, y, z);
  card.rotation.y = angle;
  card.userData = { angle, index: i };
  
  scene.add(card);
  cards.push(card);
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