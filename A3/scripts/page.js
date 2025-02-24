/* ------------- Winter 2024 EECS 493 Assignment 3 Starter Code ------------ */

/* ------------------------ GLOBAL HELPER VARAIBLES ------------------------ */
// Difficulty Helpers
let astProjectileSpeed = 3;            // easy: 1, norm: 3, hard: 5

// Game Object Helpers
let currentAsteroid = 1;
const AST_OBJECT_REFRESH_RATE = 15;
const maxPersonPosX = 1218;
const maxPersonPosY = 658;
const PERSON_SPEED = 5;                // #pixels each time player moves by
const portalOccurrence = 15000;        // portal spawns every 15 seconds
const portalGone = 5000;               // portal disappears in 5 seconds
const shieldOccurrence = 10000;        // shield spawns every 10 seconds
const shieldGone = 5000;               // shield disappears in 5 seconds
let shielded = 0;
// Movement Helpers
let LEFT = false;
let RIGHT = false;
let UP = false;
let DOWN = false;
//
let die = 0;
let intervalAst;
let intervalShi;
let intervalPor;
let intervalRoc;
let intervalCol;
let intervalSco;
let sco = 0;
let lel = 1;
let dan = 0;
let played = 0;

// TODO: ADD YOUR GLOBAL HELPER VARIABLES (IF NEEDED)

/* --------------------------------- MAIN ---------------------------------- */
$(document).ready(function () {
  // jQuery selectors
  game_window = $('.game-window');
  game_screen = $("#actual-game");
  asteroid_section = $('.asteroidSection');
  // hide all other pages initially except landing page
  game_screen.hide();
  $('.end').hide();

  /* -------------------- ASSIGNMENT 2 SELECTORS BEGIN -------------------- */
  // Define your jQuery selectors here
  var slider = $("#myRange"); // Use # to select elements by ID
  var VolumeVal = $("#VolVal"); // Use # to select elements by ID

  // Initialize VolumeVal with the initial value of the slider
  VolumeVal.text(slider.val());

  // Add an event listener to the slider for input change
  slider.on('input', function () {
    // Update the text content of VolumeVal with the value of the slider
    VolumeVal.text($(this).val());
  });

  $("#normal").addClass("selected");
  $(".close-button").on("click", function () {
    $(".Settings-Panel").hide();
  })
  $("#myButton2").on("click", function () {
    $(".Settings-Panel").show();
  })
  $("#myButton1").on("click", function () {
    if (played == 0) {
      $(".tutorial").show();
    }
    else {
      startGame();
    }
  })
  $(".difficulty-btn").on("click", function () {
    $(".difficulty-btn").removeClass("selected");
    $(this).addClass("selected");
  })
  $(".overbutton").on("click", again);
  $(".Start").on("click", startGame);




  /* --------------------- ASSIGNMENT 2 SELECTORS END --------------------- */

  // TODO: DEFINE YOUR JQUERY SELECTORS (FOR ASSIGNMENT 3) HERE

  // Example: Spawn an asteroid that travels from one border to another
  //spawn(); // Uncomment me to test out the effect!
});

function startGame() {
  played = 1;
  sco = 0;
  lel = 1;
  die = 0;
  $("#score").text(sco);
  $("#level").text(lel);
  $("#actual-game").show();
  $("#get-ready").show();
  let diff = getSelectedDifficulty();
  let intervalDuration;
  if (diff == "easy") {
    intervalDuration = 1000;
    astProjectileSpeed = 1;
    dan = 10;
  } else if (diff == "normal") {
    intervalDuration = 800;
    astProjectileSpeed = 3;
    dan = 20;
  } else if (diff == "hard") {
    intervalDuration = 600;
    astProjectileSpeed = 5;
    dan = 30;
  }
  $("#danger").text(dan);
  setTimeout(() => {
    $("#get-ready").hide();
    intervalSco = setInterval(updateScore, 500);
    intervalAst = setInterval(spawn, intervalDuration);
    intervalShi = setInterval(spawnShield, 10000);
    intervalPor = setInterval(spawnPortal, 15000);
    $(".asteroidSection").append("<img class = 'rocket' src='src/player/player.gif'/>");
    intervalRoc = setInterval(updateRocketPosition, 20);
    intervalCol = setInterval(checkCollisions, 100);
  }, 3000);
  // Call the function to get the selected difficulty whenever needed
}

