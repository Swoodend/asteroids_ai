$.getJSON('/trials', function(trials){
  var navList = $('#trial-index');
  var trialInfo = $('#trial-info');
  navList.empty();
  trials.forEach(function(trail){
    $('<li>').text(trail.gameId).appendTo(navList);
  })

  $('li').on('click', function() {
    trialInfo.empty();
    var listVal = $(this).text();

    $.getJSON('/trials/'+ listVal, function(trialData) {
      $(trialInfo).highcharts({
        title: {
          text: 'Trial Details',
          x: -20 //center
        },
        xAxis: {
          title: {
            text: 'Duration (MS)'
          }
        },
        yAxis: {
          title: {
            text: 'Points Acquired'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: listVal,
          data: trialData.map(function(tick){
            return [tick.timeRunning, tick.currentScore]
          })
        }]
      });
    })

  });

});
