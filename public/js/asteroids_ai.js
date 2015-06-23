AsteroidsAi = (function() {

  var gwin;

  function AiCtor(gameWindow) {
    gwin = gameWindow;
  }

  AiCtor.prototype.startGame = function () {
    pressKey(32);
  };

  AiCtor.prototype.onTick = function () {
    var gameData = extractGameData(getGameObject());
    var keysToPress = getKeysToPress(gameData);
    pressKeys(keysToPress);
    return {
      gameData: gameData,
      keysPressed: keysToPress
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
      sprites: getDeadlies(gameObject),
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

  function getDeadlyData(ship, sprite, shootable) {
    var angle = (Math.atan2(sprite.y - ship.y, sprite.x - ship.x) * 180 / Math.PI) - (ship.rot - 90);
    var distance = Math.sqrt(Math.pow((ship.x - sprite.x), 2) + Math.pow((ship.y - sprite.y), 2));
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
