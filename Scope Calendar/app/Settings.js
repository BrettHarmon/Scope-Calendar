export const HOME_URL = "http://127.0.0.1:8080" //This is your computer IP, add to gitIgnore

 Number.prototype.numberWithCommas = function () {
    var parts = this.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

export function timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

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
