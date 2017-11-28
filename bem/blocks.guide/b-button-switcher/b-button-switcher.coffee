window.Site?.App?.Views? or window.Site.namespace 'Site.App.Views'

window.JST = window.JST || {}
window.JST['b-button-switcher'] = require './b-button-switcher.jade'

class window.Site.App.Views.bButtonSwitcher
  stateMask: 'b-button-switcher_state_'

  constructor: (options) ->
    @el = options.el

  getState: =>
    re1 = new RegExp "\\b#{@stateMask}.*?\\b", 'g'
    re2 = new RegExp "#{@stateMask}", 'g'
    states = @el.className.match re1
    states.join(',').replace re2, ''

  setState: (state) =>
    re = new RegExp "\\b#{@stateMask}.*?\\b", 'g'
    @el.className = @el.className.replace re, ''
    @el.className += " #{@stateMask}" + state.split(',').join " #{@stateMask}"

    if ~state.indexOf 'processing'
      $(@el).prepend '<span class="b-button-switcher__processing"></span><span class="b-button-switcher__processing b-button-switcher__processing_delayed"></span>'
    else
      $('.b-button-switcher__processing', @el).remove()

  toggle: () =>
    state = @.getState()

    if state isnt 'on' and state isnt 'off'
      return false

    newState = if state is 'on' then 'off' else 'on'
    @setState newState

    $( '.b-button-switcher__hidden', @el ).prop
      checked: newState is 'on'

    false


###*
 * jQuery обертка для плагина {{#crossLink "Site.App.Views.bButtonSwitcher"}}{{/crossLink}}
 *
 *
 * @class bButtonSwitcher
 * @namespace $
 * @param {Object} [options] Настройки плагина
 * @submodule fn
 * @return {Object} экземпляр класса
###
$.fn.bButtonSwitcher = (options) ->
  isMany = if @.length > 1 then true else false
  result = if isMany then [] else null

  @.each ->
    instance = $(@).data 'instance-button-switcher'

    unless instance
      instance = new window.Site.App.Views.bButtonSwitcher
        el: @

      $(@).data 'instance-button-switcher', instance

    if isMany
      result.push(instance)
    else
      result = instance

    if $(@).hasClass 'b-button-switcher_js_toggle'
      $(@).on 'click', ->
        instance.toggle()

      $('.b-button-switched__hidden').on 'change', ->
        instance.toggle()


  result

$ ->
  $('.b-button-switcher_js_toggle').bButtonSwitcher();
