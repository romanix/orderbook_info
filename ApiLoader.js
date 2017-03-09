var util = require('util');
var request = require("request");
var _ = require('underscore');
var fs = require('fs');
var async = require('async');
var mathjs = require('mathjs'),
    var math = mathjs();
var moment = require('moment');


var logger = function(provider, errortext, jsondata) {

    return null;

    var path = './logs/' + provider + '_' + moment().valueOf() + '.log';
    var log = fs.createWriteStream(path, {
        'flags': 'a'
    });
    log.end(errortext + "\n" + jsondata, +"\n");
    //return null;
}



//-- Loacalbitcoins
var localbitcoinsOtions = {
    url: "http://matrix.itasoftware.com/",
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadLocalBitcoins = function(callback) {

    request(localbitcoinsOtions, function(error, response, body) {

        var exch = "localbitcoins";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('kraken Error: ', error);
            //logger(error, body);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        console.log('localbitcoins status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            //var bids =  _(jsonobj.bids).sortBy(function(obj) {  return obj[0] * -1  })
            //var bids =    jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('kraken Json Exeption: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }

        // _.each(bids, function(item){
        //      console.log(item);
        //      _BidsArr.data.push({ "ex" : exch, "amt" : parseFloat(item[0]), "bid" : item.price });                       
        // });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[0]),
                "ask": parseFloat(item[1])
            });
        });

        callback(null, _BidsArr, _AsksArr);
    });
}

//-- Tab adjusted !!!!
//-- Bitfinex
var bitfinexOtions = {
    url: "https://api.bitfinex.com/v1/book/btcusd",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadBitfinex = function(callback) {

    request(bitfinexOtions, function(error, response, body) {

        var exch = "Bitfinex";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('Bitfinex http Error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('bitfinex  status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);

            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('Bitfinex Json Exeption: ', e);
            //logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }

        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item.amount),
                "bid": parseFloat(item.price)
            });
        });

        _.each(asks, function(item) {

            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item.amount),
                "ask": parseFloat(item.price)
            });
        });


        callback(null, _BidsArr, _AsksArr);

    });

}


