$.getJSON('/trials', function(trials){
  var navList = $('#trial-index');
  navList.empty();
  trials.forEach(function(trail){
    $('<li>').text(trail.gameId).appendTo(navList);
  })
});
