var chai = require('chai');
var expect = chai.expect;

/* fake letsface api server */
var server = require('./server');
var lfApi = server.createServer();

var clubs = [
  {
    id: '205',
    name: 'SURTEX',
    logo: 'http://121.199.38.39/hphoto/logoclub/NewClub.jpgw76_h76.jpg'
  }
];

var responses = {
  'clubs/': server.createResponse(JSON.stringify(clubs), 'application/json'),
  'club/1/event/2/checkin': server.createResponse(
    JSON.stringify({result: 'ok', msg: '...'}),
    'application/json'
  )
};

var wxApi = {
  getUser: function getUser(user, fn) {
   return fn(null, {
     openid: 'fake_open_id',
     nickname: 'fake_name',
     // TODO: fake image
     headimgurl: 'http://localhost:' + lfApi.port + '/clubs/'
   });
  }
};

var bot = require('..')({
  url: lfApi.url,
  wxApi: wxApi
});

before(function (done) {
  lfApi.listen(lfApi.port, function () {
    for (var route in responses) {
      lfApi.on('/' + route, responses[route]);
    }
    done();
  });
});

/* test cases */

describe('letsface api', function () {
  it('should reply club list', function (done) {
    var req = {
      weixin: {
        MsgType: 'text',
        Content: 'clubs'
      }
    };
    var res = {
      reply: function reply(result) {
        expect(result).to.equal('1 clubs');
        done();
      }
    };
    bot(req, res);
  });
  it('should checkin with wechat profile', function (done) {
    var req = {
      weixin: {
        MsgType: 'text',
        Content: 'checkin 1 2'
      }
    };
    var res = {
      reply: function reply(result) {
        expect(result).to.equal('checkin ok');
        done();
      }
    };
    bot(req, res);
  });
});
