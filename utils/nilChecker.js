const NilChecker = (body, num, params) => {
    a_list = Object.keys(body)
    if(a_list.length + params.length < num){
        return true;
    }
    i = 0
    for(let j=0;j<a_list.length;j++) {
        if(!params.includes(a_list[j])){
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