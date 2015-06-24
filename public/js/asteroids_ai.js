AsteroidsAi = (function() {

  var gwin;
  var gmod;

  function AiCtor(gameWindow, model) {
    gwin = gameWindow;
    gmod = model;
  }

  AiCtor.prototype.startGame = function () {
    AsteroidsEvents.patchGame(getGameWindow());
    pressKey(32);
  };

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

  function getGameJquery() {
    return getGameVar('jQuery');
  }

  function getGameObject() {
    return getGameVar('Game');
  }

  function getGameVar(varName) {
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

  function getClosestDeadly(deadlies) {
    var closest;
    for (var i = 0, len = deadlies.length; i < len; i++) {
      if (closest && closest.d > deadlies[i].d) {
        closest = deadlies[i];
      } else {
        closest = deadlies[i];
      }
    }
    return closest;
  }

  var width = 800;
  var height = 600;
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

  var ACC = 4;
  var TURN = 2;
  var CW = 1;
  function getKeysToPress(gameState) {
    var keysToPress = [];
    var closestDeadly = getClosestDeadly(gameState.sprites);
    var deadlyAngle = closestDeadly.t;
    while (deadlyAngle < 0) {
      deadlyAngle += 360;
    }
    var angle = Math.floor(deadlyAngle/gmod.config[0].stepSize);
    var distance = Math.floor(closestDeadly.d/gmod.config[1].stepSize);
    var c = gmod.model[angle][distance];
    keysToPress.push(32);
    if (ACC & c) {
      keysToPress.push(38);
    }
    if (TURN & c) {
      if (CW & c) {
        keysToPress.push(39);
      } else {
        keysToPress.push(37);
      }
    }
    return keysToPress;
  }

  function startGame() {
    pressKey(32);
  }

  function pressKey(keyCode) {
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

  function releaseKey(keyCode) {
    var e = getGameJquery().Event('keyup');
    e.keyCode = keyCode;
    getGameJquery()(getGameWindow()).trigger(e);
  }

  function releaseKeys(keysToRelease) {
    keysToRelease.forEach(releaseKey);
  }

  function getGameScore() {
    return getGameObject().score;
   }

  window.gAsteroidsAi = {
    extractGameData: extractGameData
  };

  return AiCtor;

}());
