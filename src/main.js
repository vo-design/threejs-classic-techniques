import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 300,
    title: 'Lights'
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
ambient.close()
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
directional.close()
directional.add(directionalLight, 'visible').name('Enable Light'); // Toggle light on/off
directional.addColor(directionalLight, 'color'); // Change light color
directional.add(directionalLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity
directional.add(directionalLight.position, 'x').min(-10).max(10).step(0.1); // Move light along X-axis
directional.add(directionalLight.position, 'y').min(-10).max(10).step(0.1); // Move light along Y-axis
directional.add(directionalLight.position, 'z').min(-10).max(10).step(0.1); // Move light along Z-axis

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9); // Creates hemisphere light with red sky color and blue ground color
hemisphereLight.visible = false; // Light is enabled by default
scene.add(hemisphereLight);

// GUI Controls
const hemisphere = gui.addFolder('Hemisphere Light');
hemisphere.close()
hemisphere.add(hemisphereLight, 'visible').name('Enable Light'); // Toggle light on/off
hemisphere.addColor(hemisphereLight, 'color').name('Sky Color'); // Change sky color
hemisphere.addColor(hemisphereLight, 'groundColor').name('Ground Color'); // Change ground color
hemisphere.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity

// Point light
const pointLight = new THREE.PointLight(0xff9000, 1.5, 0, 2); // Creates a point light with orange color, intensity 1.5, no distance limit, and decay rate of 2
pointLight.position.set(1, -0.5, 1); // Sets the light position in the scene
pointLight.visible = false; // Light is enabled by default
scene.add(pointLight);

// GUI Controls
const point = gui.addFolder('Point Light');
point.close()
point.add(pointLight, 'visible').name('Enable Light'); // Toggle light on/off
point.addColor(pointLight, 'color'); // Change light color
point.add(pointLight, 'intensity').min(0).max(3).step(0.001); // Adjust light intensity
point.add(pointLight, 'distance').min(0).max(50).step(0.1).name('Distance'); // Adjust light distance (0 = infinite range)
point.add(pointLight, 'decay').min(0).max(5).step(0.1).name('Decay'); // Adjust how quickly the light fades

// Position Controls
point.add(pointLight.position, 'x').min(-10).max(10).step(0.1).name('Position X'); // Move light along X-axis
point.add(pointLight.position, 'y').min(-10).max(10).step(0.1).name('Position Y'); // Move light along Y-axis
point.add(pointLight.position, 'z').min(-10).max(10).step(0.1).name('Position Z'); // Move light along Z-axis


// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1); // Creates a rectangular area light with purple color, intensity 6, width 1, and height 1
rectAreaLight.position.set(-1.5, 0, 1.5); // Sets the light position in the scene
rectAreaLight.lookAt(new THREE.Vector3()); // Ensures the light is facing the center
rectAreaLight.visible = false; // Light is enabled by default
scene.add(rectAreaLight);

// GUI Controls
const rectArea = gui.addFolder('Rect Area Light');
rectArea.close()
rectArea.add(rectAreaLight, 'visible').name('Enable Light'); // Toggle light on/off
rectArea.addColor(rectAreaLight, 'color'); // Change light color
rectArea.add(rectAreaLight, 'intensity').min(0).max(10).step(0.1); // Adjust light intensity
rectArea.add(rectAreaLight, 'width').min(0.1).max(5).step(0.1).name('Width'); // Adjust light width
rectArea.add(rectAreaLight, 'height').min(0.1).max(5).step(0.1).name('Height'); // Adjust light height

// Position Controls
rectArea.add(rectAreaLight.position, 'x').min(-10).max(10).step(0.1).name('Position X'); // Move light along X-axis
rectArea.add(rectAreaLight.position, 'y').min(-10).max(10).step(0.1).name('Position Y'); // Move light along Y-axis
rectArea.add(rectAreaLight.position, 'z').min(-10).max(10).step(0.1).name('Position Z'); // Move light along Z-axis

// Spotlight
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1);
// Creates a spotlight with green color, intensity 4.5, max distance 10, angle π*0.1, penumbra 0.25, and decay 1
spotLight.position.set(0, 2, 3); // Sets the light position in the scene
spotLight.visible = true; // Light is enabled by default
scene.add(spotLight);

// Spotlight Target
spotLight.target.position.set(0, 0, 0); // Sets initial target position at the center
scene.add(spotLight.target); // Adds the target to the scene

// GUI Controls
const spot = gui.addFolder('Spot Light');
spot.add(spotLight, 'visible').name('Enable Light'); // Toggle light on/off
spot.addColor(spotLight, 'color'); // Change light color
spot.add(spotLight, 'intensity').min(0).max(10).step(0.1); // Adjust light intensity
spot.add(spotLight, 'distance').min(0).max(50).step(0.1).name('Distance'); // Adjust how far the light reaches
spot.add(spotLight, 'angle').min(0).max(Math.PI / 2).step(0.01).name('Angle'); // Adjust the cone opening angle
spot.add(spotLight, 'penumbra').min(0).max(1).step(0.01).name('Penumbra'); // Adjust light softness at the edges
spot.add(spotLight, 'decay').min(0).max(5).step(0.1).name('Decay'); // Adjust light fading over distance

// Position Controls
spot.add(spotLight.position, 'x').min(-10).max(10).step(0.1).name('Position X'); // Move light along X-axis
spot.add(spotLight.position, 'y').min(-10).max(10).step(0.1).name('Position Y'); // Move light along Y-axis
spot.add(spotLight.position, 'z').min(-10).max(10).step(0.1).name('Position Z'); // Move light along Z-axis

// Target Position Controls
const spotTarget = spot.addFolder('Spotlight Target');
spotTarget.add(spotLight.target.position, 'x').min(-10).max(10).step(0.1).name('Target X'); // Move target along X-axis
spotTarget.add(spotLight.target.position, 'y').min(-10).max(10).step(0.1).name('Target Y'); // Move target along Y-axis
spotTarget.add(spotLight.target.position, 'z').min(-10).max(10).step(0.1).name('Target Z'); // Move target along Z-axis

// Ensure the light updates when the target moves
spotTarget.onChange(() => spotLight.target.updateMatrixWorld());


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