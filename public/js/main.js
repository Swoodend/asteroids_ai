(function () {
  var socket = io();
  socket.on('connect', initialize);

  var AI;
  function initialize() {
    $.getJSON('/models/0.json', function(model) {
      AI = new AsteroidsAi(getGameWindow(), model);
      $.subscribe('startTrials', startTrials);
    });
  }

  function startTrials() {
    runTrials(getNumberOfTrials());
  }

  function getNumberOfTrials() {
    return 1;
  }

  function runTrials(numberOfTrials) {
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

  function endTrials() {
    $.publish('endTrials');
  }

  function loadGameIntoIframe() {
    var d = $.Deferred();
    getGameWindow().location.reload();
    $(getGameFrame()).on('load', function () {
      d.resolve();
    });
    return d;
  }

  var gameWindow;
  function getGameWindow() {
    if (!gameWindow) {
      gameWindow = getGameFrame().contentWindow;
    }
    return gameWindow;
  }

  var gameFrame;
  function getGameFrame() {
    if (!gameFrame) {
      gameFrame = frames['game-frame'];
    }
    return gameFrame;
  }
  var gameId;
  var gameTime;
  function startGame() {
    gameId = (new Date()).getTime();
    $.publish('gameStarted', gameId);
    gameTime = (new Date()).getTime();
    AI.startGame(getGameWindow());
    var g = $.Deferred();
    tick(g);
    return g;
  }

  function endGame() {
    AI.onGameEnd();
    $.publish('gameEnded', gameId);
  }

  function tick(gameDeferred) {
    var tickData = AI.onTick();
    tickData.gameId = getGameId();
    tickData.gameTime = getGameTime();
    tickData.gameScore = tickData.gameData.score;
    $.publish('tick', tickData);
    setTimeout(function () {
      if (AI.gameShouldContinueBeingPlayed()) {
        tick(gameDeferred);
      } else {
        gameDeferred.resolve();
      }
    }, getTickDuration());
  }

  var defaultTickDuration = 100;
  function getTickDuration() {
    return defaultTickDuration;
  }

  function saveToDatabase (gameState, keysToPress) {
    socket.emit('save data', obj);
  }

  function getGameId() {
    return gameId;
  }

  function getAiId() {
    return 1;
  }

  function getGameTime() {
    return (new Date()).getTime() - gameTime;
  }

})();
