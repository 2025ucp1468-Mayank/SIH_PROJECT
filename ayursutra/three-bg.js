// AyurSutra 3D Rotating Earth & Ayurvedic Geometry Engine (Three.js)

class AyurCosmosBackground {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earthGroup = null;
    this.earthMesh = null;
    this.cloudsMesh = null;
    this.atmosphereMesh = null;
    this.orbitingElements = [];
    this.particles = null;
    this.yantraRings = [];
    this.scrollProgress = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Setup Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x04130d, 0.0018);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.set(0, 0, 32);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 3. Lights
    this.setupLights();

    // 4. Create Celestial Earth & Ayurvedic Elements
    this.createEarth();
    this.createClouds();
    this.createAtmosphereGlow();
    this.createMahabhutaGeometries();
    this.createYantraOrbits();
    this.createPranaCosmicParticles();

    // 5. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // 6. Start Loop
    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x0e2e22, 1.4);
    this.scene.add(ambientLight);

    // Solar Directional Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.set(25, 12, 18);
    this.scene.add(sunLight);

    // Golden Ayurvedic Prana Rim Light
    const pranaLight = new THREE.DirectionalLight(0xdfaf37, 1.8);
    pranaLight.position.set(-20, -10, -10);
    this.scene.add(pranaLight);

    // Emerald Healing Point Light
    const emeraldLight = new THREE.PointLight(0x10b981, 2.0, 50);
    emeraldLight.position.set(0, 15, 10);
    this.scene.add(emeraldLight);
  }

  // Generate Procedural High-Detail Earth Map Canvas Texture
  generateEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep Vedic Ocean Gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#041d1a');
    oceanGrad.addColorStop(0.3, '#06312a');
    oceanGrad.addColorStop(0.5, '#0a4237');
    oceanGrad.addColorStop(0.7, '#06312a');
    oceanGrad.addColorStop(1, '#041d1a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Procedural Continents using layered simplex-like noise blobs
    ctx.fillStyle = '#1b5e20'; // Verdant Ayurvedic emerald landmass
    ctx.strokeStyle = '#2e7d32';

    // Draw stylized continents
    const drawLandMass = (cx, cy, rx, ry, bumps, color) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      for (let i = 0; i <= 360; i += 6) {
        const rad = (i * Math.PI) / 180;
        const noise = Math.sin(rad * bumps * 1.5) * 18 + Math.cos(rad * (bumps + 2)) * 12;
        const r_x = rx + noise;
        const r_y = ry + noise * 0.7;
        const x = cx + Math.cos(rad) * r_x;
        const y = cy + Math.sin(rad) * r_y;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };

    // Asia / India Subcontinent & Himalayas
    drawLandMass(1320, 480, 240, 190, 7, '#2d6a4f');
    drawLandMass(1380, 530, 80, 110, 5, '#40916c'); // Indian Peninsula
    drawLandMass(1420, 440, 130, 70, 6, '#d4af37'); // Himalayan Golden peaks

    // Africa
    drawLandMass(1020, 540, 140, 220, 6, '#2d6a4f');
    drawLandMass(1000, 420, 120, 90, 5, '#b08968'); // Sahara warm earth

    // Europe
    drawLandMass(1040, 320, 130, 90, 8, '#386641');

    // Americas
    drawLandMass(460, 360, 160, 180, 7, '#2d6a4f');
    drawLandMass(560, 640, 120, 210, 6, '#1b4332');

    // Australia & Pacific Isles
    drawLandMass(1650, 700, 110, 90, 5, '#7f5539');
    drawLandMass(1550, 620, 40, 30, 4, '#52b788');

    // Sacred Vedic Ley-lines / Golden Meridian grid
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < canvas.width; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // Generate Procedural Cloud Texture
  generateCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 90; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 30 + Math.random() * 80;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(0.5, 'rgba(220, 245, 235, 0.2)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }

  createEarth() {
    this.earthGroup = new THREE.Group();
    this.scene.add(this.earthGroup);

    const geometry = new THREE.SphereGeometry(9, 64, 64);
    const texture = this.generateEarthTexture();

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.65,
      metalness: 0.15,
      emissive: 0x06281e,
      emissiveIntensity: 0.25
    });

    this.earthMesh = new THREE.Mesh(geometry, material);
    // Tilt Earth axis by natural 23.5 degrees
    this.earthMesh.rotation.z = (23.5 * Math.PI) / 180;
    this.earthGroup.add(this.earthMesh);
  }

  createClouds() {
    const geometry = new THREE.SphereGeometry(9.18, 48, 48);
    const cloudTexture = this.generateCloudTexture();

    const material = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.cloudsMesh = new THREE.Mesh(geometry, material);
    this.earthGroup.add(this.cloudsMesh);
  }

  createAtmosphereGlow() {
    // Custom Fresnel Atmospheric Halo
    const geometry = new THREE.SphereGeometry(10.2, 48, 48);
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float intensity = pow(0.65 - dot(vNormal, viewDir), 2.2);
        vec3 glowColor = mix(vec3(0.06, 0.72, 0.51), vec3(0.85, 0.7, 0.2), intensity * 0.5);
        gl_FragColor = vec4(glowColor, intensity * 0.75);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    this.atmosphereMesh = new THREE.Mesh(geometry, material);
    this.earthGroup.add(this.atmosphereMesh);
  }

  // Create Orbiting 3D Mahabhutas (5 Great Elements Sacred Geometry)
  createMahabhutaGeometries() {
    const elementsData = [
      { name: 'Prithvi (Earth)', color: 0xf59e0b, emissive: 0xd97706, geom: new THREE.BoxGeometry(1.6, 1.6, 1.6), radius: 14.5, speed: 0.45, yOffset: 2.2, symbol: '🜃', sanskrit: 'पृथिवी' },
      { name: 'Jala (Water)', color: 0x06b6d4, emissive: 0x0891b2, geom: new THREE.IcosahedronGeometry(1.2, 0), radius: 16.8, speed: -0.38, yOffset: -3.5, symbol: '🜄', sanskrit: 'जल' },
      { name: 'Agni (Fire)', color: 0xef4444, emissive: 0xb91c1c, geom: new THREE.TetrahedronGeometry(1.4, 0), radius: 19.2, speed: 0.52, yOffset: 4.8, symbol: '🜂', sanskrit: 'अग्नि' },
      { name: 'Vayu (Air)', color: 0x10b981, emissive: 0x059669, geom: new THREE.OctahedronGeometry(1.3, 0), radius: 21.5, speed: -0.32, yOffset: -1.8, symbol: '🜁', sanskrit: 'वायु' },
      { name: 'Akasha (Ether)', color: 0xa855f7, emissive: 0x7e22ce, geom: new THREE.DodecahedronGeometry(1.35, 0), radius: 23.8, speed: 0.28, yOffset: 1.0, symbol: 'ॐ', sanskrit: 'आकाश' }
    ];

    elementsData.forEach((el, index) => {
      const group = new THREE.Group();

      // Translucent Wireframe + Solid Core
      const coreMat = new THREE.MeshStandardMaterial({
        color: el.color,
        emissive: el.emissive,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.88
      });

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });

      const coreMesh = new THREE.Mesh(el.geom, coreMat);
      const wireMesh = new THREE.Mesh(el.geom.clone().scale(1.08, 1.08, 1.08), wireMat);

      group.add(coreMesh);
      group.add(wireMesh);

      // Glowing Point Light for each Mahabhuta
      const elementLight = new THREE.PointLight(el.color, 1.2, 12);
      group.add(elementLight);

      // Add Sprite Sanskrit Label
      const sprite = this.createSymbolSprite(el.symbol, el.sanskrit, el.color);
      sprite.position.set(0, 2.0, 0);
      group.add(sprite);

      this.scene.add(group);

      this.orbitingElements.push({
        group,
        radius: el.radius,
        speed: el.speed,
        angle: (index * Math.PI * 2) / elementsData.length,
        yOffset: el.yOffset,
        rotSpeedX: 0.015 + index * 0.005,
        rotSpeedY: 0.02 + index * 0.003
      });
    });
  }

  // Create Glowing Sanskrit & Sacred Symbol Sprite
  createSymbolSprite(symbol, text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow background
    const grad = ctx.createRadialGradient(128, 64, 0, 128, 64, 60);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 36px "Cinzel", "Plus Jakarta Sans", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = `#${colorHex.toString(16).padStart(6, '0')}`;
    ctx.shadowBlur = 12;
    ctx.fillText(`${symbol} ${text}`, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(3.2, 1.6, 1);
    return sprite;
  }

  // Create Sacred Sri Yantra Concentric Orbital Rings
  createYantraOrbits() {
    const radii = [14.5, 16.8, 19.2, 21.5, 23.8];
    const colors = [0xf59e0b, 0x06b6d4, 0xef4444, 0x10b981, 0xa855f7];

    radii.forEach((r, idx) => {
      const ringGeom = new THREE.RingGeometry(r - 0.05, r + 0.05, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
      });

      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (idx * 0.12 - 0.24);
      ringMesh.rotation.y = idx * 0.15;
      this.scene.add(ringMesh);
      this.yantraRings.push(ringMesh);
    });
  }

  // Flowing Prana (Life-Force) Particles
  createPranaCosmicParticles() {
    const particleCount = 650;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(0xd4af37), // Vedic Gold
      new THREE.Color(0x10b981), // Emerald Healing
      new THREE.Color(0x06b6d4), // Jala Cyan
      new THREE.Color(0xf59e0b), // Amber Agni
      new THREE.Color(0xa855f7)  // Akasha Violet
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 1.5 + Math.random() * 3.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle Material
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(255, 230, 150, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fill();

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.6,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  // Update Scroll Progress (Called from app.js)
  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  onMouseMove(e) {
    this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Parallax Interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // 1. Rotate Earth on its Axis
    if (this.earthMesh) {
      this.earthMesh.rotation.y += 0.0035;
    }
    if (this.cloudsMesh) {
      this.cloudsMesh.rotation.y += 0.0048; // Clouds rotate slightly faster
    }

    // 2. Rotate & Animate Orbiting Mahabhutas
    this.orbitingElements.forEach((el) => {
      el.angle += el.speed * delta * 0.6;
      el.group.position.x = Math.cos(el.angle) * el.radius;
      el.group.position.z = Math.sin(el.angle) * el.radius;
      el.group.position.y = el.yOffset + Math.sin(elapsedTime * 1.5 + el.angle) * 0.8;

      el.group.rotation.x += el.rotSpeedX;
      el.group.rotation.y += el.rotSpeedY;
    });

    // 3. Rotate Yantra Orbit Rings
    this.yantraRings.forEach((ring, idx) => {
      ring.rotation.z += (idx % 2 === 0 ? 0.002 : -0.002) * (idx + 1);
    });

    // 4. Drift Prana Cosmic Particles
    if (this.particles) {
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;
    }

    // 5. Scroll-driven Camera Choreography
    // When scrollProgress is 0 (Hero): Earth is in majestic center
    // When scrollProgress > 0 (Overview, Patients, Schedule): Camera glides smoothly to provide a stunning ambient backdrop
    const p = this.scrollProgress;

    // Target Earth Position & Scale
    const targetEarthX = p * 11.0; // shifts Earth smoothly to the right
    const targetEarthY = -p * 3.5;
    const targetEarthZ = -p * 8.0;

    this.earthGroup.position.x += (targetEarthX - this.earthGroup.position.x) * 0.08;
    this.earthGroup.position.y += (targetEarthY - this.earthGroup.position.y) * 0.08;
    this.earthGroup.position.z += (targetEarthZ - this.earthGroup.position.z) * 0.08;

    // Camera Parallax
    this.camera.position.x = this.mouseX * 2.5;
    this.camera.position.y = -this.mouseY * 2.0;
    this.camera.lookAt(
      this.earthGroup.position.x * 0.4,
      this.earthGroup.position.y * 0.4,
      this.earthGroup.position.z * 0.4
    );

    this.renderer.render(this.scene, this.camera);
  }
}

window.AyurCosmosBackground = AyurCosmosBackground;
