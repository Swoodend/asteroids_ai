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

  function getGameWindow () {
    // TODO

  }

  function getGameFrame () {
    // TODO

  }

  // -a trial suite is playing the game with an AI a numeber of times and recording what it accomplishes
  // -running a trial suite is going to be a function
  // -need a counter - number of times to play game
  // -start the first game

  // -playing a game (what is it?)
  // -load game into iframe
  // -after the game loads, start playing

  // -playing (what is it?)
  // -collect info about loaded game, such as window obj and jQuery
  // -press spacebar (start game)

  function startGame () {
    pressSpacebar()
    var g = $.Deferred()
    tick(g)
    return g
  }

  function pressSpaceBar () {
    // TODO press the space bar
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
})()
