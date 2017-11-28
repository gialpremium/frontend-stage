do (window) ->
  "use strict"

  return  unless REGRU.is_production

  Raven.config('https://f7b3bad68adb453f88816efee117e3a2@sentry.reg.ru/3',
    whitelistUrls: [
      /^https:\/\/(www|hosting)\.reg\.(ru|com|ua)/
    ],
    logger: 'frontend',
    fetchContext: true,
    ignoreErrors: [
      # наш список
      'Attempting to use a disconnected port object'
      'Uncaught Error: Attempting to use a disconnected port object'
      'TypeError: chromeAPI.timers is undefined'
      'chromeAPI.timers is undefined'
      # http://stackoverflow.com/a/27917744
      /__gCrWeb\..*/

      # список из https://gist.github.com/impressiver/5092952
      # Random plugins/extensions
      'top.GLOBALS'
      # See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'originalCreateNotification'
      'canvas.contentDocument'
      'MyApp_RemoveAllHighlights'
      'http://tt.epicplay.com'
      'Can\'t find variable: ZiteReader'
      'jigsaw is not defined'
      'ComboSearch is not defined'
      'http://loading.retry.widdit.com/'
      'atomicFindClose'
      # Facebook borked
      'fb_xd_fragment'
      # ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
      # See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
      'bmi_SafeAddOnload'
      'EBCallBackMessageReceived'
      # See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
      'conduitPage'
      # Generic error code from errors outside the security sandbox
      # You can delete this if using raven.js > 1.0, which ignores these automatically.
      # 'Script error.'
    ],
    ignoreUrls: [
      # наш список
      /webchat\.reg\.ru/
      /mc\.yandex\.ru/
      /(miscellaneous|extension)_bindings/
      /chrome:/
      /file:/
      /resource:/
      /messaging/
      /ping\/index\.php/
      /ga\.js/
      /google-analytics\.com/
      /googleadservices\.com/
      /livereload\.js/
      /watch\.js/
      /metrika\/watch/
      /watch/

      # список из https://gist.github.com/impressiver/5092952
      # Facebook flakiness
      /graph\.facebook\.com/i
      # Facebook blocked
      /connect\.facebook\.net\/en_US\/all\.js/i
      # Woopra flakiness
      /eatdifferent\.com\.woopra-ns\.com/i
      /static\.woopra\.com\/js\/woopra\.js/i
      # Chrome extensions
      /extensions\//i
      /^chrome:\/\//i
      # Other plugins
      /127\.0\.0\.1:4001\/isrunning/i  # Cacaoweb
      /webappstoolbarba\.texthelp\.com\//i
      /metrics\.itunes\.apple\.com\.edgesuite\.net\//i
    ],
    shouldSendCallback: ->
      !/MSIE [6789]\./.test(window.navigator.userAgent)
  ).setUser(
    id: REGRU.user || 'guest'
    group: REGRU.visitor_group
  ).setExtraContext(
    scripts: window.sentryDebug
    server: document.querySelector?('meta[name=REGRU_FRONTEND]')?.getAttribute('content')
  ).install()
