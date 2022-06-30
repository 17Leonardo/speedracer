var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];

var fuels, powerCoins, obstacles;
var fuelImg, powerCoinsImg, obstacle1Image, obstacle2Image, lifeImg, explosionImg;



function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("./assets/formula1.png");
  car2_img = loadImage("./assets/formula2.png");
  track = loadImage("./assets/track.jpg");
  fuelImg = loadImage("./assets/fuel.png");
  powerCoinsImg = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImg = loadImage("./assets/life.png")
  explosionImg = loadImage("./assets/blast.png");


}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
