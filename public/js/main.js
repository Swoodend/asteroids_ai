$(function () {
  var gameWindow = frames['game-frame'].contentWindow
  $(gameWindow).on('load', function () {
    var $$ = this.$

    setInterval(function () {
      var e = $$.Event('keydown')
      e.keyCode = 32
      $$(gameWindow).trigger(e)
      console.log('hmm')
    }, 1000)

  })

})
