var Rankings = require('mongoose').model('Rankings');

module.exports = function (req, res) {

    var rankings = {};
    Rankings.findOne({queue: req.params.mode}, function (err, result) {
        if (err) {
            return err;
        } else {
            rankings = result;
            if (!rankings)
                rankings = readAndSave(req.params.mode, res);
            else {
                res.json(rankings);
            }
        }
    });

};

function readAndSave(mode, res) {
    require("superagent")
        .get('https://na.api.pvp.net/api/lol/na/v2.5/league/master?type=' + mode + '&api_key=48bb8ab1-2559-4225-949b-f9b45ea77e22')
        .end(function (err, data) {
            data.body.createDate = new Date().getTime();
            var rankings = new Rankings(data.body);
            rankings.save(function (saveerr) {
                if (saveerr) {
                    return saveerr;
                } else {
                    res.json(rankings);
                }
            });
        });
}