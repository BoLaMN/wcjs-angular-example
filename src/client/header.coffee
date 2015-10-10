'use strict'

angular.module 'app'

.constant 'titleButtons',  
  win32: ['min', 'max', 'close']
  darwin: ['close', 'min', 'max']
  linux: ['min', 'max', 'close']

.directive 'appHeader', ->
  restrict: 'E'
  templateUrl: 'partials/header.html'
  controller: 'appHeaderCtrl as title'

.controller 'appHeaderCtrl', ($scope, $rootScope, titleButtons, ipc) ->
  vm = this

  vm.platform = process.platform
  vm.buttons = titleButtons[process.platform]

  vm.state = 
    fullscreen: false
    maximized: false

  vm.max = ->
    if vm.state.fullscreen
      vm.fullscreen()
    else
      if window.screen.availHeight <= ipc.height
        ipc.send 'unminimize'
        vm.state.maximized = false
      else
        ipc.send 'maximize'
        vm.state.maximized = true

  vm.min = ->
    ipc.send 'minimize'

  vm.close = ->
    ipc.send 'close'

  vm.fullscreen = ->
    ipc.send 'toggleFullscreen'
    vm.state.fullscreen = true

  return
