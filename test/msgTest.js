////////////////////////////////////////////////////////////
//	Message Tests
////////////////////////////////////////////////////////////

var dut;
beforeEach(function(){
    dut = require('../messages.js');
});

describe('Message', function(){
    var message;

    beforeEach(function(){
	message = new dut.Message();
	it('should be defined', function(){
	    expect(message).toBeDefined();
	});
    });

    it('should have empty sender', function(){
	expect(message.sender).toEqual("");
    });

    it('should have no send time', function(){
	expect(message.time_sent).toEqual(null);
    });

    it('should have type Message', function(){
	expect(message.type).toEqual('Message');
    });

    describe('when serialized', function(){
	var expected;

	beforeEach(function(){
	    message.sender = 'jeff';
	    expected = JSON.stringify(message);
	});

	it('should return its JSON', function(){
	    expect(message.serialize()).toEqual(expected);
	});
    });
});

describe('Request', function(){
    var message;

    beforeEach(function(){
	message = new dut.Request(null);
    });

    it('should be a subclass of Message', function(){
	expect(message instanceof dut.Message).toBeTruthy();
	expect(Object.getPrototypeOf(message).constructor).toEqual(dut.Request);
	expect(message.serialize).toBeDefined();
    });

    it('should have type Request', function(){
	expect(message.type).toEqual('Request');
    });
});

describe('SpotRequest', function(){
    var message;

    beforeEach(function(){
	message = new dut.SpotRequest(null);
    });

    it('should contain a location', function(){
	var loc = require('../location.js');

	expect(message.dest).toBeDefined();
	expect(message.dest instanceof loc.Location).toBeTruthy();
    });

    it('should be of type SpotRequest', function(){
	expect(message.type).toEqual('SpotRequest');
    });
});
