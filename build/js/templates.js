angular.module('ng').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/container.html',
    "<md-content flex layout=\"column\" style=\"overflow-y: hidden\">\n" +
    "\n" +
    "  <div layout=\"row\" layout-align=\"space-around\" ng-if=\"!files.folders\">\n" +
    "    <md-progress-circular value=\"{{browser.determinateValue}}\" md-mode=\"determinate\"></md-progress-circular>\n" +
    "  </div>\n" +
    "  \n" +
    "  <section class=\"dropzone-outter\"></section>\n" +
    "\n" +
    "  <div class=\"dropzone-inner\">\n" +
    "    <md-icon md-font-set=\"material-icons\">cloud_upload</md-icon>\n" +
    "    <h3>Drop files and folders here</h3>\n" +
    "    <div class=\"text-below\">Or use one of the buttons above.</div>\n" +
    "  </div>\n" +
    "\n" +
    "  <md-content layout-padding style=\"overflow: hidden;\">\n" +
    "    <app-files></app-files>\n" +
    "  </md-content>\n" +
    "</md-content>"
  );


  $templateCache.put('partials/header.html',
    "<div>\n" +
    "  <div class=\"os-controls {{ title.platform }}\">\n" +
    "      <div ng-repeat=\"button in title.buttons\" ng-click=\"title[button]()\" class=\"{{ button }}\"></div>\n" +
    "  </div>\n" +
    "\n" +
    "  <span>Angular WebChimera.js</span>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/info.html',
    "<div ng-init=\"movie = card\" class=\"movieInfo\" >\n" +
    "  <span class=\"icon-close close\"></span>\n" +
    "  <div class=\"header\" layout=\"row\" layout-wrap>\n" +
    "  \t<h2 flex=\"66\">{{movie.Title}}</h2>\n" +
    "    <h2 flex=\"33\" class=\"text-right\"><small>{{formatDate(movie.Released)}}</small></h2>\n" +
    "</div>\n" +
    "  <div class=\"body\">\n" +
    "  \t<div layout=\"row\" layout-wrap>\n" +
    "\t  \t<div flex=\"20\">\n" +
    "        <div class=\"progress-wrapper\">\n" +
    "          <div class=\"progress\">{{movie.imdbRating}}</div>\n" +
    "          <div\n" +
    "                  round-progress\n" +
    "                  max=\"10\"\n" +
    "                  current=\"movie.imdbRating\"\n" +
    "                  color=\"{{ ratedColor(movie.imdbRating) }}\"\n" +
    "                  bgcolor=\"{{ configRoundRate.bgColor }}\"\n" +
    "                  radius=\"{{ configRoundRate.radius }}\"\n" +
    "                  semi=\"configRoundRate.isSemi\"\n" +
    "                  rounded=\"configRoundRate.rounded\"\n" +
    "                  clockwise=\"configRoundRate.clockwise\"\n" +
    "                  stroke=\"{{ configRoundRate.stroke }}\"\n" +
    "                  animation=\"{{ configRoundRate.currentAnimation }}\"></div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div ng-init=\"knb = movie.imdbVotes.split(',');\" class=\"stat-picto\" flex=\"20\">\n" +
    "        <div class=\"text-center\">\n" +
    "          <i class=\"icon-bars\"></i><br>\n" +
    "          {{movie.imdbVotes}}\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div flex=\"20\" class=\"duration stat-picto\">\n" +
    "        <div class=\"text-center\">\n" +
    "          <i class=\"icon-clock\"></i><br>\n" +
    "          {{movie.Runtime}}\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <ul flex=\"40\" class=\"list-genre\" ng-init=\"genres = movie.Genre.split(',');\">\n" +
    "        \n" +
    "          <li class=\"label\" ng-repeat=\"genre in genres\">{{genre}}</li>\n" +
    "  \n" +
    "      </ul>\n" +
    "\t  \t<div flex=\"100\" class=\"plot\">\n" +
    "\t  \t\t<p>{{movie.Plot}}</p>\n" +
    "\t  \t</div>\n" +
    "\t  \t<div flex=\"100\" class=\"stars\">\n" +
    "\t  \t\t<p><b>Stars : </b>{{movie.Actors}}</p>\n" +
    "\t  \t</div>\n" +
    "  \t</div>\n" +
    "  \t\n" +
    "  </div>\n" +
    "  <div class=\"footer\" layout=\"row\">\n" +
    "    <md-button ng-click=\"moreInfo(movie)\" class=\"md-raised md-primary\"><i class=\"icon-link\"></i> IMDB Details</md-button>\n" +
    "    <md-button ng-click=\"playMovie(movie)\" class=\"md-raised md-primary\"><i class=\"icon-play3\"></i> Play</md-button>\n" +
    "  </div>\n" +
    "  \n" +
    "</div>"
  );


  $templateCache.put('partials/player.html',
    "\n" +
    "<div chimerangular wc-player-ready=\"chimera.onPlayerReady($API)\" style=\"height: 100%\"\n" +
    "     wc-config=\"chimera.config\"\n" +
    "     wc-complete=\"chimera.onCompleteVideo()\"\n" +
    "     wc-error=\"chimera.onError($event)\"\n" +
    "     wc-stop=\"chimera.player = null\"\n" +
    "     wc-can-play=\"chimera.player.canplay = true\"\n" +
    "     wc-update-time=\"chimera.onUpdateTime($currentTime, $duration)\"\n" +
    "     wc-update-volume=\"chimera.onUpdateVolume($volume)\"\n" +
    "     wc-update-state=\"chimera.onUpdateState($state)\"\n" +
    "     wc-auto-play=\"chimera.config.autoPlay\"\n" +
    "     wc-plays-inline=\"chimera.config.playsInline\">\n" +
    "\n" +
    "    <wc-media wc-src=\"chimera.torrent.files\"\n" +
    "              wc-loop=\"chimera.config.loop\"\n" +
    "              wc-preload=\"chimera.config.preload\">\n" +
    "    </wc-media>\n" +
    "\n" +
    "    <div ng-init=\"wcAutohideClass = { value: 'hide-animation' }\">\n" +
    "        <wc-top-controls wc-autohide=\"chimera.config.autoHide\" wc-autohide-time=\"chimera.config.autoHideTime\" wc-autohide-class=\"wcAutohideClass.value\">\n" +
    "            <wc-close-button></wc-close-button>\n" +
    "        </wc-top-controls>\n" +
    "\n" +
    "        <wc-bottom-controls ng-show=\"chimera.config.controls && chimera.player.canplay\" wc-autohide=\"chimera.config.autoHide\" wc-autohide-time=\"chimera.config.autoHideTime\" wc-autohide-class=\"wcAutohideClass.value\">\n" +
    "            <wc-play-pause-button></wc-play-pause-button>\n" +
    "            <wc-time-display>{{ currentTime | formatTime }}</wc-time-display>\n" +
    "            \n" +
    "            <wc-scrub-bar>\n" +
    "                <wc-scrub-bar-current-time></wc-scrub-bar-current-time>\n" +
    "            </wc-scrub-bar>\n" +
    "            \n" +
    "            <wc-time-display>{{ timeLeft | formatTime }}</wc-time-display>\n" +
    "            <wc-playback-button></wc-playback-button>\n" +
    "            \n" +
    "            <wc-subtitle subtitles=\"chimera.config.tracks\" current-subtitle=\"chimera.config.track\"></wc-subtitle>\n" +
    "            \n" +
    "            <wc-volume>\n" +
    "                <wc-mute-button></wc-mute-button>\n" +
    "                <wc-volume-bar></wc-volume-bar>\n" +
    "            </wc-volume>\n" +
    "            \n" +
    "            <wc-fullscreen-button></wc-fullscreen-button>\n" +
    "        </wc-bottom-controls>\n" +
    "\n" +
    "        <wc-next-video wc-next=\"chimera.config.next\" wc-time=\"3000\"></wc-next-video>\n" +
    "        <wc-torrent-info ng-hide=\"chimera.config.controls && chimera.player.canplay\" wc-torrent=\"chimera.torrent\" wc-player=\"chimera.player\"></wc-torrent-info>\n" +
    "        <wc-buffering ng-show=\"chimera.player.canplay\"></wc-buffering>\n" +
    "        <wc-overlay-play ng-if=\"chimera.config.controls && chimera.player.canplay\"></wc-overlay-play>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('partials/toolbar.html',
    "<md-toolbar style=\"min-height: 90px;\">\n" +
    "    <span class=\"flex\"></span>\n" +
    "    \n" +
    "    <div class=\"md-toolbar-tools md-toolbar-tools-bottom\">\n" +
    "      <md-button class=\"md-icon-button\" ng-click=\"selectFolder()\" hide-gt-md aria-label=\"{{ toolbar.title }}\">\n" +
    "        <md-icon md-font-set=\"material-icons\">folder_open</md-icon>\n" +
    "      </md-button>\n" +
    "\n" +
    "      <div class=\"breadcrumbs\" ng-repeat=\"breadcrumb in files.breadcrumbsUrls track by $index\">\n" +
    "        <div href=\"files\" ng-init=\"crumb = breadcrumb.split('/')\" ng-click=\"files.selectBreadcrumb($index)\">\n" +
    "          <span class=\"folderName\">\n" +
    "            {{crumb[crumb.length-1]}}<i ng-if=\"!$last\" style=\"padding: 0px 5px;\">/</i>\n" +
    "          </span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "\n" +
    "      <span flex></span>\n" +
    "      \n" +
    "      <md-search-autocomplete text-change=\"browser.searchTextChange(searchText)\" text=\"searchText\"></md-search-autocomplete>\n" +
    "\n" +
    "      <md-button class=\"md-icon-button\">\n" +
    "        <md-icon md-font-set=\"material-icons\">more_vert</md-icon>\n" +
    "      </md-button>\n" +
    "    </div>\n" +
    "</md-toolbar>"
  );

}]);
