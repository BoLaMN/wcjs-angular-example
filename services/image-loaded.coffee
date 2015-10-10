'use strict'

angular.module 'app.common-directives'

.directive 'imageLoaded', ($timeout, $Vibrant) ->
  restrict: 'A'
  scope: { colors: '=' }
  link: (scope, element, attrs) ->
    getPosterDetails = ->
      element.addClass 'fadein'

      $Vibrant.get(element[0]).then (colors) ->
        scope.colors = colors
      
      element.unbind 'load', getPosterDetails
      return
    
    element.bind 'load', getPosterDetails

    scope.$on '$destroy', ->
      element.unbind 'load', getPosterDetails

    return
