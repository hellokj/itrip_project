import axios from 'axios';
import {SERVER_IP, ORS_API_KEY} from '../src/config/config';

// spot api
const spotRequest = axios.create({
  baseURL: SERVER_IP + '/api/spot/'
});
// routing api
const routingRequest = axios.create({
  baseURL: 'https://api.openrouteservice.org/v2/'
});
// logIn signUp相關的 api
const AuthRequest = axios.create({
  baseURL: SERVER_IP + '/api/auth/'
});

// itinerary api
const itineraryRequest = axios.create({
  baseURL: SERVER_IP + '/api/itinerary/'
});

// spot api
const apiGetSpots = (data) => {
    return spotRequest.get('/get', { params: data });
};

let headers = {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Authorization': ORS_API_KEY,
    'Content-Type': 'application/json'
};

// routing api
const apiGetRoutes = (data, mode) => {
    return routingRequest.post('/directions/' + mode + '/geojson', data, { headers: headers});
};

// itinerary api
//{_id: Number, memberId: Number, startDate: {year: Number, month: Number, day: Number}, name: String, dayNum: Number, togos: Array, travelInfos: Array}
const apiSaveTrip = (memberId, startDate, name, dayNum, togos, travelInfos) => {
  let date = startDate.split('-');
  let data = {
    memberId: memberId,
    startDate: {
      year: parseInt(date[0]),
      month: parseInt(date[1]),
      day: parseInt(date[2])
    },
    name: name,
    dayNum: dayNum,
    togos: togos,
    travelInfos: travelInfos
  }
  return itineraryRequest.post('/save', data);
};

const apiLogIn = (authData) => {
  return AuthRequest.post('logIn/', authData);
}

const apiSignUp = (user) => {
  return AuthRequest.post('signUp/', user);
}

export {
    apiGetSpots,
    apiGetRoutes,
    apiLogIn,
    apiSignUp,
    apiSaveTrip
}
