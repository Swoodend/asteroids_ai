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
    var specificTrial = trials.filter(function(trial){
      return trial.gameId == listVal;
    });
    console.log(specificTrial);
    $('<p/>').text('duration: ' + specificTrial[0].duration).appendTo(trialInfo);
    $('<p/>').text('total points: ' + specificTrial[0].totalPoints).appendTo(trialInfo);
  })

});
