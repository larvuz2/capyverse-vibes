import * as THREE from 'three';
import './style.css';
import { 
  initPhysicsWorld, 
  createGround, 
  createCharacter, 
  checkGroundContact, 
  applyMovement, 
  applyJump 
} from './utils/physics.js';
import { 
  createKeyboardControls, 
  calculateMovementDirection, 
  handleWindowResize, 
  updateCameraPosition 
} from './utils/controls.js';
import { 
  createGroundMesh, 
  createCharacterMesh, 
  createScene, 
  createCamera, 
  createRenderer 
} from './utils/objects.js';

// Scene setup
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
document.body.appendChild(renderer.domElement);

// Physics variables
let world, characterBody, groundBody;
let canJump = false;

// Keyboard controls
const keys = createKeyboardControls();

// Handle window resize
handleWindowResize(camera, renderer);

// Loading screen elements
const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');

// Initialize the game
async function init() {
  try {
    // Show loading progress
    updateLoadingProgress(10, 'Initializing physics...');
    console.log('Initializing physics...');
    
    // Initialize physics
    world = await initPhysicsWorld();
    updateLoadingProgress(40, 'Creating world...');
    
    // Create ground
    groundBody = createGround(world);
    const groundMesh = createGroundMesh();
    scene.add(groundMesh);
    updateLoadingProgress(60, 'Creating character...');
    
    // Create character
    characterBody = createCharacter(world);
    const characterMesh = createCharacterMesh();
    scene.add(characterMesh);
    
    // Store mesh reference in body for updating position
    characterBody.userData = { mesh: characterMesh };
    
    // Set initial camera position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    updateLoadingProgress(90, 'Finalizing...');
    
    // Hide loading screen
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.display = 'none';
      }
      // Start animation loop
      animate();
    }, 500);
  } catch (error) {
    console.error('Error initializing game:', error);
    showErrorMessage(`Failed to initialize the physics engine: ${error.message}`);
  }
}

function updateLoadingProgress(percent, message) {
  if (loadingProgress) {
    loadingProgress.style.width = `${percent}%`;
    console.log(message);
  }
}

function showErrorMessage(message) {
  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div style="color: red; text-align: center; padding: 20px;">
        <h2>Error</h2>
        <p>${message}</p>
        <p>This application requires WebAssembly support. Please use a modern browser.</p>
        <p>If you're using a modern browser, try disabling any content blockers or security extensions.</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `;
  }
}

function animate() {
  requestAnimationFrame(animate);
  
  try {
    // Step physics
    world.step();
    
    // Update character position
    const position = characterBody.translation();
    characterBody.userData.mesh.position.set(position.x, position.y, position.z);
    
    // Calculate movement direction based on keyboard input
    const moveDirection = calculateMovementDirection(keys);
    
    // Apply movement to character
    applyMovement(characterBody, moveDirection);
    
    // Check if character is on the ground
    canJump = checkGroundContact(world, characterBody);
    
    // Apply jump if space is pressed and character is on the ground
    if (keys.space && canJump) {
      applyJump(characterBody);
      canJump = false;
    }
    
    // Update camera to follow character
    updateCameraPosition(camera, position);
    
    // Render the scene
    renderer.render(scene, camera);
  } catch (error) {
    console.error('Error in animation loop:', error);
  }
}

// Start the game
init(); 