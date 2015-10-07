var https = require('https');
var querystring = require('querystring');
var readline = require('readline');
//var open = require('open');

var error_log = true;
var access_token, apiversion;
var delay = 0;
var rl = readline.createInterface({input: process.stdin,output: process.stdout});


exports.init = function(token, v){
	access_token = token;
	apiversion = v||'5.2';
}


exports.api = function(methodName, params, callback){
	if(!callback){ callback=params; params='' }

	params.access_token = access_token;
	params.v = apiversion;

	var post_data = querystring.stringify(params);

	setTimeout(function(){
		var req = https.request({
			hostname: 'api.vk.com',
			port: 443,
			path: '/method/'+methodName,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		}, function(res) {
			var json = '';
			res.on('data',function(data){json += data});
			res.on('error', function(e) {console.error(e)});
			res.on('end', function(){
				var response = JSON.parse(json);
				if('error' in response){
					var error = response.error;
					if(error.error_code == 14){
						//open(error.captcha_img);
						cansole.log('captcha_img', error.captcha_img)
						rl.question("Enter the code from the image " + error.captcha_img, function(answer) {
							params.captcha_sid = error.captcha_sid;
							params.captcha_key = answer;
						 	exports.api(methodName, params, callback);
						});
					}else if(error.error_code==6){
						//console.log("Too much requests");
						setTimeout(function(){exports.api(methodName, params, callback)},400);
					}
					}else {
						if(error_log){
							console.error('ERROR ' + error.error_code + ' ' + error.error_msg);
							console.log(error.request_params);
						}
						callback(error);
					}
				}else callback(false, response);
			});
		});
		req.write(post_data);
		req.end();
		delay = 0;
	}, delay);
	delay+=400;
}
