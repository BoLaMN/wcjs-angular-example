app      = require 'app'
main     = require './application'
manifest = require '../../package.json'
path = require 'path'

child_process = require 'child_process'

process.on 'uncaughtException', (error) -> 
  console.error error.stack

do ->
  app.on 'ready', ->
    global.application = new main manifest
    return
  return
