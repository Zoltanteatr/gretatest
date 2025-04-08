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
camera.position.set(0, 5, 15);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth / window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls для вращения
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // Вращение вокруг центра

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Центральная модель
const loader = new THREE.GLTFLoader();
let centerModel;
loader.load(
  'https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/tripo_pbr_model_83e27b47-5346-4e55-bbaa-1bba61837d12.glb',
  (gltf) => {
    centerModel = gltf.scene;
    centerModel.scale.set(3, 3, 3);
    centerModel.position.y = 0;
    scene.add(centerModel);
  },
  undefined,
  (error) => console.error('Ошибка загрузки модели:', error)
);

// Данные карточек
const cardData = [
  { name: "ДЖОРДЖ СЖАТ", imageUrl: "https://c0f40df9-9dd3-48d8-b617-a1a14987d44d.selstorage.ru/%D0%94%D0%96%D0%9E%D0%A0%D0%94%D0%96%20%D0%A1%D0%96%D0%90%D0%A2.png", url: "#" },
  // ... остальные карточки
];

// Параметры спирали
const SPIRAL_RADIUS = 8;
const SPIRAL_HEIGHT = 12;
const CARD_WIDTH = 3;
const CARD_HEIGHT = 2;

// Создание карточек
const cards = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

cardData.forEach((card, index) => {
  const textureLoader = new THREE.TextureLoader();
  const cardTexture = textureLoader.load(card.imageUrl);

  const cardGeometry = new THREE.PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
  const cardMaterial = new THREE.MeshStandardMaterial({
    map: cardTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1
  });
  
  const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);

  // Позиционирование в спирали
  const angle = (index / cardData.length) * Math.PI * 2;
  const radius = SPIRAL_RADIUS;
  const height = (index / cardData.length) * SPIRAL_HEIGHT - SPIRAL_HEIGHT/2;

  cardMesh.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );
  
  // Карточки всегда смотрят наружу
  cardMesh.quaternion.setFromEuler(new THREE.Euler(0, angle, 0));

  // Подпись
  const labelDiv = document.createElement('div');
  labelDiv.className = 'card-label';
  labelDiv.textContent = card.name;
  const label = new THREE.CSS2DObject(labelDiv);
  label.position.set(0, -CARD_HEIGHT/2 - 0.3, 0);
  cardMesh.add(label);

  cardMesh.userData = card;
  scene.add(cardMesh);
  cards.push(cardMesh);
});

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Вращение карточек вокруг своей оси
  cards.forEach(card => {
    card.rotation.y += 0.005;
  });

  // Обновление OrbitControls
  controls.update();

  renderer.render(scene, camera);
}

// Обработчики событий
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Raycasting для hover
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);
  
  cards.forEach(card => {
    const isIntersected = intersects.some(i => i.object === card);
    card.material.opacity = isIntersected ? 1 : 0.9;
    card.children[0].element.style.opacity = isIntersected ? 1 : 0;
  });
});

window.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(cards);
  if (intersects.length > 0) {
    window.open(intersects[0].object.userData.url, '_blank');
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Запуск
animate();
