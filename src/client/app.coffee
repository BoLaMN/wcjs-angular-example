'use strict'

angular.module 'app', [
  # vendor
  'ngSanitize'
  'ngMaterial'
  'ngAnimate'
  'ngAria'

  'wcjs-angular'
  
]

.config ($compileProvider, $httpProvider, $mdThemingProvider, wcjsRendererProvider) ->
  platform = process.platform

  if platform is 'darwin'
    platform = 'osx'

  wcjsRendererProvider.setAddonPath('../wcjs/' + platform)

  $compileProvider.debugInfoEnabled true

  $mdThemingProvider
    .theme 'default'
    .primaryPalette 'indigo'
    .accentPalette 'blue'

  return 

.directive 'appPlayer', ->
  restrict: 'E'
  templateUrl: 'partials/player.html'
  controller: 'playerCtrl as chimera'

.controller 'playerCtrl', ($scope, playerConfig) ->
  vm = this

  vm.config = playerConfig.config

  $scope.$watch 'chimera.torrent.ready', (readyState) ->
    vm.config.controls = readyState

  return

.directive 'appToolbar', ->
  restrict: 'E'
  templateUrl: 'partials/toolbar.html'
  #controller: 'ToolbarCtrl as toolbar'

.directive 'appContainer', ->
  restrict: 'E'
  templateUrl: 'partials/container.html'
  #controller: 'BrowserCtrl as browser'

.constant 'ipc', require 'ipc'