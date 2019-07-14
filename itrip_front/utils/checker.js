// City checker
// city, county, city_state, state
const Checker = (body, list) => {
    for(let i=0;i<list.length;i++) {
        if(body[list[i]] != undefined) {
            return body[list[i]];
        }
    }
    return "";
}

const getAddress = (spotAddress) => {
    let address = '';
    let city = "";
    let suburb = "";
    let road = "";
    let number = "";
    city = Checker(spotAddress, ['state', 'city', 'city_state', 'county']);
    suburb = Checker(spotAddress, ['town', 'suburb', 'city_district', 'district']);
    road = Checker(spotAddress, ['road', 'pedestrian', 'city_district', 'district']);
    number =  Checker(spotAddress, ['house_number']);
    address = city.concat(suburb, road, number);
    return address;
}

// check email format
const EmailChecker = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// check password format
const PasswordChecker = (password) => {
    if(password.length < 6) {
        return false;
    }
    for(let i=0;i<password.length;i++) {
        if(password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
            return true;
        }
    }
    return false;
}

export {
    Checker,
    EmailChecker,
    PasswordChecker,
    getAddress
}