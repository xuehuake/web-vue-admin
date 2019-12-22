import config from '../../package.json'

var ColorConsole = function(e) {
  var t = e.title
  var r = e.content
  var n = e.backgroundColor
  var a = [
    '%c '.concat(t, ' %c ').concat(r, ' '),
    'padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: '.concat(
      '#606060',
      ';'
    ),
    'padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: '.concat(
      n,
      ';'
    )
  ]
  return (
    function() {
      var e
      window.console &&
          typeof window.console.log === 'function' &&
          (e = console).log.apply(e, arguments)
    }.apply(void 0, a),
    a
  )
}

var Info = function(title, content, backgroundColor) {
  var param = { title, content, backgroundColor }
  ColorConsole(param)
}
Info('Environment', process.env.NODE_ENV, 'green')
Info('Version', config.version, 'blue')
Info('Build Date', process.BUILD_DATE, 'blue')

export default {
  Info
}
