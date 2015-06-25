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
      renderTo: 'overview-chart',
      backgroundColor: 'rgba(0,0,0,0)'
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
    gameData.keysPressed.forEach(function (keyCode) {
      classNames.push(KEYS[keyCode]);
    });
    joystick.className = classNames.join(' ');
  });

  $.subscribe('gameEnded', function () {
    joystick.className = 'joystick';
    ourScore = 0;
    bulletCount = 0;
    killCount = 0;
    accuracy = 0;
    point.update(0);
  })

  var shipVel = $('#ship-velocity');
  var killCheck = $('#kill-count');
  $.subscribe('tick', function (e, gameData) {
    var velx = gameData.gameObject.ship.vel.x;
    var vely = gameData.gameObject.ship.vel.y;
    var vel = Math.sqrt(velx * velx + vely * vely);
    shipVel.text(vel);
  })
  var ourScore = 0;
  var killCount = 0;
  $.subscribe('tick', function (e, gameData) {
    if (gameData.gameScore > ourScore) {
      killCount += 1;
      ourScore = gameData.gameScore;
    }
    killCheck.text(killCount);
  })
  var bulletCount = 0;
  var shotsFired = $('#bullet-count');
  $.subscribe('bulletshot', function () {
    bulletCount += 1;
    shotsFired.text(bulletCount);
  })

  var accuracy = 0;
  var accDiv = $('#accuracy');
  $.subscribe('tick', function () {
    if (bulletCount > 0) {
      accDiv.text(Math.round((killCount / bulletCount * 100)) + '%');
    } else  {
      accDiv.text(0 + '%');
    }

  })

  var gaugeOptions = {

    chart: {
      type: 'solidgauge',
      backgroundColor: 'transparent'
    },

    title: null,

    pane: {
      center: ['50%', '85%'],
      size: '100%',
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },

    tooltip: {
      enabled: false
    },

    // the value axis
    yAxis: {
      stops: [
        [0.1, '#55BF3B'], // green
        [0.5, '#DDDF0D'], // yellow
        [0.9, '#DF5353'] // red
      ],
      lineWidth: 0,
      minorTickInterval: null,
      tickPixelInterval: 400,
      tickWidth: 0,
      title: {
        y: -70
      },
      labels: {
        y: 16
      }
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      }
    }
  };

  // The speed gauge
  $('#speed-gauge').highcharts(Highcharts.merge(gaugeOptions, {
    yAxis: {
      min: 0,
      max: 1000,
      title: {
        text: ''
      }
    },

    credits: {
      enabled: false
    },

    series: [{
      name: 'Speed',
      data: [0],
      dataLabels: {
        format: '<div style="text-align:center"><span style="font-size:25px;color:' +
        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
        '<span style="font-size:12px;color:silver">km/h</span></div>'
      },
      tooltip: {
        valueSuffix: ' km/h'
      }
    }]

  }));

  var chart = $('#speed-gauge').highcharts();
  var point = chart.series[0].points[0];

  $.subscribe('tick', function (e, gameData) {

    if (gameData.gameObject.ship.visible) {
      var velx = gameData.gameObject.ship.vel.x;
      var vely = gameData.gameObject.ship.vel.y;
      var vel = Math.round((Math.sqrt(velx * velx + vely * vely) * 100));
    } else {
      vel = 0;
    }

    point.update(vel);

  })

})();
