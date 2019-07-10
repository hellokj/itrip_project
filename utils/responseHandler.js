const response = (errorHandler, data, res) => {
    if(errorHandler != null) {
        res.json({status: errorHandler.code, msg: errorHandler.message});
        return;
    }
    res.json({status: -1, data: data, msg: 'success!'});
}

module.exports = response;