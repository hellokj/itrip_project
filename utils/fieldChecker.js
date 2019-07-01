const fieldChecker = (body, array) => {
    let key_list = Object.keys(body);
    for(let i=0;i<array.length;i++) {
        if(key_list.includes(array[i])) {
            return body[array[i]];
        }
    }
    return null;
}

module.exports = fieldChecker;