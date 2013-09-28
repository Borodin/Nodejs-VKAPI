Nodejs-VKAPI
============

Модуль для Node.js позволяющий обращаться к vk.com API
* Данный модуль позволяет вводить капчу.

### Использование ###

```js
var VK = require('./vk_api');
VK.init('[access_token]');

VK.api('users.get', {
	user_ids: 1
},function(data) {
	console.log(data.response);
})
```

### Методы ###
```VK.init(access_token, [api_version]);``` Метод необходимый для инициализации модуля
```VK.api(mathod, [params], callback);``` Метод обращеня к vk API

