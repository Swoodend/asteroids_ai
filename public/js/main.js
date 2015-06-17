(function () {
  $(function () {
    $('#start-button').on('click', function () {
      $(this).attr('disabled', true)
      startTrials()
    })
  })

  function startTrials () {
    runTrials(getNumberOfTrials())
  }

  function getNumberOfTrials () {
    return 10; // this can be changed later 
  }

  function runTrials (numberOfTrials) {
    loadGameIntoIframe().done(function () {
      startGame().done(function () {
        numberOfTrials--
        if (numberOfTrials) {
          runTrials(numberOfTrials)
        } else {
          endTrials()
        }
      })
    })
  }

  function endTrials () {
    // TODO clean things up
    // add start trial button back
    $('#start-button').removeAttr('disabled')
  }

  function loadGameIntoIframe () {
    var d = $.Deferred()
    getGameWindow().location.reload()
    $(getGameFrame()).on('load', function () {
      // TODO needs to wait until game is ready
      d.resolve()
    })
    // load game into iframe and then resolve the deferred
    // $(getGameFrame()).on('load', d.resolve.bind(d))

    return d
  }
  var gameWindow
  function getGameWindow () {
    if (!gameWindow) {
      gameWindow = getGameFrame().contentWindow
    }
    return gameWindow
  }

  function getGameJquery () {
    return getGameVar('jQuery')
  }

  function getGameObject () {
    return getGameVar('Game')
  }

  function getGameVar (varName) {
    return getGameWindow()[varName]
  }

  var gameFrame
  function getGameFrame () {
    if (!gameFrame) {
      gameFrame = frames['game-frame']
    }
    return gameFrame
  }

  function startGame () {
    pressSpacebar()
    var g = $.Deferred()
    tick(g)
    return g
  }

  function pressSpacebar () {
    pressKey(32)
  }

  function pressKey (keyCode) {
    var e = getGameJquery().Event('keydown')
    e.keyCode = keyCode
    getGameJquery()(getGameWindow()).trigger(e)
  }

  function releaseKey (keyCode) {
    var e = getGameJquery().Event('keyup')
    e.keyCode = keyCode
    getGameJquery()(getGameWindow()).trigger(e)
  }

  function tick (gameDeferred) {
    var gameState = getGameStateNow()
    var keysToPress = getKeysToPress(gameState)
    pressKeys(keysToPress)
    printToNeatoConsole(gameState, keysToPress)
    saveToDatabase(gameState, keysToPress)
    if (gameShouldContinueBeingPlayed()) {
      setTimeout(function () {
        tick(gameDeferred)
      }, getTickDuration())
    } else {
      gameDeferred.resolve()
    }

  }

  var defaultTickDuration = 100
  function getTickDuration () {
    return defaultTickDuration
  }

  function gameShouldContinueBeingPlayed () {
    // TODO IMPLEMENT NEXT
    // if points havent changed in a long time return false
    // if you are dead return false

    Game.lives > 0
  }

  var previouslyPressedKeys
  function pressKeys (keysToPress) {
    if (previouslyPressedKeys) {
      previouslyPressedKeys.forEach(releaseKey)
    }
    keysToPress.forEach(pressKey)
    previouslyPressedKeys = keysToPress; // last line
  }

  function printToNeatoConsole () {
    // TODO
    // Div you push stuff into
  }

  function saveToDatabase () {
    // TODO
  }

  function getGameStateNow () {
    return {}; // all game state in this object
  }

  function getKeysToPress (gameState) {
    // TODO (this could be very long, perhaps put in seperate file)
    var keysToPress = []
    if (Math.random() > 0.5) {
      keysToPress.push(32)
    }
    if (Math.random() > 0.5) {
      keysToPress.push(37)
    }
    if (Math.random() > 0.5) {
      keysToPress.push(38)
    }
    if (Math.random() > 0.5) {
      keysToPress.push(39)
    }
    return keysToPress
  }

  function getGameId () {
    return 1
  }

  function getAiId () {
    return 1
  }
})()
