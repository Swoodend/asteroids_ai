AsteroidsAi = (function() {

  var gwin;

  function AiCtor(gameWindow) {
    gwin = gameWindow;
  }

  AiCtor.prototype.startGame = function () {
    pressKey(32);
  };

  //this is published every tick
  AiCtor.prototype.onTick = function () {
    var gameObject = getGameObject();
    var gameData = extractGameData(gameObject);
    var keysToPress = getKeysToPress(gameData);
    pressKeys(keysToPress);
    return {
      gameData: gameData,
      keysPressed: keysToPress,
      gameObject: gameObject
    };
  };

  AiCtor.prototype.onGameEnd = function () {
    releaseKeys(previouslyPressedKeys);
  };

  AiCtor.prototype.gameShouldContinueBeingPlayed = function () {
    return getGameObject().lives != -1;
  };

  function getGameWindow() {
    return gwin;
  }

  function getGameJquery () {
    return getGameVar('jQuery');
  }

  function getGameObject () {
    return getGameVar('Game');
  }

  function getGameVar (varName) {
    return getGameWindow()[varName];
  }

  function extractGameData(gameObject) {
    return {
      score: gameObject.score,
      sprites: getDeadlies(gameObject)
    };
  }

  function getDeadlies(gameObject) {
    return gameObject.sprites.reduce(function (deadlies, sprite) {
      if ((sprite.name === 'asteroid' || sprite.name === 'bigalien') && sprite.visible) {
        deadlies.push(getDeadlyData(gameObject.ship, sprite, true));
      } else if (sprite.name === 'alienbullet' && sprite.visible) {
        deadlies.push(getDeadlyData(gameObject.ship, sprite, false));
      }
      return deadlies;
    }, []);
  }

  var width = 800;
  var height = 560;
  function getDeadlyData(ship, sprite, shootable) {
    var spriteX = sprite.x;
    var spriteY = sprite.y;
    var shipX = ship.x;
    var shipY = ship.y;
    var deltaX = spriteX - shipX;
    var deltaY = spriteY - shipY;

    if (Math.abs(deltaX) > width/2) {
      deltaX += deltaX > 0 ? -width : width;
    }
    if (Math.abs(deltaY) > height/2) {
      deltaY += deltaY > 0 ? -height : height;
    }

    var distance = Math.sqrt(Math.pow((deltaX), 2) + Math.pow((deltaY), 2));
    var angle = (Math.atan2(deltaY, deltaX) * 180 / Math.PI) - (ship.rot - 90);

    return {
      s: shootable,
      d: distance,
      t: angle
    };
  }

  function getKeysToPress(gameState) {
    var keysToPress = [];
    keysToPress.push(32);
    if (shouldAccelerate(gameState)) {
      keysToPress.push(38);
    }
    if (shouldTurn(gameState)) {
      if (shouldTurnClockWise(gameState)) {
        keysToPress.push(39);
      } else {
        keysToPress.push(37);
      }
    }
    return keysToPress;
  }

  function shouldAccelerate(gameState) {
    return Math.random() > 0.5;
  }

  function shouldTurn(gameState) {
    return Math.random() > 0.5;
  }

  function shouldTurnClockWise(gameState) {
    return Math.random() > 0.5;
  }

  function startGame() {
    pressKey(32);
  }

  function pressKey (keyCode) {
    var e = getGameJquery().Event('keydown');
    e.keyCode = keyCode;
    getGameJquery()(getGameWindow()).trigger(e);
  }

  var previouslyPressedKeys;
  function pressKeys(keysToPress) {
    if (previouslyPressedKeys) {
      releaseKeys(previouslyPressedKeys);
    }
    keysToPress.forEach(pressKey);
    previouslyPressedKeys = keysToPress;
  }

  function releaseKey (keyCode) {
    var e = getGameJquery().Event('keyup');
    e.keyCode = keyCode;
    getGameJquery()(getGameWindow()).trigger(e);
  }

  function releaseKeys(keysToRelease) {
    keysToRelease.forEach(releaseKey);
  }

  function getGameScore(){
    return getGameObject().score;
   }

  window.gAsteroidsAi = {
    extractGameData: extractGameData
  };

  return AiCtor;

}());
