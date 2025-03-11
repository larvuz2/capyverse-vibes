/**
 * Create and initialize keyboard controls
 * @returns {Object} The keyboard controls object
 */
export function createKeyboardControls() {
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

  return keys;
}

/**
 * Calculate movement direction based on keyboard input
 * @param {Object} keys - The keyboard controls object
 * @param {number} speed - The movement speed
 * @returns {Object} The movement direction
 */
export function calculateMovementDirection(keys, speed = 5) {
  const moveDirection = { x: 0, z: 0 };

  if (keys.w) moveDirection.z = -speed;
  if (keys.s) moveDirection.z = speed;
  if (keys.a) moveDirection.x = -speed;
  if (keys.d) moveDirection.x = speed;

  return moveDirection;
}

/**
 * Handle window resize for the camera and renderer
 * @param {THREE.PerspectiveCamera} camera - The camera to update
 * @param {THREE.WebGLRenderer} renderer - The renderer to update
 */
export function handleWindowResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/**
 * Update camera position to follow a target
 * @param {THREE.Camera} camera - The camera to update
 * @param {Object} targetPosition - The position to follow
 * @param {number} offsetY - The vertical offset
 * @param {number} offsetZ - The backward offset
 */
export function updateCameraPosition(camera, targetPosition, offsetY = 5, offsetZ = 10) {
  camera.position.set(
    targetPosition.x,
    targetPosition.y + offsetY,
    targetPosition.z + offsetZ
  );
  camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
} 