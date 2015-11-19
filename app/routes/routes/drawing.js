module.exports = {
    "/drawing": {
        get: function(req, res, next) {
            res.send(200, { "ok": 2 });
            return next();
        }
    }
};