//-- Kraken 
var krakentterOtions = {
    url: "https://api.kraken.com/0/public/Depth?pair=XXBTZUSD",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadKraken = function(callback) {

    request(krakentterOtions, function(error, response, body) {

        var exch = "Kraken";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('kraken http Error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        // console.log('kraken  status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.result.XXBTZUSD.bids.slice(0, 10);
            var asks = jsonobj.result.XXBTZUSD.asks.slice(0, 10);

        } catch (e) {

            console.log('Kraken Json exeption: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }

        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {

            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });


        callback(null, _BidsArr, _AsksArr);

    });

}


//-- Coinsetter
var coinsetterOtions = {
    url: "https://api.coinsetter.com/v1/marketdata/depth",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadCoinsetter = function(callback) {

    request(coinsetterOtions, function(error, response, body) {

        var exch = "coinsetter";
        var _BidsArr = {
            ex: "coinsetter",
            data: []
        }
        var _AsksArr = {
            ex: "coinsetter",
            data: []
        }

        if (error) {
            console.log('Coinsetter http error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('coinsetter  status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            //var bids = jsonobj.bids.slice(0, 10);
            //var asks = jsonobj.asks.slice(0, 10);
        } catch (e) {

            console.log('Coinsetter Json Exption: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(jsonobj.topNBidAsks, function(item) {

            _BidsArr.data.push({
                "ex": exch,
                "amt": item.bid.size,
                "bid": item.bid.price
            });
            _AsksArr.data.push({
                "ex": exch,
                "amt": item.ask.size,
                "ask": item.ask.price
            });
        });

        callback(null, _BidsArr, _AsksArr);

    });
}


//-- Bitstamp 
var bitstampOptions = {
    url: "https://www.bitstamp.net/api/order_book/",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadBitsampdata = function(callback) {

    request(bitstampOptions, function(error, response, body) {

        var exch = "bitstamp";
        var _BidsArr = {
            ex: "bitstamp",
            data: []
        }
        var _AsksArr = {
            ex: "bitstamp",
            data: []
        }

        if (error) {
            console.log('Bistamp http Error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('Bistamp  status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('Bitstamp Json exeption: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }

        //-- Separate bids
        _.each(bids, function(val, key) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(val[1]),
                "bid": parseFloat(val[0])
            });
        });

        _.each(asks, function(val, key) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(val[1]),
                "ask": parseFloat(val[0])
            });
        });

        //-- Sort Data 
        //var sordetdata =  _(orderbookdata).sortBy(function(obj) {  return obj.diff  * -1 });

        callback(null, _BidsArr, _AsksArr);

    });
}


//-- Btc-e 
var btceOtions = {
    url: "https://btc-e.com/api/2/btc_usd/depth",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadBtceData = function(callback) {

    request(btceOtions, function(error, response, body) {

        var exch = "btc-e";
        var _BidsArr = {
            ex: "btc-e",
            data: []
        }
        var _AsksArr = {
            ex: "btc-e",
            data: []
        }

        if (error) {
            console.log('Btc-e http error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('Btce-E status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('btc-e http exeption: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }
        //-- Loop and  gergare in one line 
        _.each(bids, function(val, key) {
            _BidsArr.data.push({
                "ex": exch,
                "bid": val[0],
                "amt": val[1]
            });
        });

        _.each(asks, function(val, key) {
            _AsksArr.data.push({
                "ex": exch,
                "ask": val[0],
                "amt": val[1]
            });
        });

        //-- Sort Data 
        //-- var sordetdata =  _(orderbookdata).sortBy(function(obj) {  return obj.diff  * -1 });

        callback(null, _BidsArr, _AsksArr);
    });

}



//-- itBit
var itBitOtions = {
    url: "https://www.itbit.com/api/v2/markets/XBTUSD/orders",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadItBitData = function(callback) {

    request(itBitOtions, function(error, response, body) {

        var exch = "itBit";
        var _BidsArr = {
            ex: "itBit",
            data: []
        }
        var _AsksArr = {
            ex: "itBit",
            data: []
        }

        if (error) {
            console.log('itBit http error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('Btce-E status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('itBit http exeption: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }
        //-- Loop and  gergare in one line 
        _.each(bids, function(val, key) {
            _BidsArr.data.push({
                "ex": exch,
                "bid": parseFloat(val[0]),
                "amt": parseFloat(val[1])
            });
        });

        _.each(asks, function(val, key) {
            _AsksArr.data.push({
                "ex": exch,
                "ask": parseFloat(val[0]),
                "amt": parseFloat(val[1])
            });
        });

        //console.log("Roman ... itBit request", _BidsArr)
        //-- Sort Data 
        //-- var sordetdata =  _(orderbookdata).sortBy(function(obj) {  return obj.diff  * -1 });

        callback(null, _BidsArr, _AsksArr);
    });

}


//-- ANX

var ANXoptions = {
    url: "https://anxpro.com/api/2/BTCUSD/money/depth/full",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}


exports.LoadANX = function(callback) {

    request(ANXoptions, function(error, response, body) {

        var exch = "ANX";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('ANX Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('ANX status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);

            var bids = jsonobj.data.bids.slice(0, 10);
            var asks = jsonobj.data.asks.slice(0, 10);

            // var log = fs.createWriteStream('anx.txt', {'flags': 'a'}); 
            // log.end(util.inspect(bids , false, null) + "\n");                                  

        } catch (e) {

            console.log('Error: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item.amount),
                "bid": parseFloat(item.price)
            });
        });

        _.each(asks, function(item) {

            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item.amount),
                "ask": parseFloat(item.price)
            });
        });


        callback(null, _BidsArr, _AsksArr);

    });

}



////-- hitbtc
var hitbtcOptions = {
    url: "http://api.hitbtc.com/api/1/public/BTCUSD/orderbook",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadHitBtc = function(callback) {

    request(hitbtcOptions, function(error, response, body) {

        var exch = "hitbtc";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('ANX Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);

            //inspect(jsonobj.data.asks, 'jsonobj');

            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

            //inspect(bids, 'bids');
            // var log = fs.createWriteStream('anx.txt', {'flags': 'a'}); 
            // log.end(util.inspect(bids , false, null) + "\n");                                  

        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {

            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });


        callback(null, _BidsArr, _AsksArr);

    });

}



////-- Cryptonit

var cryptonitOtions = {
    url: "https://cryptonit.net/apiv2/rest/public/ccorder?bid_currency=btc&ask_currency=usd",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}


exports.LoadCryptonit = function(callback) {

    request(cryptonitOtions, function(error, response, body) {

        var exch = "cryptonit";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('Coinsetter http error: ', error);
            logger(exch, error, response);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('coinsetter  status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);

        } catch (e) {

            console.log('cryptonit Json Exption: ', e);
            logger(exch, e, body);
            return callback(null, _BidsArr, _AsksArr);
        }


        for (item in jsonobj) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(jsonobj[item].bid_amount),
                "bid": parseFloat(jsonobj[item].bid_rate)
            });
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(jsonobj[item].ask_amount),
                "ask": parseFloat(jsonobj[item].ask_rate)
            });
        }
        callback(null, _BidsArr, _AsksArr);
    });

}


