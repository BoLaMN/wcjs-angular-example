'use strict';
angular.module('app', ['ngSanitize', 'ngMaterial', 'ngAnimate', 'ngAria', 'wcjs-angular']).config(["$compileProvider", "$httpProvider", "$mdThemingProvider", "wcjsRendererProvider", function($compileProvider, $httpProvider, $mdThemingProvider, wcjsRendererProvider) {
  var activeAccentPaletteIndex, activePaletteIndex, avaliablePalettes, platform;
  platform = process.platform;
  if (platform === 'darwin') {
    platform = 'osx';
  }
  wcjsRendererProvider.setAddonPath('../wcjs/' + platform);
  $compileProvider.debugInfoEnabled(true);
  avaliablePalettes = ['blue-grey', 'grey', 'brown', 'deep-orange', 'orange', 'amber', 'yellow', 'lime', 'light-green', 'green', 'teal', 'cyan', 'light-blue', 'blue', 'indigo', 'deep-purple', 'purple', 'pink', 'red'];
  activePaletteIndex = Math.floor(Math.random() * 18);
  activeAccentPaletteIndex = Math.floor(Math.random() * 18);
  $mdThemingProvider.theme('default').primaryPalette(avaliablePalettes[activePaletteIndex], {
    "default": '500'
  }).accentPalette(avaliablePalettes[activeAccentPaletteIndex], {
    "default": '600'
  }).backgroundPalette('grey', {
    "default": '900'
  });
}]).run(["$rootScope", "$mdColorPalette", function($rootScope, $mdColorPalette) {
  $rootScope.getMaterialColor = function(base, shade) {
    var color;
    color = $mdColorPalette[base][shade].value;
    return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
  };
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
}).constant('ipc', require('ipc')).filter('itemsFilter', function() {
  return function(itemsLength) {
    if (itemsLength === 1) {
      itemsLength += ' item';
    } else if (itemsLength > 1) {
      itemsLength += ' items';
    } else {
      itemsLength = 'Empty';
    }
    return itemsLength;
  };
}).filter('bytesToSize', function() {
  return function(bytes) {
    var i, sizes;
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
      return '0 Bytes';
    }
    i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };
});

'use strict';

angular.module('app').directive('appFileDrop', ["$parse", "$timeout", function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      var cancel, fn;
      cancel = null;
      fn = $parse(attr.appFileDrop);
      elem[0].addEventListener('dragover', function(evt) {
        $timeout.cancel(cancel);
        evt.stopPropagation();
        evt.preventDefault();
        return elem.addClass('dragover');
      }, false);
      elem[0].addEventListener('dragleave', function(evt) {
        return cancel = $timeout(function() {
          return elem.removeClass('dragover');
        });
      }, false);
      return elem[0].addEventListener('drop', function(evt) {
        var fileList, files, i;
        evt.stopPropagation();
        evt.preventDefault();
        elem.removeClass('dragover');
        files = [];
        fileList = evt.dataTransfer.files;
        if (fileList !== null) {
          i = 0;
          while (i < fileList.length) {
            files.push(fileList.item(i));
            i++;
          }
        }
        return $timeout(function() {
          return fn(scope, {
            $files: files,
            $event: evt
          });
        });
      }, false);
    }
  };
}]);

'use strict';

