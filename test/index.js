var expect = require('chai').expect,
    wechatLetsfaceApi = require('..');

describe('wechat-letsface-api', function() {
  it('should export middleware creater', function() {
    expect(wechatLetsfaceApi()).to.be.a('function');
  });
});
