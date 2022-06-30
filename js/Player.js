class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.fuel = 185;
    this.life = 185;
    
    this.rank = 0;
    this.score = 0;
  }

  addPlayer() {
    var playerIndex = "players/player" + this.index;

    if (this.index === 1) {
      this.positionX = width / 2 - 270;
    } else {
      this.positionX = width / 2 + 230;
    }

    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      fuel: this.fuel,
      life: this.life,
    });
  }

  getCount() {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data => {
      playerCount = data.val();
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }
  update(){
    database.ref("players/player"+this.index).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      fuel: this.fuel,
      life: this.life,
    });
  }
  getCarsAtEnd(){
    database.ref("carsAtEnd").on("value", (data)=>{
      this.rank = data.val();
    })
  }
  static updateCarsAtEnd(rank){
    database.ref("/").update({
      carsAtEnd: rank,

    })
  }
}
