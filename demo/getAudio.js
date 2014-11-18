var VK = require('../vk-api')
  , http = require('http')
  , fs = require('fs')


var owner_id = '22211040'
var dir = 'audio';
var count = 0;
var downloads = 0;

VK.init('[access_token]');
fs.mkdir(dir, getAudio);


function fileName(name){
	return name.replace(/[^A-Za-zА-Яа-я\d _]/g, "")
}

function mkdir(album){
	fs.mkdir(dir+'/'+fileName(album.title), function(){
		count+=album.size;
		getPhotos(album);
	});
}

function getAudio(){
	VK.api('audio.get', {
		owner_id: owner_id,
	},function(err, data) {
		count += data.response.count;
		var audio = data.response.items;
		for(var i=0; i<audio.length; i++)seveAudio(audio[i])
	})
}

function seveAudio(audio){
	var file = fs.createWriteStream(dir+'/'+fileName(audio.artist+' '+audio.title)+'.mp3');
	var request = http.get(audio.url, function(response) {
		response.pipe(file);
		file.on('finish', function() {file.close();});
		process.stdout.write("\u001b[2J\u001b[0;0H");
		console.log(Math.ceil(downloads/count*100)+'%')
		console.log(++downloads+' / '+count+' audio');
		for(var n=0; n<Math.ceil(downloads/count*80); n++)process.stdout.write(".");
	});
}
