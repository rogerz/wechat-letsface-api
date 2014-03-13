var wechatBot = require('wechat-bot');
var request = require('request');

var debug = require('debug')('wechat:letsface-api');

exports = module.exports = function wechatLetsfaceApi(options) {
  exports.host = options.host || 'http://localhost:3000';
  var bot = wechatBot();
  bot.use(exports.clubs());
  return bot;
};

exports.clubs = function clubs() {
  return function clubs(req, res, next) {
    var msg = req.weixin;
    if (msg.MsgType === 'text' && msg.Content.test(/^clubs/i)) {
      request({
        uri: exports.host + '/clubs/',
        json: true
      }, function requested(err, res, body) {
        if (err) {
          return next(err);
        } else {
          debug('Get %d clubs', body.length);
          res.reply(body.length + ' clubs');
          return next();
        }
      });
    } else {
      return next();
    }
  };
};
