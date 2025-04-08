// 1. Инициализация Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// 2. Временный серый фон (на случай ошибок загрузки)
scene.background = new THREE.Color(0xf0f0f0);

// 3. Освещение
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 4. Загрузчик с CORS-прокси
const textureLoader = new THREE.TextureLoader();
function loadAsset(url, onSuccess) {
  const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
  textureLoader.load(
    proxyUrl,
    onSuccess,
    undefined,
    (err) => console.error('Ошибка загрузки:', url, err)
  );
}

// 5. Загружаем 3D-модель (центр)
loadAsset(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/tripo_pbr_model_83e27b47-5346-4e55-bbaa-1bba61837d12.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(3, 3, 3);
    scene.add(model);
  }
);

// 6. Загружаем фон
loadAsset(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D1%88%D0%BA%D0%B0%D1%84.png',
  (texture) => {
    scene.background = texture;
  }
);

// 7. Карточки
const cardTextures = [
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%94%D0%96%D0%9E%D0%A0%D0%94%D0%96%20%D0%A1%D0%96%D0%90%D0%A2.png',
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%9E%D0%91%D0%9B%D0%9E%D0%96%D0%9A%D0%90%20%D0%9F%D0%A0%D0%98%D0%9C%D0%90%20%E2%80%94%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.png',
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0%20%D1%81%D0%B6%D0%B0%D1%82%D0%B0.png',
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%BE%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0%2013.png'
];

const CARD_COUNT = 12;
const SPIRAL_RADIUS = 10;
const SPIRAL_HEIGHT = 12;
const CARD_WIDTH = 4;
const CARD_HEIGHT = 5.5;

const cards = [];
const cardGeometry = new THREE.BoxGeometry(CARD_WIDTH, CARD_HEIGHT, 0.1);

for (let i = 0; i < CARD_COUNT; i++) {
  const cardMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
  const card = new THREE.Mesh(cardGeometry, cardMaterial);

  // Первые 4 карточки — ваши изображения, остальные — текст
  if (i < 4) {
    loadAsset(cardTextures[i], (texture) => {
      card.material.map = texture;
      card.material.needsUpdate = true;
    });
  } else {
    // Заглушка для остальных карточек
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333333';
    ctx.font = 'Bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Товар ${i + 1}`, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    card.material.map = texture;
  }

  const angle = (i / CARD_COUNT) * Math.PI * 2;
  card.position.set(
    Math.cos(angle) * SPIRAL_RADIUS,
    (i / CARD_COUNT) * SPIRAL_HEIGHT - SPIRAL_HEIGHT / 2,
    Math.sin(angle) * SPIRAL_RADIUS
  );
  card.rotation.y = angle;
  card.userData = { index: i };
  scene.add(card);
  cards.push(card);
}

// 8. Анимация
function animate() {
  requestAnimationFrame(animate);
  cards.forEach((card, i) => {
    const speed = 0.005;
    card.rotation.y += speed;
    card.position.x = Math.cos(card.rotation.y) * SPIRAL_RADIUS;
    card.position.z = Math.sin(card.rotation.y) * SPIRAL_RADIUS;
  });
  renderer.render(scene, camera);
}
animate();

// 9. Ресайз
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
