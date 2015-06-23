(function () {

  $('#start-button').on('click', function () {
    var startButton = $(this).attr('disabled', true);
    $.publish('startTrials');
    $.subscribe('endTrials', function () {
      startButton.removeAttr('disabled');
    });
  });

  var overviewChart = new Highcharts.Chart({
    chart: {
      renderTo: 'overview-chart'
    },
    title: {
      text: 'Trial Graph'
    },
    xAxis: {
      title: {
        text: 'Milliseconds Elapsed'
      }
    },
    yAxis: {
      title: {
        text: 'Points'
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    }
  });

  var overviewSeries = {};

  $.subscribe('gameStarted', function (e, gameId) {
    overviewSeries[gameId] = overviewChart.addSeries({
      name: gameId
    });
  });

  $.subscribe('tick', function (e, gameData) {
    overviewSeries[gameData.gameId].addPoint([
      gameData.gameTime,
      gameData.gameScore
    ]);
  });

  var joystick = document.getElementById('joystick');
  var KEYS = [];
  KEYS[32] = 'pressed';
  KEYS[37] = 'left';
  KEYS[38] = 'up';
  KEYS[39] = 'right';
  KEYS[40] = 'down';

  $.subscribe('tick', function (e, gameData) {
    var classNames = ['joystick'];
    gameData.keysPressed.forEach(function(keyCode) {
      classNames.push(KEYS[keyCode]);
    });
    joystick.className = classNames.join(' ');
  });

  $.subscribe('gameEnded', function () {
    joystick.className = 'joystick';
  })

  var shipVel = $('#ship-velocity');
  var killCheck = $('#kill-count');
  $.subscribe('tick', function (e, gameData) {
    var velx = gameData.gameObject.ship.vel.x;
    var vely = gameData.gameObject.ship.vel.y;
    var vel = Math.sqrt(velx * velx + vely * vely);
    shipVel.text('Ship vel: ' + vel);
  })
  var ourScore = 0;
  var killCount = 0;
  $.subscribe('tick', function (e, gameData) {
    if (gameData.gameScore > ourScore) {
      killCount += 1;
      ourScore = gameData.gameScore;
    }
    killCheck.text('Kill count: ' + killCount);
  })

})();
