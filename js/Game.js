class Game {
  constructor() {
    this.reset = createButton("");
    this.titleReset = createElement("h2");
    this.leaderboardTitle = createElement("h2");
    this.lider1 = createElement("h2");
    this.lider2 = createElement("h2");
    this.playerMove - false;
    this.leftkeyactive = false;
    this.blast = false;

  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 270, height - 100);
    car1.addImage("car1", car1_img);
    car1.addImage("blast", explosionImg);
    car1.scale = 0.675;

    car2 = createSprite(width / 2 + 230, height - 100);
    car2.addImage("car2", car2_img);
    car2.addImage("blast", explosionImg);
    car2.scale = 0.2;

    cars = [car1, car2];

    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    this.addSprites(fuels, 4, fuelImg, 0.02);
    this.addSprites(powerCoins, 18, powerCoinsImg, 0.09);

    var obstaclesPositions = [{ x: width / 2 + 250, y: height - 800, image: obstacle2Image }, { x: width / 2 - 150, y: height - 1300, image: obstacle1Image }, { x: width / 2 + 250, y: height - 1800, image: obstacle1Image }, { x: width / 2 - 180, y: height - 2300, image: obstacle2Image }, { x: width / 2, y: height - 2800, image: obstacle2Image }, { x: width / 2 - 180, y: height - 3300, image: obstacle1Image }, { x: width / 2 + 180, y: height - 3300, image: obstacle2Image }, { x: width / 2 + 250, y: height - 3800, image: obstacle2Image }, { x: width / 2 - 150, y: height - 4300, image: obstacle1Image }, { x: width / 2 + 250, y: height - 4800, image: obstacle2Image }, { x: width / 2, y: height - 5300, image: obstacle1Image }, { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }];

    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.reset.class("resetButton");
    this.reset.position(width - 300, 100);
    this.titleReset.class("resetText");
    this.titleReset.position(width - 350, 40);
    this.titleReset.html("Reiniciar Jogo");

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(220, 130);
    this.lider1.class("leadersText");
    this.lider2.class("leadersText");
    this.lider1.position(215, 170);
    this.lider2.position(215, 220);


  }
  showLeaderboard() {
    var lider1, lider2;
    var players = Object.values(allPlayers);
    if (players[0].rank === 0 && players[1].rank === 0 || players[0].rank === 1) {
      lider1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
      lider2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
    }
    else if (players[1].rank === 1) {
      lider1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
      lider2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
    }
    this.lider1.html(lider1);
    this.lider2.html(lider2);
  }
  play() {
    this.handleElements();
    this.handleResetButton();
    player.getCarsAtEnd();


    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      this.showLeaderboard();
      image(track, 0, -height * 5, width, height * 6);
      this.showLife();
      this.showFuel();
      var index = 0;
      for (var plr in allPlayers) {
        index += 1;
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY - 100;
        cars[index - 1].position.x = x
        cars[index - 1].position.y = y
        if (index === player.index) {
          camera.position.y = cars[index - 1].position.y;
          if (player.life > 0){
            fill("limegreen");
          ellipse(x, y, 100, 100);

          }
          else {
            this.blast = true;
            this.playerMove = false;
          }
          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCollision(index);
          this.handleCollisionWithCarB(index);
        }
        var currentLife = allPlayers[plr].life;
        if (currentLife <= 0){
          cars[index-1].changeImage("blast");
          cars[index-1].scale = 0.3;
          
        }
      }
      const finishline = height*6-100;
      if (player.positionY > finishline){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
      this.handlePlayerControls();

    }


  }
  handlePlayerControls() {
    if(!this.blast){
      if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        player.positionY += 10;
        player.update();
        this.playerMove = true;
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50
        || keyIsDown(65) && player.positionX > width / 3 - 50) {
        player.positionX -= 5;
        player.update();
        this.leftkeyactive = true;
      }
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300
        || keyIsDown(68) && player.positionX < width / 2 + 300) {
        player.positionX += 5;
        player.update();
        this.leftkeyactive = false;
      }
    }


  }
  handleResetButton() {
    this.reset.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {},
      })
      window.location.reload();
    });
  }
  addSprites(group, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      }
      else {
        x = random(width / 3 - 50, width / 2 + 300);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage(spriteImage);
      sprite.scale = scale;
      group.add(sprite);
    }
  }
  handleFuel(index){
    cars[index-1].overlap(fuels, function(collector, collected){
      collected.remove();
      player.fuel = 185;
      player.update();
    });
    if(player.fuel > 0 && this.playerMove){
      player.fuel -= 0.3;
    }
    if(player.fuel <= 0){
      gameState = 2;
      this.gameOver();
    }
  }
  handlePowerCoins(index){
    cars[index-1].overlap(powerCoins, function(collector, collected){
      collected.remove();
      player.score += 21;
      player.update();
    });
  }
  showRank(){
    swal({
      title: `Incrivel! ${"\n"} sua classificação: ${"\n"} ${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",    
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",  
    })
  }
  showLife(){
    push();
    image(lifeImg, width/2-130, height-player.positionY-500, 20, 20);
    fill("white");
    rect(width/2-100, height-player.positionY-500, 185, 20);
    fill("crimson");
    rect(width/2-100, height-player.positionY-500, player.life, 20);
    pop();
  }
  showFuel(){
    push();
    image(fuelImg, width/2-130, height-player.positionY-450, 20, 20);
    fill("white");
    rect(width/2-100, height-player.positionY-450, 185, 20);
    fill("orange");
    rect(width/2-100, height-player.positionY-450, player.fuel, 20);
    pop();
  }
  gameOver(){
    swal({
      title: `Fim de jogo`,
      text: "Ops! Você perdeu a corrida",    
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado Por Jogar",  
    })
  }
  handleCollision(i){
    if(cars[i-1].collide(obstacles)){
      if(this.leftkeyactive){
        player.positionX -= 150;
      }
      else {
        player.positionX += 150;
      }
      if(player.life>0){
        player.life -= 185/4;
      }
      player.update();    
    }
  }
  handleCollisionWithCarB(i){
    if(i === 1){
      if(cars[i-1].collide(cars[1])){
        if(this.leftkeyactive){
          player.positionX -= 150;
        }
        else {
          player.positionX += 150;
        }
        if(player.life>0){
          player.life -= 185/4;
        }
        player.update();    
      }
    }
    if(i === 2){
      if(cars[i-1].collide(cars[0])){
        if(this.leftkeyactive){
          player.positionX -= 150;
        }
        else {
          player.positionX += 150;
        }
        if(player.life>0){
          player.life -= 185/4;
        }
        player.update();    
      }
    }
  }
}
