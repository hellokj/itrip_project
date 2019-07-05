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
const Place_query = (place) => {
    return [{"address.city": place}, {"address.state": place}, 
    {"address.county": place}, {"address.suburb": place}, {"address.town": place}, {"address.state_district": place}];
}

module.exports = {
    Place_query,
    Options
}