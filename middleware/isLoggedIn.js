function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


function isLoggedInHome(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        let status = false;
        return next(status);
    }
}

module.exports = isLoggedIn;
module.exports = isLoggedInHome;





module.exports = isLoggedIn;