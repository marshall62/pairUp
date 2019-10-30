export default class ModelFetcher {

    // get all the sections and set them in the state.
    // return the promise of fetch
    static getSections () {
        const url = 'http://localhost:5000/sections';
        return fetch(url)
            .then(result => result.clone().json());
            // .then(result => result.json());


    }
}

