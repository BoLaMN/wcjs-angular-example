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

  avaliablePalettes = [ 'blue-grey', 'grey', 'brown', 'deep-orange', 'orange', 'amber', 'yellow', 'lime', 'light-green', 'green', 'teal', 'cyan', 'light-blue', 'blue', 'indigo', 'deep-purple', 'purple', 'pink', 'red' ]
  activePaletteIndex = Math.floor Math.random() * 18
  activeAccentPaletteIndex = Math.floor Math.random() * 18

  $mdThemingProvider
    .theme 'default'
    .primaryPalette avaliablePalettes[activePaletteIndex], default: '500'
    .accentPalette avaliablePalettes[activeAccentPaletteIndex], default: '600'
    .backgroundPalette 'grey', default: '900'

  return 

.run ($rootScope, $mdColorPalette) ->

  $rootScope.getMaterialColor = (base, shade) ->
    color = $mdColorPalette[base][shade].value
    'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'

  return

.directive 'appPlayer', ->
  restrict: 'E'
  templateUrl: 'partials/player.html'
  controller: 'playerCtrl as player'

.controller 'playerCtrl', ($scope, playerConfig) ->
  vm = this

  vm.selectMediaFile = (file) ->
    vm.config.sources.push file: 'file://' + file.path, title: file.name, subs: []
    vm.show = true

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

.filter 'itemsFilter', ->
  (itemsLength) ->
    if itemsLength == 1
      itemsLength += ' item'
    else if itemsLength > 1
      itemsLength += ' items'
    else
      itemsLength = 'Empty'

    itemsLength

.filter 'bytesToSize', ->
  (bytes) ->
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'] 

    if bytes == 0
      return '0 Bytes'
    
    i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    
    Math.round(bytes / 1024 ** i, 2) + ' ' + sizes[i]