angular.module('app').constant('fs', require('fs')).constant('path', require('path')).factory('FileBrowser', ["fs", "$q", "path", function(fs, $q, path) {
  var walk;
  walk = function(dir, recurse) {
    if (recurse == null) {
      recurse = true;
    }
    if (!fs.existsSync(dir)) {
      return [];
    }
    return fs.readdirSync(dir).filter(function(f) {
      return f && f[0] !== '.';
    }).map(function(f) {
      var p, stat;
      p = (dir + '/' + f).replace('./', '');
      stat = fs.statSync(p);
      if (stat.isDirectory()) {
        return {
          name: f,
          type: 'folder',
          path: p,
          items: recurse ? walk(p, false) : void 0
        };
      }
      return {
        name: f,
        type: 'file',
        path: p,
        ext: path.extname(f).slice(1),
        size: stat.size
      };
    });
  };
  return {
    scan: function(dir, alias) {
      return $q.when({
        name: path.dirname(dir),
        type: 'folder',
        path: path.dirname(dir),
        items: walk(dir)
      });
    }
  };
}]).controller('filesCtrl', ["FileBrowser", function(FileBrowser) {
  var currentPath, generateBreadcrumbs, ipc, render, searchData, userDir, vm;
  vm = this;
  ipc = require('ipc');
  currentPath = '';
  vm.breadcrumbsUrls = [];
  vm.files = [];
  vm.folders = [];
  userDir = ipc.sendSync('userdir', null);
  generateBreadcrumbs = function(nextDir) {
    var i, path;
    path = nextDir.split('/').slice(0);
    i = 1;
    while (i < path.length) {
      path[i] = path[i - 1] + '/' + path[i];
      i++;
    }
    return path;
  };
  vm.handleDrop = function($files, $event) {
    return console.log($files, $event);
  };
  vm.selectBreadcrumb = function(index) {
    var nextDir;
    nextDir = vm.breadcrumbsUrls[index];
    vm.breadcrumbsUrls.length = Number(index);
    vm.openFolder(nextDir);
  };
  searchData = function(data, searchTerms) {
    data.forEach(function(d) {
      if (d.type === 'folder') {
        searchData(d.items, searchTerms);
        if (d.name.toLowerCase().match(searchTerms)) {
          folders.push(d);
        }
      } else if (d.type === 'file') {
        if (d.name.toLowerCase().match(searchTerms)) {
          files.push(d);
        }
      }
    });
    return {
      folders: folders,
      files: files
    };
  };
  render = function(data) {
    if (Array.isArray(data)) {
      return data.forEach(function(d) {
        if (d.type === 'folder') {
          vm.folders.push(d);
        } else if (d.type === 'file') {
          vm.files.push(d);
        }
      });
    } else if (typeof data === 'object') {
      vm.folders = data.folders;
      return vm.files = data.files;
    }
  };
  vm.openFolder = function(nextDir) {
    vm.files = [];
    vm.folders = [];
    return FileBrowser.scan(nextDir).then(function(data) {
      var hash;
      hash = nextDir.split('/');
      if (hash.length > 1) {
        currentPath = hash[0];
        vm.breadcrumbsUrls = generateBreadcrumbs(nextDir);
        render(data.items);
      } else {
        currentPath = data.path;
        vm.breadcrumbsUrls.push(data.path);
        render(data.items);
      }
      currentPath = nextDir;
    });
  };
  vm.openFolder(userDir);
}]).directive('appFiles', function() {
  return {
    restrict: 'E',
    template: '<ul class="app-grid">\n  <li md-ink-ripple md-colspan="2" ng-repeat="folder in files.folders track by folder.path" ng-click="files.openFolder(folder.path)">\n    <div title="{{ folder.path }}" class="folders">\n      <span class="icon folder" ng-class="{ \'full\': folder.items.length }"></span>\n\n      <span class="name">\n        {{ folder.name }}\n      </span> \n\n      <span class="details">\n        {{ folder.items.length | itemsFilter }}\n      </span>\n    </div>\n  </li>\n\n  <li app-morph-overlay="{ \'closeEl\': \'.close\', \'templateUrl\': \'partials/player.html\' }" ng-repeat="file in files.files track by file.path">\n    <div title="{{ file.path }}" class="files">\n      <span class="icon file f-{{ file.ext }}">\n        {{ file.ext }}\n      </span>\n\n      <span class="name">\n        {{ file.name }}\n      </span> \n      \n      <span class="details">\n        {{ file.size | bytesToSize }}\n      </span>\n    </div>\n  </li>\n</ul',
    controller: 'filesCtrl as files'
  };
});

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

