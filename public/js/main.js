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
    return 1; // this can be changed later 
  }

  function runTrials (numberOfTrials) {
    loadGameIntoIframe().done(function () {
      startGame().done(function () {
        endgame()

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

  function endGame () {
    releaseKeys()
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

  var defaultTickDuration = 1000 / 30
  function getTickDuration () {
    return defaultTickDuration
  }

  function gameShouldContinueBeingPlayed () {
    return getGameObject().lives !== -1
  }

  function releaseKeys () {
    if (previouslyPressedKeys) {
      previouslyPressedKeys.forEach(releaseKey)
    }
  }

  var previouslyPressedKeys
  function pressKeys (keysToPress) {
    keysToPress.forEach(pressKey)
    previouslyPressedKeys = keysToPress; // last line
  }

  function printToNeatoConsole () {
    var trialDisplay = $('#trial-display')
    var numTrials = getNumberOfTrials()
    // TODO append data about the entire trail to text after the trial has finished
    if (getGameObject().lives === -1) {
      $('<div/>').text('number of trials: ' + numTrials).appendTo(trialDisplay)
    }
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
