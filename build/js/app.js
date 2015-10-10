'use strict';
angular.module('app', ['ngSanitize', 'ngMaterial', 'ngAnimate', 'ngAria', 'wcjs-angular']).config(["$compileProvider", "$httpProvider", "$mdThemingProvider", "wcjsRendererProvider", function($compileProvider, $httpProvider, $mdThemingProvider, wcjsRendererProvider) {
  var platform;
  platform = process.platform;
  if (platform === 'darwin') {
    platform = 'osx';
  }
  wcjsRendererProvider.setAddonPath('./wcjs/' + platform);
  return $compileProvider.debugInfoEnabled(true);
}]).directive('ptDetail', function() {
  return {
    restrict: 'E',
    templateUrl: 'webchimera.html',
    controller: 'detailCtrl as chimera'
  };
}).controller('detailCtrl', ["$scope", "playerConfig", function($scope, playerConfig) {
  var vm;
  vm = this;
  vm.config = playerConfig.config;
  $scope.$watch('chimera.torrent.ready', function(readyState) {
    return vm.config.controls = readyState;
  });
}]);
