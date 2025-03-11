// Use dynamic import for Rapier3D
let RAPIER;

/**
 * Initialize the physics world with gravity
 * @returns {Promise<RAPIER.World>} The physics world
 */
export async function initPhysicsWorld() {
  // Dynamically import Rapier
  RAPIER = await import('@dimforge/rapier3d');
  // Initialize Rapier
  await RAPIER.init();
  return new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
}

/**
 * Create a ground rigid body
 * @param {RAPIER.World} world - The physics world
 * @returns {RAPIER.RigidBody} The ground rigid body
 */
export function createGround(world) {
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
 * @param {RAPIER.World} world - The physics world
 * @param {number} x - Initial x position
 * @param {number} y - Initial y position
 * @param {number} z - Initial z position
 * @returns {RAPIER.RigidBody} The character rigid body
 */
export function createCharacter(world, x = 0, y = 2, z = 0) {
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
 * @param {RAPIER.World} world - The physics world
 * @param {RAPIER.RigidBody} characterBody - The character rigid body
 * @param {number} rayLength - The length of the ray to cast
 * @returns {boolean} Whether the character is on the ground
 */
export function checkGroundContact(world, characterBody, rayLength = 1.6) {
  const ray = new RAPIER.Ray(
    characterBody.translation(),
    { x: 0, y: -1, z: 0 }
  );
  const toi = world.castRay(ray, rayLength, true);
  return toi !== null && toi.toi < rayLength;
}

/**
 * Apply movement to the character
 * @param {RAPIER.RigidBody} characterBody - The character rigid body
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
 * @param {RAPIER.RigidBody} characterBody - The character rigid body
 * @param {number} jumpForce - The force to apply
 */
export function applyJump(characterBody, jumpForce = 5) {
  const currentVel = characterBody.linvel();
  characterBody.setLinvel(
    { x: currentVel.x, y: jumpForce, z: currentVel.z },
    true
  );
} 