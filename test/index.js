var expect = require('chai').expect,
    wechatLetsfaceApi = require('..');

var bot = wechatLetsfaceApi();

describe('wechat-letsface-api', function() {
  it('should create a bot', function() {
    expect(bot).to.be.a('function');
  });
});
