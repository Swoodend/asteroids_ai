$.getJSON('/trials', function(trials){
  var navList = $('#trial-index');
  var trialInfo = $('#trial-info');
  console.log(trials);
  navList.empty();
  trials.forEach(function(trail){
    $('<li>').text(trail.gameId).appendTo(navList);
  })

  $('li').on('click', function() {
    trialInfo.empty();
    var listVal = $(this).text();
    var specificTrial = trials.filter(function(trial){
      return trial.gameId == listVal;
    });
    //console.log(specificTrial);
    //$('<p/>').text('duration: ' + specificTrial[0].duration).appendTo(trialInfo); //populate graph instead of add p tag
    //$('<p/>').text('total points: ' + specificTrial[0].totalPoints).appendTo(trialInfo);

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
      tooltip: {
        valueSuffix: '°C'
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      series: [{
        name: 'Tokyo',
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }, {
        name: 'New York',
        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
      }, {
        name: 'Berlin',
        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
      }, {
        name: 'London',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
      }]
    });
  });

});
