var VK = require('../vk-api');
VK.init();

VK.api('users.get', {
	user_ids: 1
},function(err, data) {
	console.log(data.response);
})