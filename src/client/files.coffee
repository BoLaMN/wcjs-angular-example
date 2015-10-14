'use strict'

angular.module 'app'

.constant 'fs', require 'fs'
.constant 'path', require 'path'

.factory 'FileBrowser', (fs, $q, path) ->

  walk = (dir, recurse = true) ->
    if !fs.existsSync(dir)
      return []
    fs.readdirSync(dir).filter((f) ->
      f and f[0] != '.'
    ).map (f) ->
      p = (dir + '/' + f).replace('./', '')
      stat = fs.statSync(p)
      if stat.isDirectory()
        return {
          name: f
          type: 'folder'
          path: p
          items: walk(p, false) if recurse
        }
      {
        name: f
        type: 'file'
        path: p
        ext: path.extname(f).slice 1
        size: stat.size
      }

  scan: (dir, alias) ->
    $q.when {
      name: path.dirname dir
      type: 'folder'
      path: path.dirname dir
      items: walk(dir)
    }

.controller 'filesCtrl', (FileBrowser) ->
  vm = this 

  ipc = require 'ipc'

  currentPath = ''

  vm.breadcrumbsUrls = []

  vm.files = []
  vm.folders = []

  userDir = ipc.sendSync 'userdir', null

  generateBreadcrumbs = (nextDir) ->
    path = nextDir.split('/').slice(0)
    i = 1
    
    while i < path.length
      path[i] = path[i - 1] + '/' + path[i]
      i++
    
    path

  vm.handleDrop = ($files, $event) ->
    console.log $files, $event
      
  vm.selectBreadcrumb = (index) ->
    nextDir = vm.breadcrumbsUrls[index]
    
    vm.breadcrumbsUrls.length = Number(index)
    vm.openFolder nextDir
    return

  searchData = (data, searchTerms) ->
    data.forEach (d) ->
      if d.type is 'folder'
        searchData d.items, searchTerms
        if d.name.toLowerCase().match(searchTerms)
          folders.push d
      else if d.type is 'file'
        if d.name.toLowerCase().match(searchTerms)
          files.push d
      return

    folders: folders
    files: files

  render = (data) ->
    if Array.isArray data
      data.forEach (d) ->
        if d.type == 'folder'
          vm.folders.push d
        else if d.type == 'file'
          vm.files.push d
        return
    else if typeof data == 'object'
      vm.folders = data.folders
      vm.files = data.files

  vm.openFolder = (nextDir) ->
    vm.files = []
    vm.folders = []

    FileBrowser.scan(nextDir).then (data) ->
      hash = nextDir.split '/'

      if hash.length > 1
        currentPath = hash[0]
        vm.breadcrumbsUrls = generateBreadcrumbs nextDir
        render data.items
      else
        currentPath = data.path
        vm.breadcrumbsUrls.push data.path
        render data.items

      currentPath = nextDir

      return

  vm.openFolder userDir
  
  return

.directive 'appFiles', ->
  restrict: 'E'
  template: '''
    <ul class="app-grid">
      <li md-ink-ripple md-colspan="2" ng-repeat="folder in files.folders track by folder.path" ng-click="files.openFolder(folder.path)">
        <div title="{{ folder.path }}" class="folders">
          <span class="icon folder" ng-class="{ 'full': folder.items.length }"></span>

          <span class="name">
            {{ folder.name }}
          </span> 

          <span class="details">
            {{ folder.items.length | itemsFilter }}
          </span>
        </div>
      </li>

      <li ng-click="player.selectMediaFile(file);" ng-repeat="file in files.files track by file.path">
        <div title="{{ file.path }}" class="files">
          <span class="icon file f-{{ file.ext }}">
            {{ file.ext }}
          </span>

          <span class="name">
            {{ file.name }}
          </span> 
          
          <span class="details">
            {{ file.size | bytesToSize }}
          </span>
        </div>
      </li>
    </ul'''
  controller: 'filesCtrl as files'
