var wechatBot = require('wechat-bot');
var request = require('request');

var debug = require('debug')('wechat:letsface-api');
var _ = require('lodash');

/* include all apis */
exports = module.exports = function wechatLetsfaceApi(options) {
  options = exports.options(options);
  var bot = wechatBot();
  bot.use(exports.clubs(options));
  return bot;
};

/* fill options with default value */
exports.options = function (options) {
  return _.defaults({}, options, {url: 'http://localhost:3000'});
};

/* list clubs */
exports.clubs = function clubs(options) {
  options = exports.options(options);
  return function clubs(req, res, next) {
    var msg = req.weixin;
    if (msg.MsgType === 'text' && msg.Content.toLowerCase() === 'clubs') {
      request({
        uri: options.url + '/clubs/',
        json: true
      }, function requested(err, apiRes, body) {
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
