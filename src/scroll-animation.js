import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()
gui.close()

const parameters = {
    materialColor: '#ffffff'
}

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * Objects
 */

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    wireframe: true
})

// Objects
const objectsDistance = 6;
const sectionMeshes = [];

// Create an array of object properties for easier debugging
const objects = [
    {
        name: "Torus",
        mesh: new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.25, 16, 60), material),
        position: [2, 0, -1]
    },
    {
        name: "Sphere",
        mesh: new THREE.Mesh(new THREE.SphereGeometry(0.65, 32, 32), material),
        position: [-2, -objectsDistance, -1]
    },
    {
        name: "Box",
        mesh: new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9, 6, 6, 6), material),
        position: [2, -objectsDistance * 2, -1]
    }
];

const objectFolder = gui.addFolder('Figures');
objectFolder.close();

// Loop through each object and set up properties
objects.forEach((obj, index) => {
    obj.mesh.position.set(obj.position[0], obj.position[1], -5); // Start from z = -5
    obj.mesh.castShadow = true; // Enable shadow casting
    scene.add(obj.mesh);
    sectionMeshes.push(obj.mesh);

    const folder = objectFolder.addFolder(obj.name);
    folder.close();
    folder.add(obj.mesh.position, 'x', -5, 5, 0.1).name('Position X');
    folder.add(obj.mesh.position, 'y', -10, 5, 0.1).name('Position Y');
    folder.add(obj.mesh.position, 'z', -10, 5, 0.1).name('Position Z');
});

// Add a plane for each figure
const planeSize = 4;
const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
});

objects.forEach((obj) => {
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI * 0.5;
    plane.position.set(obj.position[0], obj.position[1] - 1, obj.position[2]);
    plane.receiveShadow = true;
    scene.add(plane);
});

/**
 * Lights
 */
const lightFolder = gui.addFolder('Lights');
lightFolder.close();

const spotlights = objects.map((obj, index) => {
    const spotLight = new THREE.SpotLight("#ffffff", 10, 5.1, 0, 0.78, 1); // Start with angle = 0
    spotLight.position.set(obj.position[0], obj.position[1] + 3, obj.position[2]);
    spotLight.visible = true;
    spotLight.castShadow = true;

    // Configure shadow properties
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.camera.fov = 30;
    spotLight.shadow.bias = -0.001;

    scene.add(spotLight);

    // Spotlight Target
    spotLight.target.position.set(obj.position[0], obj.position[1], obj.position[2]);
    scene.add(spotLight.target);

    const folder = lightFolder.addFolder(obj.name);
    folder.close();
    folder.add(spotLight, 'intensity', 0, 20, 0.1).name('Intensity');
    folder.add(spotLight, 'angle', 0, Math.PI / 2, 0.01).name('Angle');
    folder.add(spotLight.position, 'x', -10, 10, 0.1).name('Position X');
    folder.add(spotLight.position, 'y', -10, 10, 0.1).name('Position Y');
    folder.add(spotLight.position, 'z', -10, 10, 0.1).name('Position Z');
    folder.add(spotLight, 'visible').name('Visible');

    return spotLight;
});



/**
 * Sizes
 */
const sizes = { width: window.innerWidth, height: window.innerHeight };

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Function to animate floating motion
 */
const floatAnimation = (object) => {
    gsap.to(object.position, {
        duration: 2,
        y: object.position.y + 0.2, // Move slightly up
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1 // Loop animation infinitely
    });
};

/**
 * Scroll Effects
 */
let scrollY = window.scrollY;
let currentSection = Math.round(scrollY / sizes.height);
const sections = document.querySelectorAll(".section");

/**
 * Function to update active section
 */
const updateActiveSection = () => {
    let scrollY = window.scrollY;
    let newSectionIndex = Math.round(scrollY / sizes.height);

    if (newSectionIndex !== currentSection) {
        sections.forEach((section, index) => {
            if (index === newSectionIndex) {
                section.classList.add("active");
                animateSection(index);
            } else {
                section.classList.remove("active");
            }
        });
        currentSection = newSectionIndex;
    }
};

/**
 * Function to animate the current section on scroll or load
 */
const animateSection = (sectionIndex) => {
    if (sectionIndex < 0 || sectionIndex >= sectionMeshes.length) return;

    gsap.fromTo(
        sectionMeshes[sectionIndex].position,
        { z: -5 },
        {
            duration: 1.5,
            delay: 1,
            z: objects[sectionIndex].position[2],
            ease: 'power2.out',
        }
    );

    gsap.fromTo(
        spotlights[sectionIndex],
        { angle: 0 },
        {
            duration: 1,
            delay: 0.5,
            angle: 0.35,
            ease: 'power2.out'
        }
    );

    gsap.to(sectionMeshes[sectionIndex].rotation, {
        duration: 4.5,
        ease: 'power4.out',
        z: '+=5.5',
    });

    // Start floating animation for current object
    floatAnimation(sectionMeshes[sectionIndex]);
};

// **Run animation on page load for the first visible section**
animateSection(currentSection);
sections[currentSection]?.classList.add("active");

// **Add event listener for scroll updates**
window.addEventListener("scroll", updateActiveSection);

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);

    if (newSection !== currentSection) {
        currentSection = newSection;
        animateSection(currentSection);
    }
});

/**
 * Animate
 */

const tick = () => {

    // Animate camera
    camera.position.y = -scrollY / sizes.height * objectsDistance

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()