import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics setup
let world, characterBody, groundBody;
let moveDirection = { x: 0, z: 0 };
let canJump = false;

async function initPhysics() {
    await RAPIER.init();
    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    
    // Ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);
    
    groundBody = world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed()
    );
    world.createCollider(
        RAPIER.ColliderDesc.cuboid(50, 0.1, 50),
        groundBody
    );

    // Character (Capsule)
    const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 1, 16);
    const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    scene.add(capsuleMesh);
    
    characterBody = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, 2, 0)
    );
    world.createCollider(
        RAPIER.ColliderDesc.capsule(0.5, 0.5),
        characterBody
    );
    
    // Store mesh reference in body for updating position
    characterBody.userData = { mesh: capsuleMesh };
}

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Keyboard controls
const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
};

window.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
        case ' ': keys.space = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 'a': keys.a = false; break;
        case 's': keys.s = false; break;
        case 'd': keys.d = false; break;
        case ' ': keys.space = false; break;
    }
});

function updateMovement() {
    moveDirection.x = 0;
    moveDirection.z = 0;
    const speed = 5;

    if (keys.w) moveDirection.z = -speed;
    if (keys.s) moveDirection.z = speed;
    if (keys.a) moveDirection.x = -speed;
    if (keys.d) moveDirection.x = speed;

    // Apply movement
    const currentVel = characterBody.linvel();
    characterBody.setLinvel(
        { x: moveDirection.x, y: currentVel.y, z: moveDirection.z },
        true
    );

    // Jump
    if (keys.space && canJump) {
        characterBody.setLinvel({ x: currentVel.x, y: 5, z: currentVel.z }, true);
        canJump = false;
    }
}

function checkGroundCollision() {
    const ray = new RAPIER.Ray(
        characterBody.translation(),
        { x: 0, y: -1, z: 0 }
    );
    const toi = world.castRay(ray, 1.6, true);
    canJump = toi !== null && toi.toi < 1.6;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Step physics
    world.step();
    
    // Update character position
    const position = characterBody.translation();
    characterBody.userData.mesh.position.set(position.x, position.y, position.z);
    
    updateMovement();
    checkGroundCollision();
    
    // Camera follow
    camera.position.set(
        position.x,
        position.y + 5,
        position.z + 10
    );
    camera.lookAt(position.x, position.y, position.z);
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start
initPhysics().then(() => animate());