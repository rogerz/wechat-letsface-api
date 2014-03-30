var wechatBot = require('wechat-bot');
var request = require('request');

var debug = require('debug')('wechat:letsface-api');
var _ = require('lodash');

/* include all apis */
exports = module.exports = function wechatLetsfaceApi(options) {
  _.assign(exports.options, options);
  exports.options.wxApi = options && (options.wxApi || wechat.API(options.appid, options.appsecret));
  var bot = wechatBot();
  bot.use(exports.clubs(exports.options));
  bot.use(exports.checkIn(exports.options));
  return bot;
};

/* global options for all instance */
exports.options = {
  lfApi: 'http://localhost:3000'
};

/* list clubs */
exports.clubs = function createClubs(options) {
  function clubs(req, res, next) {
    var msg = req.weixin;
    if (msg.MsgType === 'text' && msg.Content.toLowerCase() === 'clubs') {
      request({
        uri: options.lfApi + '/clubs/',
        json: true
      }, function gotClub(err, httpResponse, body) {
        if (err) {
          return next(err);
        } else {
          var total = body.clubs.length;
          debug('get %d clubs', total);
          return res.reply(total + ' clubs');
        }
      });
    } else {
      return next();
    }
  }
  clubs.help = "clubs";
  return clubs;
};

var wechat = require('wechat');
var util = require('util');

/* check in using wechat profile */
exports.checkIn = function createCheckIn(options) {
  var wxApi = options.wxApi;
  function checkIn(req, res, next) {
    var msg = req.weixin;

    if (msg.MsgType !== 'text') return next();

    var match = new RegExp(/^check in\s+(.*)\s+(.*)/i).exec(msg.Content);
    if (!match || match.length < 3) return next();

    var club = match[1];
    var event = match[2];
    var user = msg.FromUserName;

    wxApi.getUser(user, function gotUser(err, result) {
      if (err) next(err);
      debug('user id=%s, name=%s, avatar=%s',
            result.openid, result.nickname, result.headimgurl);
      var r = request({
        uri: util.format('%s/club/%s/event/%s/checkin',
                         options.lfApi, club, event),
        json: true,
        method: 'POST'
      }, function checkedIn(err, httpResponse, body) {
        if (err) return next(err);
        debug('check in result: %s, msg: %s', body.result, body.msg);
        return res.reply('check in ' + body.result);
      });
      var form = r.form();
      form.append('name', result.nickname);
      form.append('photo', request(result.headimgurl));
    });
  }
  checkIn.help = "check in <club_id> <event_id>";
  return checkIn;
};
