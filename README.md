Nodejs-VKAPI
============

Модуль для Node.js позволяющий обращаться к vk.com API
* Данный модуль позволяет вводить капчу.
* Отправляет не более 3 запросов в секунду.

### Использование ###

```js
var VK = require('./vk-api');
VK.init([access_token]);

VK.api('users.get', {
	user_ids: 1
},function(err, data) {
	console.log(data.response);
})
```
В данном запросе ```[access_token]``` указывать не обязательно, запроc вернет объект:

```[ { id: 1, first_name: 'Павел', last_name: 'Дуров' } ]```

###Получение access_token###
Для того чтобы получить access_token, необходимо отправить Http запрос
```
https://oauth.vk.com/authorize
?client_id=4626668
&scope=2080255
&redirect_uri=https://oauth.vk.com/blank.html
&response_type=token
&v=API_5.7
```
и скопировать из адресной строки ```token```

[Список методов API vk.com](http://vk.com/dev/methods)

[Серверная авторизация](http://vk.com/dev/auth_sites)

### Методы ###
```VK.init(access_token, [api_version]);``` Метод необходимый для инициализации модуля

```VK.api(method, [params], callback);``` Метод обращеня к vk API

