var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var express = require('express')
var app = express()
app.use(express.static('public'))
app.use(express.static('bower_components'))
app.listen(process.env.PORT || 3000)
