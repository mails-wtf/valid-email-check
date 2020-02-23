var dns = require('dns'),
    net = require('net'),
    os = require('os');

module.exports = function (toEmail, callback, timeout, fromEmail) {
	timeout = timeout || 10000; // 10 seconds timeout by default
	fromEmail = fromEmail || toEmail;
	if (!/^\S+@\S+$/.test(toEmail)) {
		callback(false,'Bad mail format');
		return;
	}
	dns.resolveMx(toEmail.split('@')[1], function(err, addresses){
		if (err || addresses.length === 0) {
			callback(false,err);
			return;
		}
		var conn = net.createConnection(25, addresses[0].exchange);
		var commands = [ "helo " + addresses[0].exchange, "mail from: <"+fromEmail+">", "rcpt to: <"+toEmail+">" ];
		var i = 0;
		conn.setEncoding('ascii');
		conn.setTimeout(timeout);

		conn.on('error', function(err) {
			conn.emit('false',err);
		});
		conn.on('false', function (data) {
			callback(false,data);
			conn.end();
		});
		conn.on('connect', function() {
			conn.on('prompt', function (data) {
				if(i < 3){
					conn.write(commands[i]);
					conn.write('\r\n');
					i++;
				} else {
					callback(true,data);
					conn.end();
					conn.destroy(); //destroy socket manually
				}
			});
			conn.on('undetermined', function (data) {
				//in case of an unrecognisable response tell the callback we're not sure
				callback(false, data);
				conn.end();
				conn.destroy(); //destroy socket manually
			});
			conn.on('timeout', function () {
				// conn.emit('undetermined');
                callback(false, 'Timeout');
                conn.end();
                conn.destroy();
			});
            conn.on('data', function(data) {
                if(data.indexOf("220") == 0 || data.indexOf("250") == 0 || data.indexOf("\n220") != -1 || data.indexOf("\n250") != -1) {
                    conn.emit('prompt',data);
                } else if(data.indexOf("\n550") != -1 || data.indexOf("550") == 0) {
                    conn.emit('false',data);
                } else {
                    conn.emit('undetermined',data);
                }
            });
		});
	});
};

module.exports.check = module.exports;
