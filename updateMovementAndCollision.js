/**
 * This is the function that you need to implement. The function is responsible for all the updates such as
 * Playable object movement, gravity, collision detection and so on.
 * @param deltaTime: Passed time since last update.
 * @param keyPresses: Array of booleans indicating the keys that are currently pressed. You can use
 * this data of keys A,D and W press statuses as follows. For example if you want to see if key A is pressed, then
 * you can check to see if keyPressed.A is true or false. If true then A is pressed, if false then it is not.
 * @param playableObject: This is the only object that you need to apply the gravity movement on. This is going to be the
 * only object that moves, the rest of the objects are static. Please see script.js to see the structure of this object.
 * @param listOfAllObjects: This is an array of static objects that the playable object can collide with.
 * Please see script.js to see the structure of these objects. Ideally the only attributes that you should care about are
 * x,y,width and height. All the objects in these array will have these attributes.
 * @param boundingBox: Bounding box of the canvas in the following order [left, bottom, right, top]
 */
let speedOfPlayableShape = 0.15;
let jumpVelocity = .7;
let velocityX = 0;

function updateMovementAndCollision(deltaTime, keyPresses, playableObject, listOfAllObjects, boundingBox) {
  let gravity = 0.001; // Gravity value for calculating the downward velocity. You can change it if you want

  playableObject.velocity += gravity * deltaTime;

  playableObject.isOnSurface = false; // Flag to indicate if the object is on top of solid surface. You can modify it if you want.

  // Check if playableObject is on surface of listOfAllObjects.
  for (let i = 0; i < listOfAllObjects.length; i++) {
    let itemObject = listOfAllObjects[i];

    if ((playableObject.x + playableObject.width > itemObject.x) && (playableObject.x < itemObject.x + itemObject.width)) {
      let delta = itemObject.y - playableObject.y - playableObject.height;

      if (delta <= 1) {
        playableObject.isOnSurface = true;
      }
    }
  }


  // TODO: Implement the character movement.
  // Pressing W will make the playableObject jump.
  // Object can`t jump if it is in the air.
  if (keyPresses.W && playableObject.isOnSurface) {
    playableObject.velocity = -jumpVelocity;
  }


  // Pressing A will make the playableObject to move left.
  // Make sure the object can`t enter the bounding box.

  if (keyPresses.A) {
    playableObject.acceleration = -1.0;

    if (playableObject.x <= boundingBox[0]) {
      velocityX = 0;
    }
  }

  // Pressing D will make the playableObject to move right.
  // Make sure the object can`t enter the bounding box.
  if (keyPresses.D) {
    playableObject.acceleration = 1.0;

    if (playableObject.x + playableObject.width >= (boundingBox[0] + boundingBox[2])) {
      velocityX = 0;
    }
  }

  velocityX = speedOfPlayableShape * playableObject.acceleration;
  // Reduce acceleration
  playableObject.acceleration /= 2;

  // TODO: Implement collision detection and correction.
  let eX = playableObject.x + velocityX * deltaTime;
  let eY = playableObject.y + playableObject.velocity * deltaTime;

  //The playable character should also not be able to exit the bounding box of the canvas
  if (eX < boundingBox[0]) {
    velocityX = 0;
    playableObject.x = boundingBox[0];
  }

  if (eX + playableObject.width > boundingBox[0] + boundingBox[2]) {
    velocityX = 0;
    playableObject.x = boundingBox[0] + boundingBox[2] - playableObject.width;
  }

  if (eY < boundingBox[3]) {
    playableObject.velocity = 0;
    playableObject.y = boundingBox[3];
  }

  if (eY + playableObject.height > boundingBox[3] + boundingBox[1]) {
    playableObject.velocity = 0;
  }

  // When our playableObject encounters any other object from the list of listOfAllObjects, then the collision
  // Should be detected and corrected. For example when the object falls down to the ground due to gravity, the
  // Collision detection should detect this and prevent the playableObject from falling through other objects
  // by correcting the position and velocity of the playableObject.
  for (let i = 0; i < listOfAllObjects.length; i++) {
    let itemObject = listOfAllObjects[i];
    // Collision detection on top side
    if ((playableObject.y + playableObject.height <= itemObject.y) && (eY + playableObject.height > itemObject.y) && (eX + playableObject.width > itemObject.x) && (eX < itemObject.x + itemObject.width)) {
      playableObject.velocity = 0;
      playableObject.y = itemObject.y - playableObject.height;
    }

    // Collision detection on left side
    if ((playableObject.x + playableObject.width <= itemObject.x) && (eX + playableObject.width > itemObject.x) && (eY + playableObject.height > itemObject.y) && (eY < itemObject.y + itemObject.height)) {
      velocityX = 0;
      playableObject.x = itemObject.x - playableObject.width;
    }

    // Collision detection on bottom side
    if ((playableObject.y >= itemObject.y + itemObject.height) && (eY < itemObject.y + itemObject.height) && (eX + playableObject.width > itemObject.x) && (eX < itemObject.x + itemObject.width)) {
      playableObject.velocity = 0;
      playableObject.y = itemObject.y + itemObject.height;
    }

    // Collision detection on right side
    if ((playableObject.x >= itemObject.x + itemObject.width) && (eX < itemObject.x + itemObject.width) && (eY + playableObject.height > itemObject.y) && (eY < itemObject.y + itemObject.height)) {
      velocityX = 0;
      playableObject.x = itemObject.x + itemObject.width;
    }
  }

  playableObject.x = playableObject.x + velocityX * deltaTime;
  playableObject.y = playableObject.y + playableObject.velocity * deltaTime;

}