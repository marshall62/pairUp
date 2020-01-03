class URLs {
    static pre = "http://localhost:5000/";
    static sections = URLs.pre + "sections";
    static rosters = URLs.pre + "rosters"; 
    static groups = URLs.pre + "groups";
    static attendance(secId) { return URLs.pre + "attendance-csv?secId=" + secId };  
    
    static groups(secId, date, format) {
        let u = URLs.groups;
        if (secId && date) {
            u += "?secId=" + secId;
            u += "&date=" + dateToMdy(date);
        }
        if (format) 
            u += "&format=" + format
    }
    static sections(secId, date) {
        let u = URLs.sections;
        if (secId && date) {
            u += "?id=" + secId;
            u += "&date=" + date;
        }
    }
    
}

module.exports = URLs;