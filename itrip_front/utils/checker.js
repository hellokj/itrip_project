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

export {
    Checker
}