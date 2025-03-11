import * as THREE from 'three';

/**
 * Create a ground plane mesh
 * @param {number} width - The width of the ground
 * @param {number} depth - The depth of the ground
 * @param {number} color - The color of the ground
 * @returns {THREE.Mesh} The ground mesh
 */
export function createGroundMesh(width = 100, depth = 100, color = 0x888888) {
  const groundGeometry = new THREE.PlaneGeometry(width, depth);
  const groundMaterial = new THREE.MeshBasicMaterial({ color });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  return groundMesh;
}

/**
 * Create a capsule mesh for the character
 * @param {number} radius - The radius of the capsule
 * @param {number} height - The height of the capsule
 * @param {number} color - The color of the capsule
 * @returns {THREE.Mesh} The capsule mesh
 */
export function createCharacterMesh(radius = 0.5, height = 1, color = 0xff0000) {
  const capsuleGeometry = new THREE.CapsuleGeometry(radius, height, 16);
  const capsuleMaterial = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(capsuleGeometry, capsuleMaterial);
}

/**
 * Create a basic scene with lighting
 * @returns {THREE.Scene} The scene
 */
export function createScene() {
  const scene = new THREE.Scene();
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  return scene;
}

/**
 * Create a perspective camera
 * @param {number} fov - The field of view
 * @param {number} aspect - The aspect ratio
 * @param {number} near - The near clipping plane
 * @param {number} far - The far clipping plane
 * @returns {THREE.PerspectiveCamera} The camera
 */
export function createCamera(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 1000) {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

/**
 * Create a WebGL renderer
 * @param {number} width - The width of the renderer
 * @param {number} height - The height of the renderer
 * @returns {THREE.WebGLRenderer} The renderer
 */
export function createRenderer(width = window.innerWidth, height = window.innerHeight) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  return renderer;
} 