import {dateToMdy} from './dates.js';
export class URLs {
    static pre = "http://localhost:5000/";
    static sections = URLs.pre + "sections";
    static rosters = URLs.pre + "rosters"; 
    static groups = URLs.pre + "groups";
    static attendance(secId) { return URLs.pre + "attendance-csv?secId=" + secId };  
    
    static groups2(secId, date, format) {
        let u = URLs.groups;
        if (secId && date) {
            u += "?secId=" + secId;
            u += "&date=" + dateToMdy(date);
        }
        if (format) 
            u += "&format=" + format;
        return u;
    }
    static sections2(secId, date) {
        let u = URLs.sections;
        if (secId && date) {
            u += "?id=" + secId;
            u += "&date=" + dateToMdy(date);
        }
        return u;
    }
    
}

// module.exports = URLs;