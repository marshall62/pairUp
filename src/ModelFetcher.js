export default class ModelFetcher {

    // get all the sections and set them in the state.
    // return the promise of fetch
    static getSections (year, term) {
        let url = 'http://localhost:5000/sections';
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

        return fetch(url)
            .then(result => result.clone().json());
            // .then(result => result.json());


    }

}

