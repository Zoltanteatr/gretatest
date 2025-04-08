// Инициализация сцены
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // Вращение вокруг центра

// Освещение (обязательно для MeshStandardMaterial)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Фон
new THREE.TextureLoader().load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D1%88%D0%BA%D0%B0%D1%84.png',
  (texture) => {
    scene.background = texture;
  },
  undefined,
  (err) => console.error('Ошибка загрузки фона:', err)
);

// Центральная 3D модель
const loader = new THREE.GLTFLoader();
loader.load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/tripo_pbr_model_83e27b47-5346-4e55-bbaa-1bba61837d12.glb',
  (gltf) => {
    const model = gltf.scene;
    
    // Настройки модели
    model.scale.set(3, 3, 3);
    model.position.y = 0;
    
    // Подсветка модели
    const modelLight = new THREE.PointLight(0xb87333, 2, 10);
    model.add(modelLight);
    
    scene.add(model);
    console.log('3D модель загружена и добавлена в сцену');
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

// Параметры спирали
const SPIRAL_RADIUS = 8;
const SPIRAL_HEIGHT = 12;
const CARD_WIDTH = 3;
const CARD_HEIGHT = 2;

// Создание карточек
const cards = [];
const textureLoader = new THREE.TextureLoader();

cardData.forEach((card, index) => {
  // Создаем текстуру с обработкой ошибок
  const texture = textureLoader.load(
    card.imageUrl,
    undefined,
    undefined,
    (err) => console.error(`Ошибка загрузки текстуры ${index}:`, err)
  );
  
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1 // Все карточки полностью видны
  });
  
  const geometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
  const mesh = new THREE.Mesh(geometry, material);

  // Позиционирование в спирали
  const angle = (index / cardData.length) * Math.PI * 2;
  const radius = SPIRAL_RADIUS;
  const height = (index / cardData.length) * SPIRAL_HEIGHT - (SPIRAL_HEIGHT / 2);

  mesh.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );
  
  // Карточки смотрят наружу от центра
  mesh.lookAt(mesh.position.x * 2, height, mesh.position.z * 2);

  scene.add(mesh);
  cards.push(mesh);
  console.log(`Карточка ${index} создана`);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  
  // Плавное вращение карточек
  cards.forEach((card, index) => {
    card.rotation.y += 0.005;
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
