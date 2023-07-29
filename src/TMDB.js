const API_KEY = '7a3f5cb69dfa503abd04ca51b48fb6b5';
const API_KEY_TAG = 'api_key';
const API_BASE = 'api.themoviedb.org/3';
const API_SEARCH_TAG = 'discover';
const API_SORT_TAG = 'sort_by';
const API_GENRE_TAG = 'with_genres';
const API_TYPE_TAG = 'movie';

/**
 * FILMES A CONSULTAR NA API:
 * 28	    Action
 * 12	    Adventure
 * 16	    Animation
 * 35	    Comedy
 * 80	    Crime
 * 99	    Documentary
 * 18	    Drama
 * 10751	Family
 * 14	    Fantasy
 * 36	    History
 * 27	    Horror
 * 10402	Music
 * 9648	    Mystery
 * 10749	Romance
 * 878	    Science Fiction
 * 10770	TV Movie
 * 53	    Thriller
 * 10752	War
 * 37	    Western
 *
 */

 export default async function getAllMovies() {
    const url = `https://${API_BASE}/${API_SEARCH_TAG}/${API_TYPE_TAG}?${API_KEY_TAG}=${API_KEY}`;
    const request = fetch(url, {
        headers: {Accept: "application/json"}
    }).then(res => res.json());
    return request;
}

export function endpoint(categoria) {
    const request = fetch(
        buildUrl(categoria), {
            headers: {Accept: "application/json"}
        }
    ).then(res => res.json());
    return request;
}

function buildUrl(categoria) {
    //https://api.themoviedb.org/3/discover/movie/?api_key=7a3f5cb69dfa503abd04ca51b48fb6b5&with_genres=28
    //https://api.themoviedb.org/3/discover/movie?api_key=7a3f5cb69dfa503abd04ca51b48fb6b5&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28&with_watch_monetization_types=free
    return `https://${API_BASE}/${API_SEARCH_TAG}/${API_TYPE_TAG}?${API_KEY_TAG}=${API_KEY}&${API_GENRE_TAG}=${categoria}`;
}

