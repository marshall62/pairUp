import {URLs} from './urls';


export default class ModelFetcher {

    // get all the sections .
    // return the promise of fetch
    static getSections (year, term) {
        let url = URLs.sections;
        let arg1 = false;
        console.log('getSections',year,term);
        if (year) {
            url += '?year='+year;
            arg1 = true;
        }
        if (term) {
            url += arg1 ? '&' : '?'
            url += 'term=' + term;
        }
        return URLs.get_with_credentials(url).then(result => result.clone().json());
        // return fetch(url)
            // .then(result => result.clone().json());



    }

}

