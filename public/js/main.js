(function () {
  var socket = io();
  socket.on('connect', initialize);

  function initialize () {
    $.subscribe('tick', function(e, obj){
      pressKeys(obj.keysPressed);
    });
    $.subscribe('startTrials', startTrials);
  }

  function startTrials () {
    runTrials(getNumberOfTrials());
  }

  function getNumberOfTrials () {
    return 1;
  }

  function runTrials (numberOfTrials) {
    loadGameIntoIframe().done(function () {
      startGame().done(function () {
        endGame();
        numberOfTrials--;
        if (numberOfTrials > 0) {
          runTrials(numberOfTrials);
        } else {
          endTrials();
        }
      });
    });
  }

  function endTrials () {
    // TODO clean things up
    // add start trial button back
    $.publish('endTrials');
  }

  function loadGameIntoIframe () {
    var d = $.Deferred();
    getGameWindow().location.reload();
    $(getGameFrame()).on('load', function () {
      // TODO needs to wait until game is ready
      d.resolve();
    });
    // load game into iframe and then resolve the deferred
    // $(getGameFrame()).on('load', d.resolve.bind(d))
    return d;
  }

  var gameWindow;
  function getGameWindow () {
    if (!gameWindow) {
      gameWindow = getGameFrame().contentWindow;
    }
    return gameWindow;
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

  var gameFrame;
  function getGameFrame () {
    if (!gameFrame) {
      gameFrame = frames['game-frame'];
    }
    return gameFrame;
  }
  var gameId;
  var gameTime;
  function startGame () {
    gameId = (new Date()).getTime();
    gameTime = (new Date()).getTime();
    pressSpacebar();
    var g = $.Deferred();
    tick(g);
    return g;
  }

  function endGame () {
    releaseKeys(previouslyPressedKeys);
    var numTrials = getNumberOfTrials();
  }

  function pressSpacebar () {
    pressKey(32);
  }

  function pressKey (keyCode) {
    var e = getGameJquery().Event('keydown');
    e.keyCode = keyCode;
    getGameJquery()(getGameWindow()).trigger(e);
  }

  function releaseKey (keyCode) {
    var e = getGameJquery().Event('keyup');
    e.keyCode = keyCode;
    getGameJquery()(getGameWindow()).trigger(e);
  }

  function tick (gameDeferred) {
    var gameState = getGameStateNow();
    var keysToPress = getKeysToPress(gameState);
    var obj = {
      gameState: gameState,
      keysPressed: keysToPress,
      gameId: getGameId(),
      aiId: getAiId(),
      gameScore: getGameScore(),
      gameTime: getGameTime()
    };
    $.publish('tick', obj);
    setTimeout(function () {
      if (gameShouldContinueBeingPlayed()) {
        tick(gameDeferred);
      } else {
        gameDeferred.resolve();
      }
    }, getTickDuration());
  }

  var defaultTickDuration = 100;
  function getTickDuration () {
    return defaultTickDuration;
  }

  function gameShouldContinueBeingPlayed () {
    return getGameObject().lives != -1;
  }

  var previouslyPressedKeys;
  function pressKeys (keysToPress) {
    if (previouslyPressedKeys) {
      releaseKeys(previouslyPressedKeys);
    }
    keysToPress.forEach(pressKey);
    previouslyPressedKeys = keysToPress; // last line
  }

  function releaseKeys(keysToRelease) {
    keysToRelease.forEach(releaseKey);
  }

  function printToNeatoConsole (message) {
  }

  function saveToDatabase (gameState, keysToPress) {
    socket.emit('save data', obj);
  }

  function getGameStateNow() {
    var gameObj = getGameObject().sprites;
    var gameState = {
      deadlies: []
    };
    var shipPosX = gameObj[0].x;
    var shipPosY = gameObj[0].y;
    var shipVelX = gameObj[0].vel.x;
    var shipVelY = gameObj[0].vel.y;
    gameObj.forEach(function(sprite) {
      if ((sprite.name === 'asteroid' || sprite.name === 'bigalien') && sprite.visible === true) {
        gameState.deadlies.push([sprite.x - shipPosX, sprite.y - shipPosY, sprite.vel.x - shipVelX, sprite.vel.y - shipVelY, true]);
      } else if (sprite.name === 'alienbullet' && sprite.visible === true) {
        gameStatedeadlies.push([sprite.x - shipPosX, sprite.y - shipPosY, sprite.vel.x - shipVelX, sprite.vel.y - shipVelY, false]);
      }
    });
    return gameState; // all game state in this object
  }

  function getKeysToPress(gameState) {
    // TODO (this could be very long, perhaps put in seperate file)
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

  function getGameId () {
    return gameId; //should change every trial
  }

  function getAiId () {
    return 1; //has to go into database
  }

  function getGameScore(){
    return getGameObject().score;

  }

  function getGameTime(){
    return (new Date()).getTime() - gameTime;
  }

})();
