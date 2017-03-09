
/**
 * Number.prototype.format(n, x)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */

Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};


/*
function format1(n, currency) {
    
    return currency + " " + n.toFixed(4).replace(/./g, function(c, i, a) {
        return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
}

*/

function format1(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}


function format2(n, currency) {

    if(_.isUndefined(n)) { return 'UNDEFINEEEED' };
    return currency + " " + n.toFixed(4).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}



function formatBitcoinOdrer(n, currency) {

    var curr  =  currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    var btc = curr.split('.');
    var finalCurrency = '<span class="price">'+ btc[0] +'.<span class="cents">'+btc[1]+'</span></span>'

    return finalCurrency;

}


function formatBitcoin(n, currency) {
   return currency + " " + n.toFixed(4).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}




//-- Remove  0.0000  
function roundMoney(val) {

    var value = val.toString().replace(",", ".");
    var n = value.split(".");
    var strResult = "";
    if (n.length == 2)
    {
        strResult = n[0] + "." + n[1].substring(0, 4);
    } else {

        strResult = n[0];
    }
    
    return parseFloat(strResult);
}




