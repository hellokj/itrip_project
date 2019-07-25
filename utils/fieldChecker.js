const fieldChecker = (body, array) => {
    let key_list = Object.keys(body);
    for(let i=0;i<array.length;i++) {
        if(key_list.includes(array[i])) {
            return body[array[i]];
        }
    }
    return null;
}

const fieldCheckerForUpdate = (body, params) => {
    let key_list = Object.keys(body);
    for(let i=0;i<key_list.length;i++) {
        if(params[key_list[i]] !== undefined && params[key_list[i]] !== body[key_list[i]]) {
            body[key_list[i]] = params[key_list[i]]
        }
    }
}

module.exports = {fieldChecker, fieldCheckerForUpdate}