var bitexOtions = {
    url: "https://bitex.la/api-v1/rest/btc/market/order_book",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.Loadbitex = function(callback) {

    request(bitexOtions, function(error, response, body) {

        var exch = "bitex";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('ANX Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);


        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });


        callback(null, _BidsArr, _AsksArr);


    });
}


// okcoin

var okcoinOptions = {
    url: "https://www.okcoin.com/api/v1/depth.do?symbol=btc_usd",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}


exports.LoadOkcoin = function(callback) {

    request(okcoinOptions, function(error, response, body) {

        var exch = "okcoin";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('ANX Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }

        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });

        callback(null, _BidsArr, _AsksArr);

    });
}


// lakebtc
var lakeBTCoptions = {
    url: "https://www.lakebtc.com/api_v1/bcorderbook",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadLakeBTC = function(callback) {

    request(lakeBTCoptions, function(error, response, body) {

        var exch = "lakebtc";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('ANX Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);

        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });

        callback(null, _BidsArr, _AsksArr);
    });
}


//-- Coinbase 

var coinbaseOptions = {
    url: "https://api.exchange.coinbase.com/products/BTC-USD/book?level=2",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadCoinBase = function(callback) {

    request(coinbaseOptions, function(error, response, body) {

        var exch = "coinbase";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('ANX Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);


        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });


        callback(null, _BidsArr, _AsksArr);


    });
}



//-- Live  coins

var livecoinsOptions = {
    url: "https://api.livecoin.net/exchange/order_book?currencyPair=BTC/USD",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}


exports.LoadLiveCoins = function(callback) {

    request(livecoinsOptions, function(error, response, body) {

        var exch = "livecoin";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('livecoin Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);


        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }


        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "bid": parseFloat(item[0])
            });
        });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item[1]),
                "ask": parseFloat(item[0])
            });
        });


        callback(null, _BidsArr, _AsksArr);


    });
}


//-- Gemini

var geminiOptions = {
    url: "https://api.gemini.com/v1/book/BTCUSD",
    strictSSL: false,
    method: 'GET',
    headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0"
    }
}

exports.LoadGemini = function(callback) {

    request(geminiOptions, function(error, response, body) {

        var exch = "gemini";
        var _BidsArr = {
            ex: exch,
            data: []
        }
        var _AsksArr = {
            ex: exch,
            data: []
        }

        if (error) {
            console.log('livecoin Error: ', error);
            return callback(null, _BidsArr, _AsksArr);
        }

        if (_.isUndefined(response)) {
            return callback(null, _BidsArr, _AsksArr);
        }

        //console.log('hitbtc status code: ', response.statusCode);

        try {

            var jsonobj = JSON.parse(body);
            var bids = jsonobj.bids.slice(0, 10);
            var asks = jsonobj.asks.slice(0, 10);
        } catch (e) {

            console.log('Error: ', e);
            return callback(null, _BidsArr, _AsksArr);
        }

        _.each(bids, function(item) {
            _BidsArr.data.push({
                "ex": exch,
                "amt": parseFloat(item.amount),
                "bid": parseFloat(item.price)
            });
        });

        _.each(asks, function(item) {
            _AsksArr.data.push({
                "ex": exch,
                "amt": parseFloat(item.amount),
                "ask": parseFloat(item.price)
            });
        });


        callback(null, _BidsArr, _AsksArr);

    });

}