function again() {

  game_window = $('.game-window');
  game_window.show();
  game_screen = $("#actual-game");
  game_screen.hide();
  $('.end').hide();
  $('.tutorial').hide();
}

/* ---------------------------- EVENT HANDLERS ----------------------------- */
// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

/* ------------------ ASSIGNMENT 2 EVENT HANDLERS BEGIN ------------------ */

/* ------------------- ASSIGNMENT 2 EVENT HANDLERS END ------------------- */

// TODO: ADD MORE FUNCTIONS OR EVENT HANDLERS (FOR ASSIGNMENT 3) HERE
//check for difficulty of button
// Function to get the selected difficulty
function getSelectedDifficulty() {
  let selectedDifficulty;
  // Loop through each difficulty button
  $(".difficulty-btn").each(function () {
    // Check if the current button has the "selected" class
    if ($(this).hasClass("selected")) {
      // Get the ID or any other attribute to identify the selected difficulty
      selectedDifficulty = $(this).attr("id");
      return false;

      // You can return or perform any other action with the selected difficulty here
    }
  });
  return selectedDifficulty;
}





/* ---------------------------- GAME FUNCTIONS ----------------------------- */
// Starter Code for randomly generating and moving an asteroid on screen
class Asteroid {
  // constructs an Asteroid object
  constructor() {
    /*------------------------Public Member Variables------------------------*/
    // create a new Asteroid div and append it to DOM so it can be modified later
    let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAsteroid' > <img src = 'src/asteroid.png'/></div>";
    asteroid_section.append(objectString);
    // select id of this Asteroid
    this.id = $('#a-' + currentAsteroid);
    currentAsteroid++; // ensure each Asteroid has its own id
    // current x, y position of this Asteroid
    this.cur_x = 0; // number of pixels from right
    this.cur_y = 0; // number of pixels from top

    /*------------------------Private Member Variables------------------------*/
    // member variables for how to move the Asteroid
    this.x_dest = 0;
    this.y_dest = 0;
    // member variables indicating when the Asteroid has reached the boarder
    this.hide_axis = 'x';
    this.hide_after = 0;
    this.sign_of_switch = 'neg';
    // spawn an Asteroid at a random location on a random side of the board
    this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
    if (this.hide_axis == 'x') {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_x > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_x < this.hide_after) {
          return true;
        }
      }
    }
    else {
      if (this.sign_of_switch == 'pos') {
        if (this.cur_y > this.hide_after) {
          return true;
        }
      }
      else {
        if (this.cur_y < this.hide_after) {
          return true;
        }
      }
    }
    return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
    // ensures all asteroids travel at current level's speed
    this.cur_y += this.y_dest * astProjectileSpeed;
    this.cur_x += this.x_dest * astProjectileSpeed;
    // update asteroid's css position
    this.id.css('top', this.cur_y);
    this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
    // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
    let x = getRandomNumber(0, 1280);
    let y = getRandomNumber(0, 720);
    let floor = 784;
    let ceiling = -64;
    let left = 1344;
    let right = -64;
    let major_axis = Math.floor(getRandomNumber(0, 2));
    let minor_aix = Math.floor(getRandomNumber(0, 2));
    let num_ticks;

    if (major_axis == 0 && minor_aix == 0) {
      this.cur_y = floor;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 0 && minor_aix == 1) {
      this.cur_y = ceiling;
      this.cur_x = x;
      let bottomOfScreen = game_screen.height();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = (game_screen.width() - x);
      this.x_dest = (this.x_dest - x) / num_ticks + getRandomNumber(-.5, .5);
      this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.hide_axis = 'y';
      this.hide_after = 784;
      this.sign_of_switch = 'pos';
    }
    if (major_axis == 1 && minor_aix == 0) {
      this.cur_y = y;
      this.cur_x = left;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = -64;
      this.sign_of_switch = 'neg';
    }
    if (major_axis == 1 && minor_aix == 1) {
      this.cur_y = y;
      this.cur_x = right;
      let bottomOfScreen = game_screen.width();
      num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed) || 1;

      this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
      this.y_dest = (game_screen.height() - y);
      this.y_dest = (this.y_dest - y) / num_ticks + getRandomNumber(-.5, .5);
      this.hide_axis = 'x';
      this.hide_after = 1344;
      this.sign_of_switch = 'pos';
    }
    // show this Asteroid's initial position on screen
    this.id.css("top", this.cur_y);
    this.id.css("right", this.cur_x);
    // normalize the speed s.t. all Asteroids travel at the same speed
    let speed = Math.sqrt((this.x_dest) * (this.x_dest) + (this.y_dest) * (this.y_dest));
    this.x_dest = this.x_dest / speed;
    this.y_dest = this.y_dest / speed;
  }
}

