cardData.forEach((card, index) => {
  const textureLoader = new THREE.TextureLoader();
  const cardTexture = textureLoader.load(card.imageUrl);

  const cardGeometry = new THREE.PlaneGeometry(2, 1);
  const cardMaterial = new THREE.MeshStandardMaterial({
    map: cardTexture,
    side: THREE.DoubleSide,
  });
  const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);

  // НОВЫЕ ПАРАМЕТРЫ СПИРАЛИ:
  const angle = (index / cardData.length) * Math.PI * 2;
  const radius = 5 + index * 0.5; // Увеличенный радиус
  const height = (index - cardData.length/2) * 0.8; // Центрирование по вертикали

  cardMesh.position.set(
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  );

  // Ориентация к центру
  cardMesh.lookAt(0, height, 0);

  // ... остальной код (userData, label) остается без изменений
  scene.add(cardMesh);
});
