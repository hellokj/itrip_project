const NilChecker = (body, num, params) => {
    a_list = Object.keys(body)
    if(a_list.length + params.length < num){
        return true;
    }
    i = 0
    for(let n in a_list) {
        if(!params.includes(a_list[n])){
            i++;
        }
    }
    if(i == num - params.length) {
        return false;
    }
    else {
        return true;
    }
}

module.exports = NilChecker