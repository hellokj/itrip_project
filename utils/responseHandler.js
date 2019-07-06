const response = (errorHandler, data, res) => {
    if(errorHandler != null) {
        res.json({status: errorHandler.code, msg: errorHandler.message});
        return;
    }
    
}

module.exports = response;