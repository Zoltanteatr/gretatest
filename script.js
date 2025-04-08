// Инициализация сцены
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // Прозрачный фон
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Освещение (ОБЯЗАТЕЛЬНО для MeshStandardMaterial)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Загрузка фона
new THREE.TextureLoader().load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D1%88%D0%BA%D0%B0%D1%84.png',
  (texture) => {
    scene.background = texture;
  },
  undefined,
  (err) => console.error('Ошибка загрузки фона:', err)
);

// Центральная модель
const loader = new THREE.GLTFLoader();
loader.load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/tripo_pbr_model_83e27b47-5346-4e55-bbaa-1bba61837d12.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(3, 3, 3);
    scene.add(model);
    console.log('3D модель загружена');
  },
  undefined,
  (error) => console.error('Ошибка загрузки модели:', error)
);

// Данные карточек
const cardData = [
  { name: "ДЖОРДЖ СЖАТ", imageUrl: "https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%94%D0%96%D0%9E%D0%A0%D0%94%D0%96%20%D0%A1%D0%96%D0%90%D0%A2.png", url: "#" },
  { name: "Обложка сжата", imageUrl: "https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0%20%D1%81%D0%B6%D0%B0%D1%82%D0%B0.png", url: "#" },
  { name: "Обложка 13", imageUrl: "https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%BE%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0%2013.png", url: "#" },
  { name: "Обложка ПРИМА", imageUrl: "https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%9E%D0%91%D0%9B%D0%9E%D0%96%D0%9A%D0%90%20%D0%9F%D0%A0%D0%98%D0%9C%D0%90%20%E2%80%94%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.png", url: "#" }
];

// Создание карточек
const cards = [];
const cardSize = { width: 3, height: 2 };

cardData.forEach((card, index) => {
  const texture = new THREE.TextureLoader().load(card.imageUrl);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  
  const geometry = new THREE.PlaneGeometry(cardSize.width, cardSize.height);
  const mesh = new THREE.Mesh(geometry, material);

  // Позиционирование в спирали
  const angle = (index / cardData.length) * Math.PI * 2;
  const radius = 8;
  const height = (index / cardData.length) * 10 - 5;

  mesh.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );
  
  // Ориентация карточек
  mesh.lookAt(0, height, 0);

  scene.add(mesh);
  cards.push(mesh);
  console.log(`Карточка ${index} создана`);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  
  // Вращение карточек
  cards.forEach(card => {
    card.rotation.y += 0.01;
  });

  controls.update();
  renderer.render(scene, camera);
}

// Обработка ресайза
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Запуск
animate();
console.log('Сцена запущена');
