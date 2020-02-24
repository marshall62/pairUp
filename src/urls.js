import {dateToMdy} from './dates.js';
export class URLs {
    static corsHost = process.env.REACT_APP_BACKEND_URI;
    static proxyHost = "/api";
    static host = process.env.REACT_APP_USE_CORS==="true" ? URLs.corsHost : URLs.proxyHost;
    static pre = URLs.host + "/rest/";
    static user = URLs.pre + "user";
    static term_year = URLs.pre + "term-year";
    static sections = URLs.pre + "sections";
    static rosters = URLs.pre + "rosters"; 
    static groups = URLs.pre + "groups";
    static attendance(secId) { return URLs.pre + "attendance-csv?secId=" + secId };

    static login = URLs.pre + "login-user";
    static logout = URLs.pre + "logout-user";


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

  // make an AJAX call that is capable of receiving cross-domain cookies and sending them
  static post_with_credentials = (url, formData) => {
    console.log("host ", URLs.host, "cors host ", URLs.corsHost);
    console.log("mode:",process.env.NODE_ENV)
    console.log("use_cors:" , process.env.REACT_APP_USE_CORS);
    return fetch(url, {
      method: 'post',
      mode: 'cors',
      credentials: 'include',
      body: formData
    })
    .then(response => {
        console.log("got response", response);
        if (response.status === 401) {
          alert("You must login");
          throw new Error("Login failed");
        }
        else {
          console.log("response status", response.status);
          return response;
        }
    })
  }

  // make an AJAX call that is capable of receiving cross-domain cookies and sending them
  static get_with_credentials = (url) => {
    return fetch(url, {
      method: 'get',
      mode: 'cors',
      credentials: 'include'
    })
    .then(response => {
        if (response.status === 401) {
            alert("You must login");
            throw new Error("Login failed");
        }
        else {
            console.log("response status", response.status);
            return response;
        }
    })
  }

  static get = (url) => {
    return fetch(url, {
      method: 'get',
      mode: 'cors'
    });
  }
    
}

// module.exports = URLs;