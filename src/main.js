import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

/**
 * Base
 */
// Debug UI
const gui = new GUI({
    width: 300,
    title: 'Lights'
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// Creates an ambient light with white color and intensity 1.5
ambientLight.visible = false; // Light is disabled by default
scene.add(ambientLight);

// Ambient Light Helper
const ambientLightHelper = new THREE.AxesHelper(1); // No direct helper, using AxesHelper as a placeholder
ambientLightHelper.visible = false;
scene.add(ambientLightHelper);

// GUI Controls
const ambient = gui.addFolder('Ambient Light');
ambient.close();
ambient.add(ambientLight, 'visible').name('Enable Light'); // Toggle light on/off
ambient.addColor(ambientLight, 'color'); // Change light color
ambient.add(ambientLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity
ambient.add(ambientLightHelper, 'visible').name('Show Helper'); // Toggle helper visibility

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
// Creates a directional light with blue-green tint and intensity 0.9
directionalLight.position.set(1, 0.25, 0); // Sets the light position in the scene
directionalLight.visible = false; // Light is disabled by default
scene.add(directionalLight);

// Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);

// GUI Controls
const directional = gui.addFolder('Directional Light');
directional.close();
directional.add(directionalLight, 'visible').name('Enable Light');
directional.addColor(directionalLight, 'color');
directional.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
directional.add(directionalLight.position, 'x').min(-10).max(10).step(0.1);
directional.add(directionalLight.position, 'y').min(-10).max(10).step(0.1);
directional.add(directionalLight.position, 'z').min(-10).max(10).step(0.1);
directional.add(directionalLightHelper, 'visible').name('Show Helper');

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
// Creates a hemisphere light with red sky color and blue ground color
hemisphereLight.visible = false; // Light is disabled by default
scene.add(hemisphereLight);

// Hemisphere Light Helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.5);
hemisphereLightHelper.visible = false;
scene.add(hemisphereLightHelper);

// GUI Controls
const hemisphere = gui.addFolder('Hemisphere Light');
hemisphere.close();
hemisphere.add(hemisphereLight, 'visible').name('Enable Light');
hemisphere.addColor(hemisphereLight, 'color').name('Sky Color');
hemisphere.addColor(hemisphereLight, 'groundColor').name('Ground Color');
hemisphere.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001);
hemisphere.add(hemisphereLightHelper, 'visible').name('Show Helper');

// Point Light
const pointLight = new THREE.PointLight(0xff9000, 1.5, 0, 2);
// Creates a point light with orange color, intensity 1.5, no distance limit, and decay rate of 2
pointLight.position.set(1, -0.5, 1); // Sets the light position in the scene
pointLight.visible = false; // Light is disabled by default
scene.add(pointLight);

// Point Light Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = false;
scene.add(pointLightHelper);

// GUI Controls
const point = gui.addFolder('Point Light');
point.close();
point.add(pointLight, 'visible').name('Enable Light');
point.addColor(pointLight, 'color');
point.add(pointLight, 'intensity').min(0).max(3).step(0.001);
point.add(pointLightHelper, 'visible').name('Show Helper');

// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
// Creates a rectangular area light with purple color, intensity 6, width 1, and height 1
rectAreaLight.position.set(-1.5, 0, 1.5); // Sets the light position in the scene
rectAreaLight.lookAt(new THREE.Vector3()); // Ensures the light is facing the center
rectAreaLight.visible = false; // Light is disabled by default
scene.add(rectAreaLight);

// Rect Area Light Helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;
scene.add(rectAreaLightHelper);

// GUI Controls
const rectArea = gui.addFolder('Rect Area Light');
rectArea.close();
rectArea.add(rectAreaLight, 'visible').name('Enable Light');
rectArea.addColor(rectAreaLight, 'color');
rectArea.add(rectAreaLight, 'intensity').min(0).max(10).step(0.1);
rectArea.add(rectAreaLightHelper, 'visible').name('Show Helper');

// Spotlight
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1);
// Creates a spotlight with green color, intensity 4.5, max distance 10, angle π*0.1, penumbra 0.25, and decay 1
spotLight.position.set(0, 2, 3); // Sets the light position in the scene
spotLight.visible = true; // Light is disabled by default
scene.add(spotLight);

// Spotlight Target
spotLight.target.position.set(0, 0, 0); // Sets initial target position at the center
scene.add(spotLight.target);

// Spotlight Helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
scene.add(spotLightHelper);

// GUI Controls
const spot = gui.addFolder('Spot Light');
// spot.close();
spot.add(spotLight, 'visible').name('Enable Light');
spot.addColor(spotLight, 'color');
spot.add(spotLight, 'intensity').min(0).max(10).step(0.1);
spot.add(spotLightHelper, 'visible').name('Show Helper');

// Target Position Controls
const spotTarget = spot.addFolder('Spotlight Target');
spotTarget.close();
spotTarget.add(spotLight.target.position, 'x').min(-10).max(10).step(0.1).name('Target X');
spotTarget.add(spotLight.target.position, 'y').min(-10).max(10).step(0.1).name('Target Y');
spotTarget.add(spotLight.target.position, 'z').min(-10).max(10).step(0.1).name('Target Z');

// Ensure the light updates when the target moves
spotTarget.onChange(() => {
    spotLight.target.updateMatrixWorld();
    spotLightHelper.update();
});

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()