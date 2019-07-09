import axios from 'axios';
import {SERVER_IP, ORS_API_KEY} from '../src/config/config';

// spot相關的 api
const spotRequest = axios.create({
  baseURL: SERVER_IP + '/api/spot/'
});
// routing相關的 api
const routingRequest = axios.create({
  baseURL: 'https://api.openrouteservice.org/v2/'
});


// spot相關的 api
const apiGetSpots = function(data) {
    return spotRequest.get('/get', { params: data });
}

let headers = {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Authorization': ORS_API_KEY,
    'Content-Type': 'application/json'
}

// routing相關的 api
const apiGetRoutes = (data, mode) => {
    return routingRequest.post('/directions/' + mode + '/geojson', data, { headers: headers});
}

export {
    apiGetSpots,
    apiGetRoutes
}