class Shield {
  constructor() {
    this.objectString = "<div class = 'shield'><img src='src/shield.gif'/></div>";
    $(".asteroidSection").append(this.objectString);
    this.img = $('.shield');
    const shieldWidth = this.img.width();
    const shieldHeight = this.img.height();
    // Calculate random position within the asteroid section bounds
    const maxWidth = $("#actual-game").width() - shieldWidth;
    const maxHeight = $("#actual-game").height() - shieldHeight;
    this.cur_x = getRandomNumber(0, maxWidth);
    this.cur_y = getRandomNumber(0, maxHeight);
    this.img.css("position", "absolute");
    this.img.css("left", this.cur_x);
    this.img.css("top", this.cur_y);
    setTimeout(() => {
      if (die) {
        setTimeout(() => {
          this.img.remove();
        }, 2000)
      }
      else {
        this.img.remove();
      }
    }, 5000);

  }
}
function spawnShield() {
  let randomImage = new Shield();
}
class Portal {
  constructor() {
    this.objectString = "<div class = 'portal'><img src='src/port.gif'/></div>";
    $(".asteroidSection").append(this.objectString);
    this.img = $('.portal');
    const shieldWidth = this.img.width();
    const shieldHeight = this.img.height();
    const maxWidth = $("#actual-game").width() - shieldWidth;
    const maxHeight = $("#actual-game").height() - shieldHeight;
    this.cur_x = getRandomNumber(0, maxWidth);
    this.cur_y = getRandomNumber(0, maxHeight);
    this.img.css("position", "absolute");
    this.img.css("left", this.cur_x);
    this.img.css("top", this.cur_y);
    setTimeout(() => {
      if (die) {
        setTimeout(() => {
          this.img.remove();
        }, 2000)
      }
      else {
        this.img.remove();
      }
    }, 5000);

  }
}
function spawnPortal() {
  let randomImage = new Portal();
}



// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update Asteroid position on screen
    asteroid.updatePosition();
    // determine whether Asteroid has reached its end position
    if (asteroid.hasReachedEnd()) { // i.e. outside the game boarder
      asteroid.id.remove();
      clearInterval(astermovement);
    }
    if (die == 1) {
      clearInterval(astermovement);
    }

  }, AST_OBJECT_REFRESH_RATE);
}

