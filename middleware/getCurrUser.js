function getCurrUser(req, res, next){
    if (req.user) {
        console.log(req.user);
        next();
    } 
    else {
    
    }
}

module.exports = getCurrUser;