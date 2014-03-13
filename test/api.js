var chai = require('chai');
var expect = chai.expect;

/* fake api server */
var server = require('./server');

var api = server.createServer();

var clubs = [
  {
    id: '205',
    name: 'SURTEX',
    logo: 'http://121.199.38.39/hphoto/logoclub/NewClub.jpgw76_h76.jpg'
  }
];

var responses = {
  'clubs/': server.createGetResponse(JSON.stringify(clubs), 'application/json')
};

var bot = require('..')({url: api.url});

before(function (done) {
  api.listen(api.port, function () {
    for (var route in responses) {
      api.on('/' + route, responses[route]);
    }
    done();
  });
});

/* test cases */

describe('letsface api', function (done) {
  var req = {
    weixin: {
      MsgType: 'text',
      Content: 'clubs'
    }
  };
  var res = {
    reply: function (result) {
      expect(result).to.equal('1 clubs');
      done();
    }
  };
  it('should reply club list', function () {
    bot(req, res);
  });
});
