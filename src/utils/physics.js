// We'll use dynamic import for Rapier
let RAPIER = null;

/**
 * Initialize the physics world with gravity
 * @returns {Promise<Object>} The physics world
 */
export async function initPhysicsWorld() {
  try {
    // Dynamically import Rapier
    const rapierModule = await import('@dimforge/rapier3d/rapier.js');
    
    // Initialize Rapier
    await rapierModule.init();
    
    // Store the module for later use
    RAPIER = rapierModule;
    
    // Create a new physics world with gravity
    return new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
  } catch (error) {
    console.error('Failed to initialize Rapier:', error);
    throw new Error('Failed to initialize physics engine: ' + error.message);
  }
}

/**
 * Create a ground rigid body
 * @param {Object} world - The physics world
 * @returns {Object} The ground rigid body
 */
export function createGround(world) {
  if (!RAPIER) {
    throw new Error('Physics engine not initialized');
  }
  
  const groundBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed()
  );
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(50, 0.1, 50),
    groundBody
  );
  return groundBody;
}

/**
 * Create a character rigid body
 * @param {Object} world - The physics world
 * @param {number} x - Initial x position
 * @param {number} y - Initial y position
 * @param {number} z - Initial z position
 * @returns {Object} The character rigid body
 */
export function createCharacter(world, x = 0, y = 2, z = 0) {
  if (!RAPIER) {
    throw new Error('Physics engine not initialized');
  }
  
  const characterBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y, z)
  );
  world.createCollider(
    RAPIER.ColliderDesc.capsule(0.5, 0.5),
    characterBody
  );
  return characterBody;
}

/**
 * Check if the character is on the ground
 * @param {Object} world - The physics world
 * @param {Object} characterBody - The character rigid body
 * @param {number} rayLength - The length of the ray to cast
 * @returns {boolean} Whether the character is on the ground
 */
export function checkGroundContact(world, characterBody, rayLength = 1.6) {
  if (!RAPIER) {
    return false;
  }
  
  const ray = new RAPIER.Ray(
    characterBody.translation(),
    { x: 0, y: -1, z: 0 }
  );
  const toi = world.castRay(ray, rayLength, true);
  return toi !== null && toi.toi < rayLength;
}

/**
 * Apply movement to the character
 * @param {Object} characterBody - The character rigid body
 * @param {Object} moveDirection - The direction to move in
 * @param {number} moveDirection.x - The x component of the direction
 * @param {number} moveDirection.z - The z component of the direction
 */
export function applyMovement(characterBody, moveDirection) {
  const currentVel = characterBody.linvel();
  characterBody.setLinvel(
    { x: moveDirection.x, y: currentVel.y, z: moveDirection.z },
    true
  );
}

/**
 * Apply a jump force to the character
 * @param {Object} characterBody - The character rigid body
 * @param {number} jumpForce - The force to apply
 */
export function applyJump(characterBody, jumpForce = 5) {
  const currentVel = characterBody.linvel();
  characterBody.setLinvel(
    { x: currentVel.x, y: jumpForce, z: currentVel.z },
    true
  );
} 