import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffffff',
    pointColor: '#ffffff',
}

const debugObject = {
    displacementScale: 0.3,
    displacementBias: -0.2,
    wireframe: false,
    showGrid: false,
    positionX: 2,
    positionY: 2,
    positionZ: 1
};

gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
})

gui.close()

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Floor
const floorAlphaTexture = textureLoader.load('./textures/floor/alpha.webp')







// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    wireframe: false
})

// Objects
const objectsDistance = 4
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.25, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material)
const mesh3 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6, 6, 6, 6), material)

mesh1.position.set(2, -objectsDistance * 0, 0)
mesh2.position.set(-2, -objectsDistance * 1, 0)
mesh3.position.set(2, -objectsDistance * 2, 0)

scene.add(mesh1, mesh2, mesh3)
const sectionMeshes = [mesh1, mesh2, mesh3]


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        color: '#ffffff',
    })
)
floor.rotation.x = -Math.PI * 0.5

floor.position.set(1.6, -1.1, 1.3)

scene.add(floor)

// Position Debug Controls
gui.add(debugObject, 'positionX', -5, 5, 0.1).onChange((value) => {
    floor.position.x = value;
});
gui.add(debugObject, 'positionY', -5, 5, 0.1).onChange((value) => {
    floor.position.y = value;
});
gui.add(debugObject, 'positionZ', -5, 5, 0.1).onChange((value) => {
    floor.position.z = value;
});



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 300)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

/**
 * Particles
 */
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.pointColor,
    sizeAttenuation: true,
    size: 0.03,
    transparent: true,
    opacity: 0.8
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = { width: window.innerWidth, height: window.innerHeight }

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll Effects
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if (newSection !== currentSection) {
        currentSection = newSection

        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power4.out',
            z: '+=1.5'
        })
    }
})

/**
 * Cursor Effect
 */
const cursor = { x: 0, y: 0 }

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = -scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Floating & Pulsating Objects
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
        mesh.position.y += Math.sin(elapsedTime + mesh.position.x) * 0.005
        mesh.scale.set(
            1 + Math.sin(elapsedTime + mesh.position.x) * 0.05,
            1 + Math.sin(elapsedTime + mesh.position.x) * 0.05,
            1 + Math.sin(elapsedTime + mesh.position.x) * 0.05
        )
    }

    // Animate Particles
    const positions = particles.geometry.attributes.position.array
    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.002
    }
    particles.geometry.attributes.position.needsUpdate = true

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()