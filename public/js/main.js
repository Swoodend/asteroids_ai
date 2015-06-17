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
    getGameWindow().reload()
    $(getFameFrame()).on('load', function () {
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

  function pressKey (key) {
    // TODO press the key
    KEY_CODES = {
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      70: 'f',
      71: 'g',
      72: 'h',
      77: 'm',
      80: 'p'
    }

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
      }, gettickDuration())
    } else {
      gameDeferred.resolve()
    }

  }

  var defaultTickDuration = 1000 / 60
  function getTickDuration () {
    return defaultTIckDuration
  }
  function gameShouldContinueBeingPLayed () {
    // TODO
    // if points havent changed in a long time return false
    // if you are dead return false
    return true
  }

  var previouslyPressedKeys
  function pressKeys (keysToPress) {
    if (previouslyPressedKeys) {
      // TODO Release previously pressed keys and press new keys

    }
    // TODO Press new keys
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
    return [32]
  }

  function getGameId () {
    return 1
  }
})()
