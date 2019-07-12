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
    PasswordChecker
}