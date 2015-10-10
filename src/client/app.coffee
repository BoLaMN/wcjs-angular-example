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

.directive 'ptDetail', ->
  restrict: 'E'
  templateUrl: 'webchimera.html'
  controller: 'detailCtrl as chimera'

.controller 'detailCtrl', ($scope, playerConfig) ->
  vm = this

  vm.config = playerConfig.config

  $scope.$watch 'chimera.torrent.ready', (readyState) ->
    vm.config.controls = readyState

  return
