import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
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
const authRequest = axios.create({
  baseURL: SERVER_IP + '/api/auth/'
});

// itinerary api
const itineraryRequest = axios.create({
  baseURL: SERVER_IP + '/api/itinerary/'
});

// member api
const memberRequest = axios.create({
  baseURL: SERVER_IP + '/api/member/'
})

const requestList = [spotRequest, routingRequest, authRequest, itineraryRequest, memberRequest];
for(let i=0;i<requestList.length;i++) {
  // before a request is made start the nprogress
  requestList[i].interceptors.request.use(config => {
    NProgress.start()
    return config
  })

  // before a response is returned stop nprogress
  requestList[i].interceptors.response.use(response => {
    NProgress.done()
    return response
  })
}

const apiGetItineraries = (token) => {
  let headers = {
    "x-access-token": token
  }
  return itineraryRequest.post('/getItineraries', {} , {headers: headers});
};

// spot api
const apiGetSpots = (data) => {
  return spotRequest.get('/get', { params: data });
};

const apiGetNearby = (data) => {
  return spotRequest.get('/getNearby', { params: data });
}

const apiUpdateSpot = (data) => {
  return spotRequest.post('/update', data);
}

const apiDeleteSpot = (data) => {
  return spotRequest.post('/delete', data);
}




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
const apiSaveTrip = (_id, startDate, name, dayNum, startTimes, togos, travelInfos, token) => {
  let headers = {
    "Content-Type": "application/json",
    "x-access-token": token
  }
  if (_id == ""){
    _id = new Date().getTime();
  }
  let date = startDate.split('-');
  let data = {
    _id: _id,
    startDate: {
      year: parseInt(date[0]),
      month: parseInt(date[1]),
      day: parseInt(date[2])
    },
    startTimes: startTimes,
    name: name,
    dayNum: dayNum,
    togos: togos,
    travelInfos: travelInfos
  }
  console.log("data", data);
  return itineraryRequest.post('/save', data, { headers: headers });
};

// Auth api
const apiLogIn = (authData) => {
  return authRequest.post('/logIn', authData);
}

const apiSignUp = (user) => {
  return authRequest.post('/signUp', user);
}

// Member api
const apiGetMember = (userToken) => {
  let headers = {
    "Content-Type": "application/json",
    "x-access-token": userToken
  }
  return memberRequest.post('/getMember', {}, { headers: headers });
}

const apiModifyProfile = (memberInfo, userToken) => {
  let headers = {
    "Content-Type": "application/json",
    "x-access-token": userToken
  }
  return memberRequest.post('/modifyProfile', { memberInfo: memberInfo }, { headers: headers });
}

export {
    apiGetSpots,
    apiGetNearby,
    apiUpdateSpot,
    apiDeleteSpot,
    apiGetRoutes,
    apiGetItineraries,
    apiGetMember,
    apiLogIn,
    apiSignUp,
    apiModifyProfile,
    apiSaveTrip
}
