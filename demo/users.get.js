var VK = require('./vk_api');
VK.init('[access_token]');

VK.api('users.get', {
	user_ids: 1
},function(data) {
	console.log(data.response);
})