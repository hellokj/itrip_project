const checkSortBy = (schema, query, sortBy) => {
    if(sortBy == 'checkins') {
        return schema.find(query).sort({checkins: -1});
    }
    else if(sortBy == 'ig_post_num') {
        return schema.find(query).sort({ig_post_num: -1});
    }
}

module.exports = checkSortBy;