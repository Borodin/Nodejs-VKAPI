var https = require('https');
var open = require('open');
var querystring = require('querystring');
var readline = require('readline');

var rl = readline.createInterface({input: process.stdin,output: process.stdout});


var access_token, apiversion;
var lastRequest = 0;

exports.init = function(token, v){
	access_token = token;
	apiversion = v||'5.2';
}


exports.api = function(methodName, params, callback){
	if(!callback){callback=params;params=''}
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
			res.on('data',function(data){json+=data;});
			res.on('error', function(e) {console.error(e);});
			res.on('end', function(){
				var response = JSON.parse(json);
				if('error' in response){
					var error = response.error;
					if(error.error_code==14){
						open(error.captcha_img)
						rl.question("Enter the code from the image "+error.captcha_img, function(answer) {
							params.captcha_sid = error.captcha_sid;
							params.captcha_key = answer;
						 	exports.api(methodName, params, callback);
						});
					}else {
						console.error('ERROR '+error.error_code+' '+error.error_msg);
						console.log(error.request_params);
					}
				}else callback(response);
			});
		});
		req.write(post_data);
		req.end();
	},400-(new Date().getTime()-lastRequest));
	lastRequest = new Date().getTime()
}
