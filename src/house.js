import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {Timer} from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./public/textures/floor/alpha.webp')
const floorColorTexture = textureLoader.load('./public/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp')
const floorARMTexture = textureLoader.load('./public/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp')
const floorNormalTexture = textureLoader.load('./public/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp')
const floorDisplacementTexture = textureLoader.load('./public/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp')

floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping


floorColorTexture.colorSpace = THREE.SRGBColorSpace

// Wall
const wallColorTexture = textureLoader.load('./public/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp')
const wallARMTexture = textureLoader.load('./public/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp')
const wallNormalTexture = textureLoader.load('./public/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

// Roof
const roofColorTexture = textureLoader.load('./public/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp')
const roofARMTexture = textureLoader.load('./public/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp')
const roofNormalTexture = textureLoader.load('./public/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp')

roofColorTexture.colorSpace = THREE.SRGBColorSpace

roofColorTexture.repeat.set(3, 1)
roofARMTexture.repeat.set(3, 1)
roofNormalTexture.repeat.set(3, 1)

roofColorTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load('./public/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./public/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./public/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Grave
const graveColorTexture = textureLoader.load('./public/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp')
const graveARMTexture = textureLoader.load('./public/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp')
const graveNormalTexture = textureLoader.load('./public/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./public/textures/door/color.webp')
const doorAlphaTexture = textureLoader.load('./public/textures/door/alpha.webp')
const doorAmbientOcclusionTexture = textureLoader.load('./public/textures/door/ambientOcclusion.webp')
const doorHeightTexture = textureLoader.load('./public/textures/door/height.webp')
const doorNormalTexture = textureLoader.load('./public/textures/door/normal.webp')
const doorMetalnessTexture = textureLoader.load('./public/textures/door/metalness.webp')
const doorRoughnessTexture = textureLoader.load('./public/textures/door/roughness.webp')

doorColorTexture.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)


// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
)
walls.position.y += 1.25
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
)
roof.position.y = 2.5 + 0.75
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y = 1
door.position.z = 2 + 0.01
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75

