/* ======================================================
   Three.js Waterfall Particle Background
   Animated water particles flowing downward
   ====================================================== */

(function () {
  const canvas = document.getElementById('waterfall-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

  // ---- Particle system for waterfall ----
  const PARTICLE_COUNT = 6000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const opacities = new Float32Array(PARTICLE_COUNT);

  // Spread particles across the viewport
  const SPREAD_X = 80;
  const SPREAD_Y = 80;
  const SPREAD_Z = 30;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * SPREAD_X;
    positions[i3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
    positions[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z - 10;

    // Downward velocity with some variation
    velocities[i3] = (Math.random() - 0.5) * 0.02; // slight horizontal drift
    velocities[i3 + 1] = -(Math.random() * 0.15 + 0.05); // fall speed
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    sizes[i] = Math.random() * 2.5 + 0.5;
    opacities[i] = Math.random() * 0.5 + 0.2;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

  // Custom shader material for water-like particles
  const vertexShader = `
    attribute float aSize;
    attribute float aOpacity;
    varying float vOpacity;
    void main() {
      vOpacity = aOpacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (200.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying float vOpacity;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
      vec3 color = mix(
        vec3(0.024, 0.714, 0.831),  // aqua
        vec3(0.231, 0.510, 0.965),  // blue
        gl_PointCoord.y
      );
      gl_FragColor = vec4(color, alpha * 0.35);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ---- Mist / fog layer (separate, slower particles) ----
  const MIST_COUNT = 1500;
  const mistGeometry = new THREE.BufferGeometry();
  const mistPositions = new Float32Array(MIST_COUNT * 3);
  const mistSizes = new Float32Array(MIST_COUNT);
  const mistOpacities = new Float32Array(MIST_COUNT);

  for (let i = 0; i < MIST_COUNT; i++) {
    const i3 = i * 3;
    mistPositions[i3] = (Math.random() - 0.5) * SPREAD_X * 1.5;
    mistPositions[i3 + 1] = (Math.random() - 0.5) * SPREAD_Y;
    mistPositions[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z - 15;
    mistSizes[i] = Math.random() * 6 + 3;
    mistOpacities[i] = Math.random() * 0.15 + 0.05;
  }

  mistGeometry.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));
  mistGeometry.setAttribute('aSize', new THREE.BufferAttribute(mistSizes, 1));
  mistGeometry.setAttribute('aOpacity', new THREE.BufferAttribute(mistOpacities, 1));

  const mistFragShader = `
    varying float vOpacity;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
      vec3 color = mix(
        vec3(0.545, 0.361, 0.965), // violet
        vec3(0.024, 0.714, 0.831), // aqua
        gl_PointCoord.x
      );
      gl_FragColor = vec4(color, alpha * 0.2);
    }
  `;

  const mistMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: mistFragShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mist = new THREE.Points(mistGeometry, mistMaterial);
  scene.add(mist);

  // ---- Mouse interaction ----
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ---- Animation loop ----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    const posAttr = geometry.attributes.position;
    const posArray = posAttr.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Apply velocity
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Add sine wave drift for water feel
      posArray[i3] += Math.sin(elapsed * 0.5 + i * 0.01) * 0.005;

      // Reset particles that fall below
      if (posArray[i3 + 1] < -SPREAD_Y / 2) {
        posArray[i3] = (Math.random() - 0.5) * SPREAD_X;
        posArray[i3 + 1] = SPREAD_Y / 2 + Math.random() * 10;
        posArray[i3 + 2] = (Math.random() - 0.5) * SPREAD_Z - 10;
      }
    }

    posAttr.needsUpdate = true;

    // Mist gentle float
    const mistPosAttr = mistGeometry.attributes.position;
    const mistArr = mistPosAttr.array;

    for (let i = 0; i < MIST_COUNT; i++) {
      const i3 = i * 3;
      mistArr[i3] += Math.sin(elapsed * 0.3 + i * 0.05) * 0.008;
      mistArr[i3 + 1] += Math.cos(elapsed * 0.2 + i * 0.03) * 0.004;

      // Slow upward float for mist
      mistArr[i3 + 1] += 0.008;
      if (mistArr[i3 + 1] > SPREAD_Y / 2) {
        mistArr[i3 + 1] = -SPREAD_Y / 2;
        mistArr[i3] = (Math.random() - 0.5) * SPREAD_X * 1.5;
      }
    }

    mistPosAttr.needsUpdate = true;

    // Subtle camera sway based on mouse
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    // Slow rotation
    particles.rotation.y = Math.sin(elapsed * 0.1) * 0.05;
    mist.rotation.y = Math.sin(elapsed * 0.08) * 0.03;

    renderer.render(scene, camera);
  }

  animate();

  // ---- Resize handler ----
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
