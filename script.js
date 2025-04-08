// Инициализация сцены
const scene = new THREE.Scene();

// Загрузка фона
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D1%88%D0%BA%D0%B0%D1%84.png',
  (texture) => {
    scene.background = texture;
  },
  undefined,
  (err) => console.error('Ошибка загрузки фона:', err)
);

// Камера
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 15);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Рендерер для подписей
const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
document.body.appendChild(labelRenderer.domElement);

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Загрузка центральной модели
const loader = new THREE.GLTFLoader();
loader.load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/tripo_pbr_model_83e27b47-5346-4e55-bbaa-1bba61837d12.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(3, 3, 3);
    model.position.y = -1;
    model.rotation.y = Math.PI/4;
    
    const modelLight = new THREE.PointLight(0xb87333, 2, 10);
    model.add(modelLight);
    scene.add(model);
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
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredCard = null;

cardData.forEach((card, index) => {
  const textureLoader = new THREE.TextureLoader();
  const cardTexture = textureLoader.load(card.imageUrl);

  const cardGeometry = new THREE.PlaneGeometry(3, 2);
  const cardMaterial = new THREE.MeshStandardMaterial({
    map: cardTexture,
    side: THREE.DoubleSide,
    roughness: 0.3,
    metalness: 0.1
  });
  const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);

  // Позиционирование в спирали
  const angle = (index / cardData.length) * Math.PI * 2;
  const radius = 5 + index * 0.5;
  const height = (index - cardData.length/2) * 0.8;

  cardMesh.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );
  cardMesh.lookAt(0, height, 0);

  // Добавление подписи
  const labelDiv = document.createElement('div');
  labelDiv.className = 'card-label';
  labelDiv.textContent = card.name;
  const label = new THREE.CSS2DObject(labelDiv);
  label.position.set(0, -1.5, 0.1);
  cardMesh.add(label);

  // Метаданные
  cardMesh.userData = card;
  scene.add(cardMesh);
  cards.push(cardMesh);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Вращение карточек
  cards.forEach(card => {
    card.rotation.y += 0.01;
    card.position.x = Math.cos(card.rotation.y) * 5;
    card.position.z = Math.sin(card.rotation.y) * 5;
  });

  // Raycasting для hover-эффекта
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    
    if (hoveredCard !== intersected) {
      if (hoveredCard) {
        resetCard(hoveredCard);
      }
      hoveredCard = intersected;
      hoverCard(intersected);
    }
  } else if (hoveredCard) {
    resetCard(hoveredCard);
    hoveredCard = null;
  }

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// Функции эффектов
function hoverCard(card) {
  card.scale.set(1.2, 1.2, 1.2);
  card.material.emissive.set(0xb87333);
  card.material.emissiveIntensity = 1.5;
  card.children[0].element.style.opacity = 1;
  card.children[0].element.style.color = '#ffd700';
}

function resetCard(card) {
  card.scale.set(1, 1, 1);
  card.material.emissive.set(0x000000);
  card.material.emissiveIntensity = 0;
  card.children[0].element.style.opacity = 0;
}

// Обработчики событий
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
  if (hoveredCard && hoveredCard.userData.url) {
    window.open(hoveredCard.userData.url, '_blank');
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Запуск
animate();
