import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();
gui.close(); // Close GUI by default

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
let particleTexture = textureLoader.load('./textures/particles/4.png'); // Default texture

const textureParams = {
    texture: '4.png' // Default texture
};

// Function to update texture dynamically
const updateTexture = () => {
    particleTexture = textureLoader.load(`./textures/particles/${textureParams.texture}`);
    particlesMaterial.alphaMap = particleTexture;
    particlesMaterial.needsUpdate = true;
};

// GUI: Texture Selection
const textureOptions = {};
for (let i = 1; i <= 13; i++) {
    textureOptions[i] = `${i}.png`;
}

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;

const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
const randomness = new Float32Array(count * 3);
const speeds = new Float32Array(count);
const originalPositions = new Float32Array(count * 3);

const params = {
    particleSize: 0.2,
    waveSpeed: 4,
    waveAmplitude: 0.5,
    spin: 1,
    radius: 10,
    branches: 5,
    randomness: 0.8,
    colorInside: '#ffff00',
    colorOutside: '#0000ff',
};

// Generate particles
for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius_i = Math.random() * params.radius;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;
    const spinAngle = radius_i * params.spin;

    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * params.randomness;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * params.randomness;
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * params.randomness;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius_i + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius_i + randomZ;

    originalPositions[i3] = positions[i3];
    originalPositions[i3 + 1] = positions[i3 + 1];
    originalPositions[i3 + 2] = positions[i3 + 2];

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    const colorInside = new THREE.Color(params.colorInside);
    const colorOutside = new THREE.Color(params.colorOutside);
    const mixedColor = colorInside.clone().lerp(colorOutside, radius_i / params.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    speeds[i] = Math.random() * 0.5 + 0.5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: params.particleSize,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Debug Controls
 */
// Particle Folder
const particleFolder = gui.addFolder('Particles');
particleFolder.add(params, 'particleSize', 0.01, 1).onChange(() => {
    particlesMaterial.size = params.particleSize;
});
particleFolder.add(params, 'spin', 0, 5);
particleFolder.add(params, 'radius', 1, 20);
particleFolder.add(params, 'branches', 1, 10, 1);
particleFolder.add(params, 'randomness', 0, 2);

// Animation Folder
const animationFolder = gui.addFolder('Animation');
animationFolder.add(params, 'waveSpeed', 1, 10);
animationFolder.add(params, 'waveAmplitude', 0, 2);

// Color Folder
const colorFolder = gui.addFolder('Colors');
colorFolder.addColor(params, 'colorInside').onChange(updateParticleColors);
colorFolder.addColor(params, 'colorOutside').onChange(updateParticleColors);

// Texture Folder
const textureFolder = gui.addFolder('Texture');
textureFolder.add(textureParams, 'texture', textureOptions).name('Particle Texture').onChange(updateTexture);

function updateParticleColors() {
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const colorInside = new THREE.Color(params.colorInside);
        const colorOutside = new THREE.Color(params.colorOutside);
        const radius_i = Math.random() * params.radius;
        const mixedColor = colorInside.clone().lerp(colorOutside, radius_i / params.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }
    particlesGeometry.attributes.color.needsUpdate = true;
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update particles with ripple effect
    for (let i = 0; i < count; i++) {
        let i3 = i * 3;
        const x = particlesGeometry.attributes.position.array[i3];
        const z = particlesGeometry.attributes.position.array[i3 + 2];
        const distance = Math.sqrt(x * x + z * z);

        // Ripple effect with adjustable wave speed & amplitude
        let waveHeight = Math.sin(elapsedTime * params.waveSpeed - distance * 3) * params.waveAmplitude;
        particlesGeometry.attributes.position.array[i3 + 1] = waveHeight;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();