import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base setup
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// GUI
const gui = new GUI({ title: 'Galaxy Generator', width: 300 });
const galaxyFolder = gui.addFolder('Galaxy');
const animationFolder = gui.addFolder('Animation');
gui.close();

/**
 * Galaxy parameters
 */
const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 6,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 2.2,
    insideColor: '#ffff00',
    outsideColor: '#0000ff',
    rotationSpeed: 0.1,
    pulseSpeed: 0.5,
    pulseIntensity: 0.2,
    animateColors: false,
    animateSpin: true
};

// Galaxy group to apply transformations
const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

// References
let galaxyPoints = null;
let galaxyGeometry = null;
let galaxyMaterial = null;
let ambientStars = null;
let shootingStars = [];

// Animation time
let time = 0;

/**
 * Generate galaxy
 */
const generateGalaxy = () => {
    // Dispose old galaxy
    if (galaxyPoints !== null) {
        galaxyGeometry.dispose();
        galaxyMaterial.dispose();
        galaxyGroup.remove(galaxyPoints);
    }

    // Geometry
    galaxyGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // Position
        const radius_i = Math.random() * parameters.radius;
        const spinAngle = radius_i * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius_i;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius_i;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius_i;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius_i + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius_i + randomZ;

        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius_i / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });

    // Points
    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxyGroup.add(galaxyPoints);

    // Generate ambient stars if they don't exist
    if (!ambientStars) {
        generateAmbientStars();
    }
};

/**
 * Generate ambient background stars
 */
const generateAmbientStars = () => {
    const count = 5000;
    const radius = 50;

    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Random position on a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius;

        starsPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
        starsPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starsPositions[i3 + 2] = r * Math.cos(phi);
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        color: '#ffffff',
        transparent: true,
        opacity: 0.8
    });

    ambientStars = new THREE.Points(starsGeometry, starsMaterial);
    galaxyGroup.add(ambientStars);
};

/**
 * Create a shooting star
 */
const createShootingStar = () => {
    // Random position on the edge of the scene
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 20;

    const position = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
    );

    // Direction toward center with some randomness
    const direction = new THREE.Vector3(
        -position.x + (Math.random() - 0.5) * 10,
        -position.y + (Math.random() - 0.5) * 10,
        -position.z + (Math.random() - 0.5) * 10
    ).normalize();

    // Create star head
    const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    starMesh.position.copy(position);

    // Create trail
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(20 * 3);

    for (let i = 0; i < 20; i++) {
        const i3 = i * 3;
        trailPositions[i3] = position.x - i * 0.1 * direction.x;
        trailPositions[i3 + 1] = position.y - i * 0.1 * direction.y;
        trailPositions[i3 + 2] = position.z - i * 0.1 * direction.z;
    }

    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        color: '#ffffff',
        transparent: true,
        opacity: 0.6
    });

    const trail = new THREE.Points(trailGeometry, trailMaterial);

    // Group for the shooting star
    const shootingStar = new THREE.Group();
    shootingStar.add(starMesh);
    shootingStar.add(trail);
    shootingStar.userData.direction = direction;
    shootingStar.userData.active = true;

    scene.add(shootingStar);
    shootingStars.push(shootingStar);

    return shootingStar;
};

// Periodically create shooting stars
setInterval(() => {
    if (Math.random() > 0.7) {
        createShootingStar();
    }

    // Clean up old shooting stars
    shootingStars = shootingStars.filter(star => star.userData.active);
}, 2000);

/**
 * GUI Controls
 */
// Galaxy parameters
galaxyFolder.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
galaxyFolder.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
galaxyFolder.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
galaxyFolder.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
galaxyFolder.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
galaxyFolder.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
galaxyFolder.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
galaxyFolder.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
galaxyFolder.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

// Animation parameters
animationFolder.add(parameters, 'rotationSpeed').min(0).max(1).step(0.01);
animationFolder.add(parameters, 'pulseSpeed').min(0).max(2).step(0.01);
animationFolder.add(parameters, 'pulseIntensity').min(0).max(1).step(0.01);
animationFolder.add(parameters, 'animateColors');
animationFolder.add(parameters, 'animateSpin');

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#000000');

// Generate initial galaxy
generateGalaxy();

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const delta = clock.getDelta();
    time += delta;

    // Update controls
    controls.update();

    // Rotate the galaxy
    galaxyGroup.rotation.y += delta * parameters.rotationSpeed;

    // Pulse effect
    const pulse = Math.sin(time * parameters.pulseSpeed) * parameters.pulseIntensity;
    galaxyGroup.scale.set(1 + pulse, 1 + pulse, 1 + pulse);

    // Animate colors
    if (parameters.animateColors && galaxyPoints) {
        const hue = (time * 0.1) % 1;
        const insideColorHSL = { h: 0, s: 0, l: 0 };
        const outsideColorHSL = { h: 0, s: 0, l: 0 };

        // Convert current colors to HSL
        new THREE.Color(parameters.insideColor).getHSL(insideColorHSL);
        new THREE.Color(parameters.outsideColor).getHSL(outsideColorHSL);

        // Create new colors with animated hue
        const newInsideColor = new THREE.Color().setHSL(
            (insideColorHSL.h + hue) % 1,
            insideColorHSL.s,
            insideColorHSL.l
        );
        const newOutsideColor = new THREE.Color().setHSL(
            (outsideColorHSL.h + hue + 0.5) % 1,
            outsideColorHSL.s,
            outsideColorHSL.l
        );

        // Update colors in the geometry
        const positions = galaxyPoints.geometry.attributes.position.array;
        const colors = galaxyPoints.geometry.attributes.color.array;

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;
            const radius_i = Math.sqrt(
                Math.pow(positions[i3], 2) +
                Math.pow(positions[i3 + 1], 2) +
                Math.pow(positions[i3 + 2], 2)
            ) / parameters.radius;

            const mixedColor = newInsideColor.clone();
            mixedColor.lerp(newOutsideColor, radius_i);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        galaxyPoints.geometry.attributes.color.needsUpdate = true;
    }

    // Animate spin
    if (parameters.animateSpin && galaxyPoints) {
        const spinVariation = Math.sin(time * 0.2) * 0.5;
        const positions = galaxyPoints.geometry.attributes.position.array;

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Get current position
            const x = positions[i3];
            const z = positions[i3 + 2];

            // Calculate distance from center
            const distance = Math.sqrt(x * x + z * z);

            // Apply additional rotation based on distance and time
            const angle = spinVariation * (distance / parameters.radius) * delta;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            // Apply rotation matrix
            positions[i3] = x * cos - z * sin;
            positions[i3 + 2] = x * sin + z * cos;
        }

        galaxyPoints.geometry.attributes.position.needsUpdate = true;
    }

    // Update shooting stars
    for (const star of shootingStars) {
        if (star.userData.active) {
            // Move in the set direction
            star.position.x += star.userData.direction.x * delta * 30;
            star.position.y += star.userData.direction.y * delta * 30;
            star.position.z += star.userData.direction.z * delta * 30;

            // Check if it's gone past the center
            const distanceFromCenter = star.position.length();

            if (distanceFromCenter < 1) {
                star.userData.active = false;
                scene.remove(star);
            }
        }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();