house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    normalMap: graveNormalTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    // Add to the graves group
    graves.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#9aaaea', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for(const grave of graves.children)
{
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mappings
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Animate
 */
const timer = new Timer()

const tick = () => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Debug GUI Setup
 */

// Create folders for better organization
const floorFolder = gui.addFolder('Floor');
floorFolder.close()
const wallFolder = gui.addFolder('Wall');
wallFolder.close()
const roofFolder = gui.addFolder('Roof');
roofFolder.close()
const bushFolder = gui.addFolder('Bush');
bushFolder.close()
const gravesFolder = gui.addFolder('Graves');
gravesFolder.close()
const doorFolder = gui.addFolder('Door');
doorFolder.close()

// Debug Controls for Floor
floorFolder.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement Scale');
floorFolder.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias');

// Debug Controls for Walls
wallFolder.add(walls.scale, 'x', 1, 3, 0.01).name('Width');
wallFolder.add(walls.scale, 'y', 1, 3, 0.01).name('Height');
wallFolder.add(walls.scale, 'z', 1, 3, 0.01).name('Depth');

// Debug Controls for Roof
roofFolder.add(roof.scale, 'x', 1, 3, 0.01).name('Scale X');
roofFolder.add(roof.scale, 'y', 1, 3, 0.01).name('Scale Y');
roofFolder.add(roof.scale, 'z', 1, 3, 0.01).name('Scale Z');

// Debug Controls for Door
doorFolder.add(door.scale, 'x', 0.5, 2, 0.01).name('Scale X');
doorFolder.add(door.scale, 'y', 0.5, 2, 0.01).name('Scale Y');

// Debug Controls for Bushes
bushFolder.add(bush1.scale, 'x', 0.1, 1, 0.01).name('Bush 1 Scale X');
bushFolder.add(bush1.scale, 'y', 0.1, 1, 0.01).name('Bush 1 Scale Y');
bushFolder.add(bush1.scale, 'z', 0.1, 1, 0.01).name('Bush 1 Scale Z');

// Debug Controls for Graves
gravesFolder.add(graves.position, 'y', 0, 2, 0.01).name('Height');
gravesFolder.add(graves.scale, 'x', 0.5, 1.5, 0.01).name('Scale X');
gravesFolder.add(graves.scale, 'z', 0.5, 1.5, 0.01).name('Scale Z');

/**
 * Debug GUI Setup for Lights
 */
const lightFolder = gui.addFolder('Lights');
lightFolder.close()
const ambientLightFolder = lightFolder.addFolder('Ambient Light');
ambientLightFolder.close()
const directionalLightFolder = lightFolder.addFolder('Directional Light');
directionalLightFolder.close()
const doorLightFolder = lightFolder.addFolder('Door Light');
doorLightFolder.close()


// Debug Controls for Ambient Light
ambientLightFolder.add(ambientLight, 'intensity', 0, 2, 0.01).name('Intensity');
ambientLightFolder.addColor({color: ambientLight.color.getHex()}, 'color')
    .onChange(value => ambientLight.color.set(value))
    .name('Color');

// Debug Controls for Directional Light
directionalLightFolder.add(directionalLight, 'intensity', 0, 3, 0.01).name('Intensity');
directionalLightFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('Pos X');
directionalLightFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Pos Y');
directionalLightFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Pos Z');
directionalLightFolder.addColor({color: directionalLight.color.getHex()}, 'color')
    .onChange(value => directionalLight.color.set(value))
    .name('Color');

// Debug Controls for Door Light
doorLightFolder.add(doorLight, 'intensity', 0, 10, 0.1).name('Intensity');
doorLightFolder.add(doorLight.position, 'x', -5, 5, 0.1).name('Pos X');
doorLightFolder.add(doorLight.position, 'y', 0, 5, 0.1).name('Pos Y');
doorLightFolder.add(doorLight.position, 'z', -5, 5, 0.1).name('Pos Z');
doorLightFolder.addColor({color: doorLight.color.getHex()}, 'color')
    .onChange(value => doorLight.color.set(value))
    .name('Color');

/**
 * Debug GUI Setup for Ghost Lights
 */
const ghostFolder = gui.addFolder('Ghost Lights');
ghostFolder.close()

const ghost1Folder = ghostFolder.addFolder('Ghost 1');
const ghost2Folder = ghostFolder.addFolder('Ghost 2');
const ghost3Folder = ghostFolder.addFolder('Ghost 3');

// Debug Controls for Ghost 1
ghost1Folder.add(ghost1, 'intensity', 0, 10, 0.1).name('Intensity');
ghost1Folder.add(ghost1.position, 'x', -10, 10, 0.1).name('Pos X');
ghost1Folder.add(ghost1.position, 'y', 0, 10, 0.1).name('Pos Y');
ghost1Folder.add(ghost1.position, 'z', -10, 10, 0.1).name('Pos Z');
ghost1Folder.addColor({ color: ghost1.color.getHex() }, 'color')
    .onChange(value => ghost1.color.set(value))
    .name('Color');

// Debug Controls for Ghost 2
ghost2Folder.add(ghost2, 'intensity', 0, 10, 0.1).name('Intensity');
ghost2Folder.add(ghost2.position, 'x', -10, 10, 0.1).name('Pos X');
ghost2Folder.add(ghost2.position, 'y', 0, 10, 0.1).name('Pos Y');
ghost2Folder.add(ghost2.position, 'z', -10, 10, 0.1).name('Pos Z');
ghost2Folder.addColor({ color: ghost2.color.getHex() }, 'color')
    .onChange(value => ghost2.color.set(value))
    .name('Color');

// Debug Controls for Ghost 3
ghost3Folder.add(ghost3, 'intensity', 0, 10, 0.1).name('Intensity');
ghost3Folder.add(ghost3.position, 'x', -10, 10, 0.1).name('Pos X');
ghost3Folder.add(ghost3.position, 'y', 0, 10, 0.1).name('Pos Y');
ghost3Folder.add(ghost3.position, 'z', -10, 10, 0.1).name('Pos Z');
ghost3Folder.addColor({ color: ghost3.color.getHex() }, 'color')
    .onChange(value => ghost3.color.set(value))
    .name('Color');

/**
 * Debug GUI Setup for Shadows
 */
const shadowFolder = gui.addFolder('Shadows');
shadowFolder.close()

// Renderer Shadows
shadowFolder.add(renderer.shadowMap, 'enabled').name('Enable Shadows');

// Directional Light Shadow Settings
const directionalShadowFolder = shadowFolder.addFolder('Directional Light Shadow');
directionalShadowFolder.add(directionalLight.shadow.mapSize, 'width', 128, 2048, 128).name('Map Size Width');
directionalShadowFolder.add(directionalLight.shadow.mapSize, 'height', 128, 2048, 128).name('Map Size Height');
directionalShadowFolder.add(directionalLight.shadow.camera, 'top', 1, 20, 0.1).name('Camera Top');
directionalShadowFolder.add(directionalLight.shadow.camera, 'bottom', -20, -1, 0.1).name('Camera Bottom');
directionalShadowFolder.add(directionalLight.shadow.camera, 'left', -20, -1, 0.1).name('Camera Left');
directionalShadowFolder.add(directionalLight.shadow.camera, 'right', 1, 20, 0.1).name('Camera Right');
directionalShadowFolder.add(directionalLight.shadow.camera, 'near', 0.1, 10, 0.1).name('Camera Near');
directionalShadowFolder.add(directionalLight.shadow.camera, 'far', 5, 50, 0.1).name('Camera Far');

// Ghosts Shadow Settings
const ghostShadowFolder = shadowFolder.addFolder('Ghosts Shadow');

[ghost1, ghost2, ghost3].forEach((ghost, index) => {
    const ghostFolder = ghostShadowFolder.addFolder(`Ghost ${index + 1}`);
    ghostFolder.add(ghost.shadow.mapSize, 'width', 128, 1024, 128).name('Map Size Width');
    ghostFolder.add(ghost.shadow.mapSize, 'height', 128, 1024, 128).name('Map Size Height');
    ghostFolder.add(ghost.shadow.camera, 'far', 1, 20, 0.1).name('Camera Far');
});

// Object Shadows Toggle
const objectShadowsFolder = shadowFolder.addFolder('Objects Shadows');
objectShadowsFolder.add(walls, 'castShadow').name('Walls Cast Shadow');
objectShadowsFolder.add(walls, 'receiveShadow').name('Walls Receive Shadow');
objectShadowsFolder.add(roof, 'castShadow').name('Roof Cast Shadow');
objectShadowsFolder.add(floor, 'receiveShadow').name('Floor Receive Shadow');

// Graves Shadow Settings
const gravesShadowFolder = shadowFolder.addFolder('Graves Shadows');
for (const [index, grave] of graves.children.entries()) {
    gravesShadowFolder.add(grave, 'castShadow').name(`Grave ${index + 1} Cast`);
    gravesShadowFolder.add(grave, 'receiveShadow').name(`Grave ${index + 1} Receive`);
}

/**
 * Debug GUI Setup for Sky
 */
const skyFolder = gui.addFolder('Sky');
skyFolder.close()

// Debug Controls for Sky Properties
skyFolder.add(sky.material.uniforms['turbidity'], 'value', 0, 20, 0.1).name('Turbidity');
skyFolder.add(sky.material.uniforms['rayleigh'], 'value', 0, 10, 0.1).name('Rayleigh');
skyFolder.add(sky.material.uniforms['mieCoefficient'], 'value', 0, 0.5, 0.01).name('Mie Coefficient');
skyFolder.add(sky.material.uniforms['mieDirectionalG'], 'value', 0, 1, 0.01).name('Mie Directional G');

// Debug Controls for Sun Position
const sunFolder = skyFolder.addFolder('Sun Position');
sunFolder.add(sky.material.uniforms['sunPosition'].value, 'x', -1, 1, 0.01).name('Pos X');
sunFolder.add(sky.material.uniforms['sunPosition'].value, 'y', -1, 1, 0.01).name('Pos Y');
sunFolder.add(sky.material.uniforms['sunPosition'].value, 'z', -1, 1, 0.01).name('Pos Z');




gui.close(); // Closes GUI by default, can be opened manually