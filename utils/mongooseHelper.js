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

const Options = (sortBy, page, limit, order, requestType) => {
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
    else {
        return {
            page: page,
            limit: limit,
            customLabels: myCustomLabels
        };  
    }
}
const QueryHelper = (name, city, region) => {
    if(city === undefined) {
        return {$or:[{name:{$regex:name,$options:"$i"}}, {wiki_name:{$regex:name,$options:"$i"}}]};
    }
    else if(region === undefined) {
        return {$and: [
            {$or:[{name:{$regex:name,$options:"$i"}}, {wiki_name:{$regex:name,$options:"$i"}}]},
            {$or: [{"address.city": city}, {"address.state": city}, {"address.county": city}]}]};
    }
    else {
        return {$and:[
            {$or: [{"address.city": city}, {"address.state": city},{"address.county": city}]},
            {$or: [{"address.suburb": {$in: region}}, {"address.town": {$in: region}}, {"address.state_district": {$in: region}}]},
            {$or:[{name:{$regex:name,$options:"$i"}}, {wiki_name:{$regex:name,$options:"$i"}}]}]};
    }
};

// query for place search => shortening
const Place_query = (schema, city, region, categories, name, sortBy, page, limit, order) => {
    // console.log(city, region, categories, name, sortBy, page, limit, order);
    if(name != undefined) {
        return schema.paginate(QueryHelper(name, city, region), Options(sortBy, page, limit, order),
            function(err, result) {
            return result;
        });
    }
    if(region === undefined) {
        if(categories == undefined) {
            return schema.paginate(
                {$or: [{"address.city": city}, {"address.state": city}, {"address.county": city}]}, 
                Options(sortBy, page, limit, order), 
                function(err, result) {
                    return result;
            });   
        }
        return schema.paginate({$or: [{"address.city": city}, {"address.state": city}, {"address.county": city}], category: {$in: categories}}, 
            Options(sortBy, page, limit, order), 
            function(err, result) {
                return result;
        });   
    }
    else {
        if(categories === undefined) {
            return schema.paginate(
                {$and:[
                    {$or: [{"address.city": city}, {"address.state": city},{"address.county": city}]},
                    {$or: [{"address.suburb": {$in: region}}, {"address.town": {$in: region}}, {"address.state_district": {$in: region}}]}]},
                    Options(sortBy, page, limit, order), 
                    function(err, result) {
                        return result;
                });    
        }
        return schema.paginate(
        {$and:[
            {$or: [{"address.city": city}, {"address.state": city},{"address.county": city}]},
            {$or: [{"address.suburb": {$in: region}}, {"address.town": {$in: region}}, {"address.state_district": {$in: region}}]}], 
                category: {$in: categories}},
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