function updateRocketPosition() {
  const speed = PERSON_SPEED;
  const rocket = $(".rocket");
  rocket.css("position", "absolute");
  const gameScreen = $('#actual-game');
  // Get current position of rocket
  let rocketLeft = parseInt(rocket.css('left'));
  let rocketTop = parseInt(rocket.css('top'));
  let shi = "";
  if (shielded) {
    shi = "shielded_";
  }
  if (die == 1) {
    rocket.attr('src', 'src/player/player_touched.gif');
    return;
  }
  if (!LEFT && !RIGHT && !UP && !DOWN) {
    if (shielded) {
      rocket.attr('src', 'src/player/player_shielded.gif')
    }
    else { rocket.attr('src', 'src/player/player.gif'); }

  }
  // Calculate new position based on arrow key states
  if (LEFT && UP && rocketLeft > 0 && rocketTop > 0) {
    rocketLeft -= speed;
    rocketTop -= speed;
    rocket.attr('src', 'src/player/player_' + shi + 'left.gif');
  } else if (LEFT && DOWN && rocketLeft > 0 && rocketTop < gameScreen.height() - rocket.height()) {
    rocketLeft -= speed;
    rocketTop += speed;
    rocket.attr('src', 'src/player/player_' + shi + 'left.gif');
  } else if (RIGHT && UP && rocketLeft < gameScreen.width() - rocket.width() && rocketTop > 0) {
    rocketLeft += speed;
    rocketTop -= speed;
    rocket.attr('src', 'src/player/player_' + shi + 'right.gif');
  } else if (RIGHT && DOWN && rocketLeft < gameScreen.width() - rocket.width() && rocketTop < gameScreen.height() - rocket.height()) {
    rocketLeft += speed;
    rocketTop += speed;
    rocket.attr('src', 'src/player/player_' + shi + 'right.gif');
  } else if (LEFT && rocketLeft > 0) {
    rocketLeft -= speed;
    rocket.attr('src', 'src/player/player_' + shi + 'left.gif');
  } else if (RIGHT && rocketLeft < gameScreen.width() - rocket.width()) {
    rocketLeft += speed;
    rocket.attr('src', 'src/player/player_' + shi + 'right.gif');
  } else if (UP && rocketTop > 0) {
    rocketTop -= speed;
    rocket.attr('src', 'src/player/player_' + shi + 'up.gif');
  } else if (DOWN && rocketTop < gameScreen.height() - rocket.height()) {
    rocketTop += speed;
    rocket.attr('src', 'src/player/player_' + shi + 'down.gif');
  }

  // Update rocket position
  rocket.css('left', rocketLeft + 'px');
  rocket.css('top', rocketTop + 'px');

}
function checkCollisions() {
  const rocket = $('.rocket');
  // Select asteroids, shields, and portals (assuming they have specific classes)
  const asteroids = $('.curAsteroid');
  const shields = $('.shield');
  const portals = $('.portal');
  asteroids.each(function () {
    if (isOrWillCollide(rocket, $(this), 0, 0)) {
      // Collision with asteroid detected, perform actions
      console.log('Collision with asteroid detected!');
      if (!shielded) {
        die = 1;
        rocket.attr('src', 'src/player/player_touched.gif');
        clearInterval(intervalAst);
        clearInterval(intervalShi);
        clearInterval(intervalPor);
        clearInterval(intervalRoc);
        clearInterval(intervalCol);
        clearInterval(intervalSco);

        const audio = new Audio('src/audio/die.mp3');
        audio.volume = $("#myRange").val() / 100;
        audio.play();
        setTimeout(function () {
          $('.game-window').hide();
          $('#overscore').text(sco);
          $('.end').show();
          $('.rocket').remove();
          $('.curAsteroid').remove();
          $('.shield').remove();
          $('.portal').remove();

        }, 2000);

      }
      else {
        shielded = 0;
        $(this).remove();
      }
    }
  });

  // Check collisions with shields
  shields.each(function () {
    if (isOrWillCollide(rocket, $(this), 0, 0)) {
      // Collision with shield detected, perform actions
      $(this).remove();
      shielded = 1;
      const audio = new Audio('src/audio/collect.mp3');
      audio.volume = $("#myRange").val() / 100;
      audio.play();
    }
  });

  // Check collisions with portals
  portals.each(function () {
    if (isOrWillCollide(rocket, $(this), 0, 0)) {
      // Collision with portal detected, perform actions
      console.log('Collision with portal detected!');
      astProjectileSpeed += 0.5;
      lel += 1;
      $("#level").text(lel);
      dan += 2;
      $("#danger").text(dan);
      const audio = new Audio('src/audio/collect.mp3');
      audio.volume = $("#myRange").val() / 100;
      audio.play();
      $(this).remove();
    }
  });
}

function updateScore() {
  sco += 40;
  $("#score").text(sco);

}




/* --------------------- Additional Utility Functions  --------------------- */
// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
