'use strict';
angular.module('app', ['ngSanitize', 'ngMaterial', 'ngAnimate', 'ngAria', 'wcjs-angular']).config(["$compileProvider", "$httpProvider", "$mdThemingProvider", "wcjsRendererProvider", function($compileProvider, $httpProvider, $mdThemingProvider, wcjsRendererProvider) {
  var platform;
  platform = process.platform;
  if (platform === 'darwin') {
    platform = 'osx';
  }
  wcjsRendererProvider.setAddonPath('../wcjs/' + platform);
  $compileProvider.debugInfoEnabled(true);
  $mdThemingProvider.theme('default').primaryPalette('indigo').accentPalette('blue');
}]).directive('appPlayer', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/player.html',
    controller: 'playerCtrl as chimera'
  };
}).controller('playerCtrl', ["$scope", "playerConfig", function($scope, playerConfig) {
  var vm;
  vm = this;
  vm.config = playerConfig.config;
  $scope.$watch('chimera.torrent.ready', function(readyState) {
    return vm.config.controls = readyState;
  });
}]).directive('appToolbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/toolbar.html'
  };
}).directive('appContainer', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/container.html'
  };
}).constant('ipc', require('ipc'));

'use strict';

angular.module('app').constant('titleButtons', {
  win32: ['min', 'max', 'close'],
  darwin: ['close', 'min', 'max'],
  linux: ['min', 'max', 'close']
}).directive('appHeader', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/header.html',
    controller: 'appHeaderCtrl as title'
  };
}).controller('appHeaderCtrl', ["$scope", "$rootScope", "titleButtons", "ipc", function($scope, $rootScope, titleButtons, ipc) {
  var vm;
  vm = this;
  vm.platform = process.platform;
  vm.buttons = titleButtons[process.platform];
  vm.state = {
    fullscreen: false,
    maximized: false
  };
  vm.max = function() {
    if (vm.state.fullscreen) {
      return vm.fullscreen();
    } else {
      if (window.screen.availHeight <= ipc.height) {
        ipc.send('unminimize');
        return vm.state.maximized = false;
      } else {
        ipc.send('maximize');
        return vm.state.maximized = true;
      }
    }
  };
  vm.min = function() {
    return ipc.send('minimize');
  };
  vm.close = function() {
    return ipc.send('close');
  };
  vm.fullscreen = function() {
    ipc.send('toggleFullscreen');
    return vm.state.fullscreen = true;
  };
}]);

'use strict';

angular.module('app').directive('mdSearchAutocomplete', ["$animateCss", "$timeout", "$q", function($animateCss, $timeout, $q) {
  return {
    controller: function() {},
    controllerAs: 'search',
    scope: {
      searchText: '=?text',
      textChange: '&?textChange'
    },
    bindToController: true,
    template: '<md-button class="md-icon-button" style="float: left" aria-label="Open Search" ng-click="searchIconClicked($event)">\n  <md-icon md-font-set="material-icons">search</md-icon>\n</md-button>\n\n<md-input-container style="float: right; padding: 0px;" md-no-float flex>\n  <input md-contrast style="padding: 0px; line-height: 50px; color: rgba(255, 255, 255, 0.87); border-color: rgba(255, 255, 255, 0.97);" type="search"\n      ng-change="search.textChange()"\n      ng-model="search.searchText"\n      ng-blur="onBlur($event)"/>\n</md-input-container>',
    link: function(scope, element, attrs, ctrl) {
      var animateElement, input, inputContainer, timeout;
      input = element.find('input');
      inputContainer = element.find('md-input-container');
      timeout = null;
      animateElement = function(toWidth) {
        var defer;
        defer = $q.defer();
        if (!timeout) {
          timeout = $timeout(function() {
            return $animateCss(inputContainer, {
              from: {
                width: inputContainer.prop('clientWidth')
              },
              to: {
                width: toWidth
              },
              easing: 'cubic-bezier(0.35, 0, 0.25, 1)',
              duration: 0.4
            }).start().done(function() {
              defer.resolve();
              return timeout = null;
            });
          }, 225, false);
        } else {
          defer.reject();
        }
        return defer.promise;
      };
      scope.onBlur = function($event) {
        return animateElement('0px');
      };
      scope.searchIconClicked = function($event) {
        ctrl.searchText = null;
        animateElement('240px').then(function() {
          return input.focus();
        });
      };
      return inputContainer.css({
        width: '0px'
      });
    }
  };
}]);
