var request = require("request");
var _ = require('underscore');
var express = require('express');
var app = express(),
  http = require('http'),
  server = http.createServer(app),
  io = require('socket.io').listen(server);

var OrderBookApi = require('./ApiLoader.js');


/////////  Socket.io Configuration ////////////////////////////////

io.set('log level', 2); // Reduce socket logging
io.enable('browser client minification'); // send minified client
io.enable('browser client etag'); // apply etag caching logic based on version number
io.enable('browser client gzip'); // gzip the file
io.set('log level', 1); // reduce logging

// enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
io.set('transports', [
  'websocket', 'xhr-polling', 'flashsocket', 'htmlfile', 'jsonp-polling'
]);



////////  App Express configuration ///////////////////////

app.configure(function() {
  app.use(express.bodyParser());
  app.set('view engine', 'html');
  app.set('views', __dirname + '/web');
  app.use(express.static(__dirname + '/web'));
  app.use(express.logger());
  app.use(express.favicon(__dirname + '/web/img/favicon.ico'));
  app.use(app.router);
});


app.get('/', function(req, res) {
  res.sendfile("web/index.html");
});

app.get('/pushtest', function(req, res) {
  DataSender();
  res.send('Ok!');
});



// Schedule Interval Config  in milliseconds
var interval = {

  small: 1200, // 
  medium: 1500, //
  big: 5000 // 
}


///  Schedulers I dont like  this part 
var scheduler1 = setInterval(function() {

  OrderBookApi.LoadBitsampdata(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.medium);


var scheduler2 = setInterval(function() {

  OrderBookApi.LoadBtceData(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);


var scheduler3 = setInterval(function() {

  OrderBookApi.LoadCoinsetter(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);


var scheduler4 = setInterval(function() {

  OrderBookApi.LoadKraken(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);

var scheduler5 = setInterval(function() {

  OrderBookApi.LoadBitfinex(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);


/*
var scheduler6 = setInterval(function(){

    OrderBookApi.LoadItBitData(function(err, bids, asks){
        io.sockets.emit('echo', bids, asks);                 
    });
}, interval.small);

*/


var scheduler7 = setInterval(function() {
  OrderBookApi.LoadANX(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });
}, interval.small);


// var scheduler8 = setInterval(function(){
//   OrderBookApi.LoadHitBtc(function(err, bids, asks){
//             io.sockets.emit('echo', bids, asks);                 
//   });
// }, interval.small);


var scheduler9 = setInterval(function() {

  OrderBookApi.LoadOkcoin(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);


var scheduler10 = setInterval(function() {

  OrderBookApi.LoadCoinBase(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);

var scheduler11 = setInterval(function() {

  OrderBookApi.LoadLakeBTC(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);


var scheduler12 = setInterval(function() {

  OrderBookApi.LoadLiveCoins(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);

var scheduler13 = setInterval(function() {

  OrderBookApi.LoadGemini(function(err, bids, asks) {
    io.sockets.emit('echo', bids, asks);
  });

}, interval.small);


/* 
Cryptonit Still has problems
var scheduler11 = setInterval(function() {

  OrderBookApi.LoadCryptonit(function(err, bids, asks){
        io.sockets.emit('echo', bids, asks);                 
  });

}, interval.small);
*/


// Bitex stopped  API error 
// var scheduler9 = setInterval(function(){
//   OrderBookApi.Loadbitex(function(err, bids, asks){
//             io.sockets.emit('echo', bids, asks);                 
//   });
// }, interval.small);

//--
io.sockets.on('connection', function(socket) {});


//server.listen(80, '127.0.0.1');
server.listen(5000, '127.0.0.1'); // Production Server