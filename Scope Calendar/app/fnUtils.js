// Number extension
Number.prototype.numberWithCommas = function () {
    var parts = this.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };


//  Date Extensions
/** Returns date as neat day string (offset from UTC calculated) */
Date.prototype.UTCToString = function () {
    this.setMinutes(this.getMinutes() + this.getTimezoneOffset());
    return this.toISOString().split('T')[0];
}

Date.prototype.neatTime = function () {
    let ampm= 'AM';
    let h= this.getUTCHours();
    let m= this.getUTCMinutes();
    if(h>= 12){
        if(h>12) h -= 12;
        ampm= 'PM';
    }

    if(m<10) m= '0'+m;
    return  (h + ':' + m +  ' ' + ampm);
};


// general useful global functions
export function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

//return false if a null object
export function hasValue(val){
    if(val == null || typeof val == 'undefined' || val.length === 0  || !val ){
        return false;
    }
    if(typeof val === 'object' && !Object.keys(val).length){
        return false;
    }
    return true;
}
