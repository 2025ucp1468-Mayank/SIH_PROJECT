// AyurSutra 3D Floating Ayurvedic Herbal Sanctuary & Golden Prana WebGL Engine (Three.js)

class AyurCosmosBackground {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Entity Groups
    this.herbalGroup = null;
    this.floatingHerbs = [];
    this.pranaParticles = null;
    this.yantraRings = [];
    this.sacredSolids = [];
    
    // Hover & Rotation Speed
    this.isHovering = false;
    this.flowSpeed = 1.0;
    this.targetFlowSpeed = 1.0;
    this.scrollProgress = 0;

    // Mouse Parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02130c, 0.0018);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    this.camera.position.set(0, 0, 34);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.domElement.style.transition = 'opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1)';
    this.container.appendChild(this.renderer.domElement);

    this.setupLights();
    this.createFloatingHerbs();
    this.createPranaEnergyStreams();
    this.createSacredMahabhutas();
    this.createYantraOrbits();

    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x0c2d20, 1.6);
    this.scene.add(ambientLight);

    // Warm Golden Sunlight
    const sunLight = new THREE.DirectionalLight(0xfff7d6, 2.2);
    sunLight.position.set(20, 18, 15);
    this.scene.add(sunLight);

    // Vedic Amber Backlight
    const pranaLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    pranaLight.position.set(-20, -12, -10);
    this.scene.add(pranaLight);

    // Emerald Healing Glow
    const emeraldLight = new THREE.PointLight(0x10b981, 2.4, 45);
    emeraldLight.position.set(0, 6, 8);
    this.scene.add(emeraldLight);
  }

  // Generate High-Detail Procedural Botanical Leaf Canvas Textures
  generateLeafTexture(type = 'tulsi') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 512, 512);

    if (type === 'tulsi') {
      // Lush Sacred Tulsi (Holy Basil) Leaf
      const grad = ctx.createLinearGradient(128, 64, 384, 448);
      grad.addColorStop(0, '#38b000');
      grad.addColorStop(0.5, '#2d6a4f');
      grad.addColorStop(1, '#1b4332');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#70e000';
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo(256, 40);
      ctx.bezierCurveTo(390, 140, 380, 360, 256, 470);
      ctx.bezierCurveTo(132, 360, 122, 140, 256, 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vein Network
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(256, 50);
      ctx.lineTo(256, 460);
      ctx.stroke();

      // Lateral veins
      for (let y = 110; y < 420; y += 42) {
        ctx.beginPath();
        ctx.moveTo(256, y);
        ctx.quadraticCurveTo(310, y - 20, 340, y - 35);
        ctx.moveTo(256, y);
        ctx.quadraticCurveTo(202, y - 20, 172, y - 35);
        ctx.stroke();
      }
    } else if (type === 'neem') {
      // Slender Pinnate Neem Leaf
      const grad = ctx.createLinearGradient(128, 40, 384, 480);
      grad.addColorStop(0, '#52b788');
      grad.addColorStop(0.5, '#1b4332');
      grad.addColorStop(1, '#081c15');

      ctx.fillStyle = grad;
      ctx.strokeStyle = '#95d5b2';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(256, 30);
      ctx.bezierCurveTo(340, 160, 330, 340, 256, 480);
      ctx.bezierCurveTo(182, 340, 172, 160, 256, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(167, 243, 208, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(256, 40);
      ctx.lineTo(256, 470);
      ctx.stroke();
    } else if (type === 'turmeric') {
      // Golden Turmeric (Haridra) Rhizome Slice
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 220);
      grad.addColorStop(0, '#fff7d6');
      grad.addColorStop(0.35, '#f59e0b');
      grad.addColorStop(0.7, '#d97706');
      grad.addColorStop(1, '#92400e');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(256, 256, 210, 160, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer rough bark rim
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Concentric rings
      ctx.strokeStyle = 'rgba(245, 215, 110, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(256, 256, 140, 100, 0.3, 0, Math.PI * 2);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  // Create 3D Floating Botanical Herbs
  createFloatingHerbs() {
    this.herbalGroup = new THREE.Group();
    this.scene.add(this.herbalGroup);

    const tulsiTex = this.generateLeafTexture('tulsi');
    const neemTex = this.generateLeafTexture('neem');
    const turmericTex = this.generateLeafTexture('turmeric');

    const herbDefs = [
      { texture: tulsiTex, size: 2.8, count: 18, color: 0x40916c },
      { texture: neemTex, size: 3.2, count: 14, color: 0x2d6a4f },
      { texture: turmericTex, size: 2.2, count: 12, color: 0xf59e0b }
    ];

    herbDefs.forEach((def) => {
      const planeGeom = new THREE.PlaneGeometry(def.size, def.size * 1.35, 8, 8);

      // Add gentle curved leaf curvature vertex displacement
      const pos = planeGeom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = -Math.sin((x / def.size) * Math.PI) * 0.35 + Math.cos((y / (def.size * 1.35)) * Math.PI) * 0.2;
        pos.setZ(i, z);
      }
      planeGeom.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        map: def.texture,
        transparent: true,
        side: THREE.DoubleSide,
        roughness: 0.4,
        metalness: 0.2,
        alphaTest: 0.05
      });

      for (let i = 0; i < def.count; i++) {
        const mesh = new THREE.Mesh(planeGeom, mat);

        // Distribute in beautiful spherical/spiral cloud around center
        const radius = 8.0 + Math.random() * 16.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = (Math.random() - 0.5) * Math.PI * 0.8;

        mesh.position.set(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(phi) * 0.8,
          radius * Math.sin(theta) * Math.cos(phi)
        );

        mesh.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        const scale = 0.75 + Math.random() * 0.5;
        mesh.scale.set(scale, scale, scale);

        this.herbalGroup.add(mesh);

        this.floatingHerbs.push({
          mesh,
          baseRadius: radius,
          angle: theta,
          phi: phi,
          orbitSpeed: (0.15 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1),
          flutterSpeedX: 0.01 + Math.random() * 0.02,
          flutterSpeedY: 0.015 + Math.random() * 0.02,
          wobbleOffset: Math.random() * Math.PI * 2
        });
      }
    });
  }

  // Create Swirling Golden Prana Energy Streams
  createPranaEnergyStreams() {
    const particleCount = 850;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0xfff7d6), // Pure Vedic Gold
      new THREE.Color(0xd4af37), // Classic Amber Gold
      new THREE.Color(0x34d399), // Healing Mint
      new THREE.Color(0x10b981), // Emerald Life-force
      new THREE.Color(0x06b6d4)  // Jala Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 6 + Math.random() * 24;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 1.2 + Math.random() * 2.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle sprite glow texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(245, 215, 110, 0.8)');
    grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.65,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pranaParticles = new THREE.Points(geometry, material);
    this.scene.add(this.pranaParticles);
  }

  // Create Translucent Sacred Geometry Platonic Solids
  createSacredMahabhutas() {
    const solidsData = [
      { name: 'Prithvi', color: 0xf59e0b, geom: new THREE.BoxGeometry(1.4, 1.4, 1.4), radius: 15.0, speed: 0.28 },
      { name: 'Jala', color: 0x06b6d4, geom: new THREE.IcosahedronGeometry(1.1, 0), radius: 17.5, speed: -0.24 },
      { name: 'Agni', color: 0xef4444, geom: new THREE.TetrahedronGeometry(1.2, 0), radius: 20.0, speed: 0.32 },
      { name: 'Vayu', color: 0x10b981, geom: new THREE.OctahedronGeometry(1.2, 0), radius: 22.5, speed: -0.22 },
      { name: 'Akasha', color: 0xa855f7, geom: new THREE.DodecahedronGeometry(1.25, 0), radius: 24.5, speed: 0.18 }
    ];

    solidsData.forEach((s, idx) => {
      const group = new THREE.Group();

      const coreMat = new THREE.MeshStandardMaterial({
        color: s.color,
        emissive: s.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.75
      });

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });

      group.add(new THREE.Mesh(s.geom, coreMat));
      group.add(new THREE.Mesh(s.geom.clone().scale(1.1, 1.1, 1.1), wireMat));

      this.scene.add(group);

      this.sacredSolids.push({
        group,
        radius: s.radius,
        angle: (idx * Math.PI * 2) / solidsData.length,
        speed: s.speed,
        rotSpeedX: 0.01 + idx * 0.004,
        rotSpeedY: 0.015 + idx * 0.003
      });
    });
  }

  // Create Glowing Concentric Sri Yantra Orbital Rings
  createYantraOrbits() {
    const radii = [14.0, 17.5, 21.0, 24.5];
    const colors = [0xd4af37, 0x10b981, 0x06b6d4, 0xa855f7];

    radii.forEach((r, idx) => {
      const ringGeom = new THREE.RingGeometry(r - 0.04, r + 0.04, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colors[idx],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });

      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (idx * 0.1 - 0.15);
      ringMesh.rotation.y = idx * 0.12;
      this.scene.add(ringMesh);
      this.yantraRings.push(ringMesh);
    });
  }

  // Set Hover State: Accelerates gentle herbal flow when hovered
  setHover(isHovering) {
    this.isHovering = isHovering;
    this.targetFlowSpeed = isHovering ? 2.2 : 0.8;
  }

  // Set Scroll Progress: Smoothly shifts camera and dims background for clean readability
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

    // Smoothly interpolate flow speed based on hover
    this.flowSpeed += (this.targetFlowSpeed - this.flowSpeed) * 0.06;

    // Mouse Parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // 1. Animate Floating Herbal Leaves (Gentle tumbling & orbital drift)
    this.floatingHerbs.forEach((h) => {
      h.angle += (h.orbitSpeed * 0.3 * this.flowSpeed) * delta;
      
      const r = h.baseRadius + Math.sin(elapsedTime * 1.2 + h.wobbleOffset) * 0.8;
      h.mesh.position.x = r * Math.cos(h.angle) * Math.cos(h.phi);
      h.mesh.position.y = (r * Math.sin(h.phi) * 0.8) + Math.sin(elapsedTime * 1.5 + h.wobbleOffset) * 0.6;
      h.mesh.position.z = r * Math.sin(h.angle) * Math.cos(h.phi);

      h.mesh.rotation.x += h.flutterSpeedX * this.flowSpeed;
      h.mesh.rotation.y += h.flutterSpeedY * this.flowSpeed;
      h.mesh.rotation.z += Math.sin(elapsedTime * 2.0 + h.wobbleOffset) * 0.005;
    });

    // 2. Animate Golden Prana Energy Particles
    if (this.pranaParticles) {
      this.pranaParticles.rotation.y += 0.0018 * this.flowSpeed;
      this.pranaParticles.rotation.x = Math.sin(elapsedTime * 0.25) * 0.04;
    }

    // 3. Animate Sacred Geometry Solids
    this.sacredSolids.forEach((s) => {
      s.angle += (s.speed * 0.3 * this.flowSpeed) * delta;
      s.group.position.x = Math.cos(s.angle) * s.radius;
      s.group.position.z = Math.sin(s.angle) * s.radius;
      s.group.position.y = Math.sin(elapsedTime * 1.2 + s.angle) * 1.0;

      s.group.rotation.x += s.rotSpeedX * this.flowSpeed;
      s.group.rotation.y += s.rotSpeedY * this.flowSpeed;
    });

    // 4. Animate Yantra Orbit Rings
    this.yantraRings.forEach((ring, idx) => {
      ring.rotation.z += (idx % 2 === 0 ? 0.0015 : -0.0015) * (idx + 1) * this.flowSpeed;
    });

    // 5. Scroll-driven Ambient Camera Gliding
    const p = this.scrollProgress;
    const targetX = this.mouseX * 3.0 + p * 8.0;
    const targetY = -this.mouseY * 2.5 - p * 3.0;
    const targetZ = 34.0 - p * 6.0;

    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;

    this.camera.lookAt(p * 2.5, -p * 1.0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

window.AyurCosmosBackground = AyurCosmosBackground;
