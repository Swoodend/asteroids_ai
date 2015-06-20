(function () {

  $('#start-button').on('click', function () {
    var startButton = $(this).attr('disabled', true);
    $.publish('startTrials');
    $.subscribe('endTrials', function () {
      startButton.removeAttr('disabled');
    })
  })

})();
