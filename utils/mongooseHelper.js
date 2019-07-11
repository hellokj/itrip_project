// Pagination options
const myCustomLabels = {
    totalDocs: 'spotCount',
    docs: 'resultList',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};

const Options = (sortBy, page, limit, order) => {
    if(sortBy == 'checkins') {
        return {
            page: page,
            limit: limit,
            sort: { checkins: order},
            customLabels: myCustomLabels
        };
    }
    else if(sortBy == 'ig_post_num') {
        return {
            page: page,
            limit: limit,
            sort: { ig_post_num: order},
            customLabels: myCustomLabels
        };
    }
  }

// query for place search => shortening
const Place_query = (schema, city, region, category, sortBy, page, limit, order) => {
    if(region === undefined) {
        if(category == undefined) {
            return schema.paginate(
                {$or: [{"address.city": city}, {"address.state": city}, {"address.county": city}]}, 
                Options(sortBy, page, limit, order), 
                function(err, result) {
                    return result;
            });   
        }
        return schema.paginate(
            {$or: [{"address.city": city}, {"address.state": city}, {"address.county": city}], category: category}, 
            Options(sortBy, page, limit, order), 
            function(err, result) {
                return result;
        });   
    }
    else {
        if(category == undefined) {
            return schema.paginate(
                {$and:[
                    {$or: [{"address.city": city}, {"address.state": city},{"address.county": city}]},
                    {$or: [{"address.suburb": region}, {"address.town": region}, {"address.state_district": region}]}]},
                    Options(sortBy, page, limit, order), 
                    function(err, result) {
                        return result;
                });    
        }
        return schema.paginate(
        {$and:[
            {$or: [{"address.city": city}, {"address.state": city},{"address.county": city}]},
            {$or: [{"address.suburb": region}, {"address.town": region}, {"address.state_district": region}]}], 
                category: category},
                Options(sortBy, page, limit, order), 
            function(err, result) {
                return result;
        });     
    }
}

module.exports = {
    Place_query,
    Options
}