var VK = require('../vk-api')
  , http = require('http')
  , fs = require('fs')


var owner_id = '-49696268'
var dir = 'photo';
var count = 0;
var downloads = 0;

VK.init('[access_token]');
fs.mkdir(dir, getAlbums);


function fileName(name){
	return name.replace(/[^A-Za-zА-Яа-я\d _]/g, "")
}

function getAlbums(){
	VK.api('photos.getAlbums', {
		owner_id: owner_id
	},function(err, data) {
		console.log(err)
		var albums = data.response.items
		for(var i=0; i<albums.length; i++)mkdir(albums[i])
	})
}


function mkdir(album){
	fs.mkdir(dir+'/'+fileName(album.title), function(){
		count+=album.size;
		getPhotos(album);
	});
}


function getPhotos(album){
	VK.api('photos.get', {
		owner_id: album.owner_id,
		album_id: album.id
	},function(err, data) {
		var photos = data.response.items;
		for(var i=0; i<photos.length; i++)sevePhoto(photos[i], album)
	})
}

function sevePhoto(photo, album){
	var file = fs.createWriteStream(dir+'/'+fileName(album.title)+'/'+photo.date+'.jpg');
	var request = http.get(photo.photo_2560||photo.photo_1280||photo.photo_807||photo.photo_604||photo.photo_130||photo.photo_75, function(response) {
		response.pipe(file);
		file.on('finish', function() {file.close();});
		process.stdout.write("\u001b[2J\u001b[0;0H");
		console.log(Math.ceil(downloads/count*100)+'%')
		console.log(++downloads+' / '+count+' photos');
		for(var n=0; n<Math.ceil(downloads/count*80); n++)process.stdout.write(".");
	});
}
