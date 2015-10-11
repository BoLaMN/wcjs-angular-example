'use strict'

angular.module 'app'

.directive 'appFileDrop', ($parse, $timeout) ->
  restrict: 'A'
  link: (scope, elem, attr) ->
    cancel = null

    fn = $parse attr.appFileDrop

    elem[0].addEventListener 'dragover', (evt) ->
      $timeout.cancel cancel

      evt.stopPropagation()
      evt.preventDefault()

      elem.addClass 'dragover'
    , false

    elem[0].addEventListener 'dragleave', (evt) ->
      cancel = $timeout -> elem.removeClass 'dragover'
    , false

    elem[0].addEventListener 'drop', (evt) ->
      evt.stopPropagation()
      evt.preventDefault()

      elem.removeClass 'dragover'
      
      files = []
      fileList = evt.dataTransfer.files

      if fileList != null
        i = 0

        while i < fileList.length
          files.push fileList.item(i)
          i++

      $timeout -> fn scope, { $files: files, $event: evt }

    , false
