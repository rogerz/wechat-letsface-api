module.exports = function wechatLetsfaceApi() {
  return function wechatLetsfaceApi(req, res, next) {
    var message = req.weixin;
    if (message) {
      return res.reply({
        type: 'text',
        content: 'hello'
      });
    } else {
      return next();
    }
  }
};
