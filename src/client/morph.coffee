'use strict'

angular.module 'app'

.factory 'animationAssist', ->
  defaultStyles = 
    wrapper:
      'position': 'fixed'
      'z-index': '900'
      'opacity': '0'
      'margin': '0'
      'pointer-events': 'none'
      '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
    
    content:
      'transition': 'opacity 0.3s 0.3s ease'
      '-webkit-transition': 'opacity 0.3s 0.3s ease'
      'height': '0'
      'opacity': '0'
    
    morphable:
      'z-index': '1000'
      'outline': 'none'
    
    fade:
      'visibility': 'hidden'
      'opacity': '0'
      'position': 'fixed'
      'top': '0'
      'left': '0'
      'z-index': '800'
      'width': '100%'
      'height': '100%'
      'background': 'rgba(0,0,0,0.5)'
      '-webkit-transition': 'opacity 0.5s'
      'transition': 'opacity 0.5s'

  setBoundingRect: (element, positioning, callback) ->
    element.css
      'top': positioning.top + 'px'
      'left': positioning.left + 'px'
      'width': positioning.width + 'px'
      'height': positioning.height + 'px'
    
    if typeof callback == 'function'
      callback element
    
    return
  
  applyDefaultStyles: (element, elementName) ->
    if defaultStyles[elementName]
      element.css defaultStyles[elementName]
  
    return

.factory 'Morph', (Overlay, animationAssist) ->
  (elements, settings) ->
    MorphableBoundingRect = settings.MorphableBoundingRect
    
    # set wrapper bounding rectangle
    animationAssist.setBoundingRect elements.wrapper, MorphableBoundingRect
    
    # apply normal-state styles
    angular.forEach elements, (element, elementName) ->
      animationAssist.applyDefaultStyles element, elementName
      return
    
    Overlay elements, settings

.factory 'OverlayEnter', ->
  wrapper: (element, settings) ->
    element.css
      'z-index': 1900
      'opacity': 1
      'visibility': 'visible'
      'pointer-events': 'auto'
      'top': '0'
      'left': '0'
      'width': '100%'
      'height': '100%'
      '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
      'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'

    if settings.scroll != false
      setTimeout (->
        element.css 'overflow-y': 'scroll'
        return
      ), 500
    return
  
  content: (element, settings) ->
    element.css
      'height': null
      'transition': 'opacity 0.3s 0.5s ease'
      'visibility': 'visible'
      'opacity': '1'
    return
  
  morphable: (element, settings) ->
    element.css
      'z-index': 2000
      'opacity': 0
      '-webkit-transition': 'opacity 0.1s'
      'transition': 'opacity 0.1s'
    return

.factory 'OverlayExit', ->
  wrapper: (element, settings) ->
    MorphableBoundingRect = settings.MorphableBoundingRect
    setTimeout (->
      element.css
        'overflow': 'hidden'
        'position': 'fixed'
        'z-index': '900'
        'opacity': '0'
        'margin': 0
        'top': MorphableBoundingRect.top + 'px'
        'left': MorphableBoundingRect.left + 'px'
        'width': MorphableBoundingRect.width + 'px'
        'height': MorphableBoundingRect.height + 'px'
        'pointer-events': 'none'
        '-webkit-transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s'
        'transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s'
      return
    ), 100
    return
  
  content: (element, settings) ->
    element.css
      'transition': 'opacity 0.22s'
      '-webkit-transition': 'opacity 0.22s'
      'height': '0'
      'opacity': '0'
    
    setTimeout (->
      element.css 'visibility': 'hidden'
      return
    ), 70
    return
  
  morphable: (element, settings) ->
    element.css
      'z-index': 900
      'opacity': 1
      '-webkit-transition': 'opacity 0.1s 0.3s'
      'transition': 'opacity 0.1s 0.3s'
    return

.factory 'Overlay', (OverlayEnter, OverlayExit) ->
  (elements, settings) ->

    toggle: (isMorphed) ->
      if !isMorphed
        elements.wrapper.css
          transition: 'none'
          top: settings.MorphableBoundingRect.top + 'px'
          left: settings.MorphableBoundingRect.left + 'px'
        
        setTimeout (->
          angular.forEach elements, (element, elementName) =>
            if OverlayEnter[elementName]
              OverlayEnter[elementName] element, settings
            return
          return
        ), 25
      else
        angular.forEach elements, (element, elementName) =>
          if OverlayExit[elementName]
            OverlayExit[elementName] element, settings
          return

      !isMorphed

.directive 'appMorphOverlay', ($compile, Morph, $templateCache, $parse) ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    wrapper = angular.element('<div></div>').css 'visibility', 'hidden'
    settings = $parse attrs.appMorphOverlay
    
    settings = settings()

    isMorphed = false

    compile = (data) ->
      $compile(data) scope

    initMorphable = (content) ->
      closeEl = angular.element(content[0].querySelector(settings.closeEl))
      
      elements = 
        morphable: element
        wrapper: wrapper
        content: content
      
      # add to dom
      wrapper.append content
      element.after wrapper
      
      # set the wrapper bg color
      wrapper.css 'background', getComputedStyle(content[0]).backgroundColor
      
      # get bounding rectangles
      settings.MorphableBoundingRect = element[0].getBoundingClientRect()
      settings.ContentBoundingRect = content[0].getBoundingClientRect()
      
      # bootstrap the overlay
      overlay = new Morph(elements, settings)
      
      # attach event listeners
      element.bind 'click', ->
        settings.MorphableBoundingRect = element[0].getBoundingClientRect()
        isMorphed = overlay.toggle(isMorphed)
        return
      
      if closeEl
        closeEl.bind 'click', (event) ->
          settings.MorphableBoundingRect = element[0].getBoundingClientRect()
          isMorphed = overlay.toggle(isMorphed)
          return
      
      # remove event handlers when scope is destroyed
      scope.$on '$destroy', ->
        element.unbind 'click'
        closeEl.unbind 'click'
        return
      
      return

    if settings.template
      initMorphable compile(settings.template)
    else if settings.templateUrl
      initMorphable compile($templateCache.get(settings.templateUrl))

    return
