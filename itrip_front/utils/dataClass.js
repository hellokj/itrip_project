let TravelInfo = class {
    constructor(start, dest, mode, duration, distance, routes) {
        this.start = start;
        this.dest = dest;
        this.mode = mode;
        this.duration = duration;
        this.distance = distance;
        this.routes = routes;
    }
}

let UserInfo = class {
    constructor(name, email, url, password){
        this.name = name;
        this.email = email;
        this.url = url;
        this.password = password;
    }
}

export {
    TravelInfo,
    UserInfo
}
