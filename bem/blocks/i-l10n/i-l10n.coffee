BabelFish = require 'babelfish/dist/babelfish.js'
strftime = require 'strftime/strftime.js'

# locale = switch window.lang
#     when 'ru' then 'ru' #'ru_RU' (otherwise, get 'Pluralizer for ru_RU does't exist')
#     when 'en' then 'en' #'en_US'
#     else window.lang
locale = window.lang

window.l10n = l10n = BabelFish 'ru'

ruFormatting = require 'dictionary/formatting.js.ru_RU.yaml'
enFormatting = require 'dictionary/formatting.js.en_US.yaml'

l10n.load ruFormatting
l10n.load enFormatting

# l10n.setFallback 'ru', [ 'en' ]
# l10n.setFallback 'en', [ 'ru' ]

window.t = t = (key, params, _locale) ->
  _locale = locale  unless _locale?
  l10n.t.call l10n, _locale, key, params

# возврат undefined для ненайденных ключей
window.t_or_undef = t_or_undef = (key, params, _locale) ->
  _locale = locale  unless _locale?
  val = l10n.t.call l10n, _locale, key, params
  val = undefined  if val.match /No translation for/
  val

# поддержка фоллбека на ключ _default_ того же уровня, что и ненайденный запрашиваемый
window.t_or_default = t_or_default = (key, params, _locale) ->
  _locale = locale  unless _locale?
  val = t_or_undef key, params, _locale
  val = l10n.t.call l10n, _locale, key.replace( /\.[^.]+$/, '._default_' ), params  unless val
  val

l10n.datetime = ( dt, format, options ) ->
  return null  unless dt && format

  dt = new Date(dt * 1000)  if 'number' == typeof dt

  m = /^([^\.%]+)\.([^\.%]+)$/.exec format
  format = t("formatting.#{m[1]}.formats.#{m[2]}", options)  if m

  format = format.replace /(%[aAbBpP])/g, (id) ->
    switch id
      when '%a'
        t("formatting.date.abbr_day_names", { format: format })[dt.getDay()] # wday
      when '%A'
        t("formatting.date.day_names", { format: format })[dt.getDay()] # wday
      when '%b'
        t("formatting.date.abbr_month_names", { format: format })[dt.getMonth() + 1] # mon
      when '%B'
        t("formatting.date.month_names", { format: format })[dt.getMonth() + 1] # mon
      when '%p'
        t((if dt.getHours() < 12 then "formatting.time.am" else "formatting.time.pm"), { format: format }).toUpperCase()
      when '%P'
        t((if dt.getHours() < 12 then "formatting.time.am" else "formatting.time.pm"), { format: format }).toLowerCase()

  strftime.strftime format, dt


parseInt = window.parseInt
round = Math.round

isLeapYear = (date) ->
  year = date.getFullYear()
  return true  unless year % 400
  return true  unless year % 100
  return true  unless year % 4
  false

l10n.distance_of_time_in_words = ( from, to, options ) ->
  from = new Date(from * 1000)  if 'number' == typeof from
  to = new Date(to * 1000)  if 'number' == typeof to

  options = $.extend( {
      scope: 'formatting.datetime.distance_in_words'
  }, options || {} )

  [ from, to ] = [ to, from ]  if from > to

  distance_in_minutes = round( (to.valueOf() - from.valueOf())/60000.0 )
  distance_in_seconds = round( (to.valueOf() - from.valueOf())/1000.0 )

  return switch
    when distance_in_minutes < 2
      unless options.include_seconds
        if distance_in_minutes == 0
          t( options.scope + '.less_than_x_minutes', { count: 1 } )
        else
          t( options.scope + '.x_minutes', { count: distance_in_minutes } )
      switch
        when distance_in_seconds < 5
          t( options.scope + '.less_than_x_seconds', { count: 5 } )
        when distance_in_seconds < 10
          t( $options.scope + '.less_than_x_seconds', { count: 10 } )
        when distance_in_seconds < 20
          t( options.scope + '.less_than_x_seconds', { count: 20 } )
        when distance_in_seconds < 40
          t( options.scope + '.half_a_minute' )
        when distance_in_seconds < 60
          t( options.scope + '.less_than_x_minutes', { count: 1 } )
        else t( options.scope + '.x_minutes', { count: 1 } )

    when distance_in_minutes < 45
      t( options.scope + '.x_minutes', { count: distance_in_minutes } )
    when distance_in_minutes < 90
      t( options.scope + '.about_x_hours', { count: 1 } )
    # 90 mins up to 24 hours
    when distance_in_minutes < 1440
      t( options.scope + '.about_x_hours', { count: round( $distance_in_minutes / 60.0 ) } )
    # 24 hours up to 42 hours
    when distance_in_minutes < 2520
      t( options.scope + '.x_days', { count: 1 } )
    # 42 hours up to 30 days
    when distance_in_minutes < 43200
      t( options.scope + '.x_days', { count: round( distance_in_minutes / 1440.0 ) } )
    # 30 days up to 60 days
    when distance_in_minutes < 86400
      t( options.scope + '.about_x_months', { count: round( distance_in_minutes / 43200.0 ) } )
    # 60 days up to 365 days
    when distance_in_minutes < 525600
      t( options.scope + '.x_months', { count: round( distance_in_minutes / 43200.0 ) } )
    else
      [ fyear, tyear ] = [ from.getFullYear(), to.getFullYear() ]
      fyear++  if from.getMonth() >= 3
      tyear--  if to.getMonth() < 3
      leap_years = 0
      for year in [ fyear, tyear ]
        leap_years++  if isLeapYear(new Date(year, 1, 1))

      minute_offset_for_leap_year = leap_years * 1440
      # Discount the leap year days when calculating year distance.
      # e.g. if there are 20 leap year days between 2 dates having the same day
      # and month then the based on 365 days calculation
      # the distance in years will come out to over 80 years when in written
      # English it would read better as about 80 years.
      minutes_with_offset = distance_in_minutes - minute_offset_for_leap_year
      remainder           = minutes_with_offset % 525600
      distance_in_years   = parseInt( minutes_with_offset / 525600, 10 )
      switch
        when remainder < 131400
          t( options.scope + '.about_x_years',  { count: distance_in_years } )
        when remainder < 394200
          t( options.scope + '.over_x_years',   { count: distance_in_years } );
        else
          t( options.scope + '.almost_x_years', { count: distance_in_years + 1 } );

  null
