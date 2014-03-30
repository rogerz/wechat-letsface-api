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
exports.options = {url: 'http://localhost:3000'};

/* list clubs */
exports.clubs = function clubs(options) {
  return function clubs(req, res, next) {
    var msg = req.weixin;
    if (msg.MsgType === 'text' && msg.Content.toLowerCase() === 'clubs') {
      request({
        uri: options.url + '/clubs/',
        json: true
      }, function gotClub(err, httpResponse, body) {
        if (err) {
          return next(err);
        } else {
          debug('get %d clubs', body.length);
          return res.reply(body.length + ' clubs');
        }
      });
    } else {
      return next();
    }
  };
};

var wechat = require('wechat');
var util = require('util');

/* check in using wechat profile */
exports.checkIn = function checkIn(options) {
  var wxApi = options.wxApi;
  return function checkIn(req, res, next) {
    var msg = req.weixin;

    if (msg.MsgType !== 'text') return next();

    var match = new RegExp(/^checkin\s+(.*)\s+(.*)/i).exec(msg.Content);
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
                         options.url, club, event),
        json: true
      }, function checkedIn(err, httpResponse, body) {
        if (err) return next(err);
        debug('check in result: %s, msg: %s', body.result, body.msg);
        res.reply('checkin ' + body.result);
      });
      var form = r.form();
      form.append('name', result.nickname);
      form.append('email', 'fake@email.com');
      form.append('mobile', '10086');
      form.append('photo', request(result.headimgurl));
    });
  };
};
