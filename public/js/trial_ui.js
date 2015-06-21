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

  $.subscribe('gameStarted', function(e, gameId){
    overviewSeries[gameId] = overviewChart.addSeries({
      name: gameId
    });
  });

  $.subscribe('tick', function(e, gameData){
    overviewSeries[gameData.gameId].addPoint([
      gameData.gameTime,
      gameData.gameScore
    ]);
  });

})();