angular.module('app').factory('animationAssist', function() {
  var defaultStyles;
  defaultStyles = {
    wrapper: {
      'position': 'fixed',
      'z-index': '900',
      'opacity': '0',
      'margin': '0',
      'pointer-events': 'none',
      '-webkit-transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
      'transition': 'opacity 0.3s 0.5s, width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
    },
    content: {
      'transition': 'opacity 0.3s 0.3s ease',
      '-webkit-transition': 'opacity 0.3s 0.3s ease',
      'height': '0',
      'opacity': '0'
    },
    morphable: {
      'z-index': '1000',
      'outline': 'none'
    },
    fade: {
      'visibility': 'hidden',
      'opacity': '0',
      'position': 'fixed',
      'top': '0',
      'left': '0',
      'z-index': '800',
      'width': '100%',
      'height': '100%',
      'background': 'rgba(0,0,0,0.5)',
      '-webkit-transition': 'opacity 0.5s',
      'transition': 'opacity 0.5s'
    }
  };
  return {
    setBoundingRect: function(element, positioning, callback) {
      element.css({
        'top': positioning.top + 'px',
        'left': positioning.left + 'px',
        'width': positioning.width + 'px',
        'height': positioning.height + 'px'
      });
      if (typeof callback === 'function') {
        callback(element);
      }
    },
    applyDefaultStyles: function(element, elementName) {
      if (defaultStyles[elementName]) {
        element.css(defaultStyles[elementName]);
      }
    }
  };
}).factory('Morph', ["Overlay", "animationAssist", function(Overlay, animationAssist) {
  return function(elements, settings) {
    var MorphableBoundingRect;
    MorphableBoundingRect = settings.MorphableBoundingRect;
    animationAssist.setBoundingRect(elements.wrapper, MorphableBoundingRect);
    angular.forEach(elements, function(element, elementName) {
      animationAssist.applyDefaultStyles(element, elementName);
    });
    return Overlay(elements, settings);
  };
}]).factory('OverlayEnter', function() {
  return {
    wrapper: function(element, settings) {
      element.css({
        'z-index': 1900,
        'opacity': 1,
        'visibility': 'visible',
        'pointer-events': 'auto',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100%',
        '-webkit-transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s',
        'transition': 'width 0.4s 0.1s, height 0.4s 0.1s, top 0.4s 0.1s, left 0.4s 0.1s, margin 0.4s 0.1s'
      });
      if (settings.scroll !== false) {
        setTimeout((function() {
          element.css({
            'overflow-y': 'scroll'
          });
        }), 500);
      }
    },
    content: function(element, settings) {
      element.css({
        'height': null,
        'transition': 'opacity 0.3s 0.5s ease',
        'visibility': 'visible',
        'opacity': '1'
      });
    },
    morphable: function(element, settings) {
      element.css({
        'z-index': 2000,
        'opacity': 0,
        '-webkit-transition': 'opacity 0.1s',
        'transition': 'opacity 0.1s'
      });
    }
  };
}).factory('OverlayExit', function() {
  return {
    wrapper: function(element, settings) {
      var MorphableBoundingRect;
      MorphableBoundingRect = settings.MorphableBoundingRect;
      setTimeout((function() {
        element.css({
          'overflow': 'hidden',
          'position': 'fixed',
          'z-index': '900',
          'opacity': '0',
          'margin': 0,
          'top': MorphableBoundingRect.top + 'px',
          'left': MorphableBoundingRect.left + 'px',
          'width': MorphableBoundingRect.width + 'px',
          'height': MorphableBoundingRect.height + 'px',
          'pointer-events': 'none',
          '-webkit-transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s',
          'transition': 'opacity 0.3s 0.5s, width 0.35s 0.1s, height 0.35s 0.1s, top 0.35s 0.1s, left 0.35s 0.1s, margin 0.35s 0.1s'
        });
      }), 100);
    },
    content: function(element, settings) {
      element.css({
        'transition': 'opacity 0.22s',
        '-webkit-transition': 'opacity 0.22s',
        'height': '0',
        'opacity': '0'
      });
      setTimeout((function() {
        element.css({
          'visibility': 'hidden'
        });
      }), 70);
    },
    morphable: function(element, settings) {
      element.css({
        'z-index': 900,
        'opacity': 1,
        '-webkit-transition': 'opacity 0.1s 0.3s',
        'transition': 'opacity 0.1s 0.3s'
      });
    }
  };
}).factory('Overlay', ["OverlayEnter", "OverlayExit", function(OverlayEnter, OverlayExit) {
  return function(elements, settings) {
    return {
      toggle: function(isMorphed) {
        if (!isMorphed) {
          elements.wrapper.css({
            transition: 'none',
            top: settings.MorphableBoundingRect.top + 'px',
            left: settings.MorphableBoundingRect.left + 'px'
          });
          setTimeout((function() {
            angular.forEach(elements, (function(_this) {
              return function(element, elementName) {
                if (OverlayEnter[elementName]) {
                  OverlayEnter[elementName](element, settings);
                }
              };
            })(this));
          }), 25);
        } else {
          angular.forEach(elements, (function(_this) {
            return function(element, elementName) {
              if (OverlayExit[elementName]) {
                OverlayExit[elementName](element, settings);
              }
            };
          })(this));
        }
        return !isMorphed;
      }
    };
  };
}]).directive('appMorphOverlay', ["$compile", "Morph", "$templateCache", "$parse", function($compile, Morph, $templateCache, $parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var compile, initMorphable, isMorphed, settings, wrapper;
      wrapper = angular.element('<div></div>').css('visibility', 'hidden');
      settings = $parse(attrs.appMorphOverlay);
      settings = settings();
      isMorphed = false;
      compile = function(data) {
        return $compile(data)(scope);
      };
      initMorphable = function(content) {
        var closeEl, elements, overlay;
        closeEl = angular.element(content[0].querySelector(settings.closeEl));
        elements = {
          morphable: element,
          wrapper: wrapper,
          content: content
        };
        wrapper.append(content);
        element.after(wrapper);
        wrapper.css('background', getComputedStyle(content[0]).backgroundColor);
        settings.MorphableBoundingRect = element[0].getBoundingClientRect();
        settings.ContentBoundingRect = content[0].getBoundingClientRect();
        overlay = new Morph(elements, settings);
        element.bind('click', function() {
          settings.MorphableBoundingRect = element[0].getBoundingClientRect();
          isMorphed = overlay.toggle(isMorphed);
        });
        if (closeEl) {
          closeEl.bind('click', function(event) {
            settings.MorphableBoundingRect = element[0].getBoundingClientRect();
            isMorphed = overlay.toggle(isMorphed);
          });
        }
        scope.$on('$destroy', function() {
          element.unbind('click');
          closeEl.unbind('click');
        });
      };
      if (settings.template) {
        initMorphable(compile(settings.template));
      } else if (settings.templateUrl) {
        initMorphable(compile($templateCache.get(settings.templateUrl)));
      }
    }
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
