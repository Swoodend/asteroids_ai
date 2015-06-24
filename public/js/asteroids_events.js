(function () {
  function patchGame(gameWindow) {
    gameWindow.Game.ship.preMove = function (delta) {
      if (gameWindow.KEY_STATUS.left) {
        this.vel.rot = -6;
      } else if (gameWindow.KEY_STATUS.right) {
        this.vel.rot = 6;
      } else {
        this.vel.rot = 0;
      }

      if (gameWindow.KEY_STATUS.up) {
        var rad = ((this.rot-90) * Math.PI)/180;
        this.acc.x = 0.5 * Math.cos(rad);
        this.acc.y = 0.5 * Math.sin(rad);
        this.children.exhaust.visible = Math.random() > 0.1;
      } else {
        this.acc.x = 0;
        this.acc.y = 0;
        this.children.exhaust.visible = false;
      }

      if (this.bulletCounter > 0) {
        this.bulletCounter -= delta;
      }
      if (gameWindow.KEY_STATUS.space) {
        if (this.bulletCounter <= 0) {
          this.bulletCounter = 10;
          for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].visible) {

              $.publish('bulletshot');
              gameWindow.SFX.laser();
              var bullet = this.bullets[i];
              var rad = ((this.rot - 90) * Math.PI) / 180;
              var vectorx = Math.cos(rad);
              var vectory = Math.sin(rad);
              // move to the nose of the ship
              bullet.x = this.x + vectorx * 4;
              bullet.y = this.y + vectory * 4;
              bullet.vel.x = 6 * vectorx + this.vel.x;
              bullet.vel.y = 6 * vectory + this.vel.y;
              bullet.visible = true;
              break;
            }
          }
        }
      }
      // limit the ship's speed
      if (Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y) > 8) {
        this.vel.x *= 0.95;
        this.vel.y *= 0.95;
      }
    }
  }

  window.AsteroidsEvents = {
    patchGame: patchGame
  }
})();
