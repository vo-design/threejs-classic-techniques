import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 300,
    title: 'Light'
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Creates ambient light with white color and intensity 1.5
ambientLight.visible = false; // Light is disabled by default
scene.add(ambientLight);

// GUI Controls
const ambient = gui.addFolder('Ambient Light');
ambient.add(ambientLight, 'visible').name('Enable Light'); // Toggle light on/off
ambient.addColor(ambientLight, 'color'); // Change light color
ambient.add(ambientLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9); // Creates directional light with blue-green tint and intensity 0.9
directionalLight.position.set(1, 0.25, 0); // Sets the light position in the scene
directionalLight.visible = false; // Light is disabled by default
scene.add(directionalLight);

// GUI Controls
const directional = gui.addFolder('Directional Light');
directional.add(directionalLight, 'visible').name('Enable Light'); // Toggle light on/off
directional.addColor(directionalLight, 'color'); // Change light color
directional.add(directionalLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity
directional.add(directionalLight.position, 'x').min(-10).max(10).step(0.1); // Move light along X-axis
directional.add(directionalLight.position, 'y').min(-10).max(10).step(0.1); // Move light along Y-axis
directional.add(directionalLight.position, 'z').min(-10).max(10).step(0.1); // Move light along Z-axis

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9); // Creates hemisphere light with red sky color and blue ground color
hemisphereLight.visible = true; // Light is enabled by default
scene.add(hemisphereLight);

// GUI Controls
const hemisphere = gui.addFolder('Hemisphere Light');
hemisphere.add(hemisphereLight, 'visible').name('Enable Light'); // Toggle light on/off
hemisphere.addColor(hemisphereLight, 'color').name('Sky Color'); // Change sky color
hemisphere.addColor(hemisphereLight, 'groundColor').name('Ground Color'); // Change ground color
hemisphere.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity



// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

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
sphere.position.x = - 1.5

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
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

const tick = () =>
{
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