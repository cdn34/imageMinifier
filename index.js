var imagemin = require('imagemin');
//var imageminJpegoptim = require('imagemin-jpegoptim');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

var forEachAsync = require('forEachAsync').forEachAsync;

var fs = require('fs'),
    path = require('path');

var directories = [];

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).map(function(file) {
      //console.log(file);
      //console.log(fs.statSync(path.join(srcpath, file)).isDirectory());
      if(fs.statSync(path.join(srcpath, file)).isDirectory())
        return getDirectories(srcpath+'/'+file);
    console.log(srcpath+'/'+file);
    directories.push(srcpath+'/'+file);
  });
}

getDirectories('images');

forEachAsync(directories, function (next, imagePath,indexFor) {
var folders = imagePath.split('/');
    folders = folders.slice(0,folders.length-1);
    var path = folders.join("/")+'/';
    console.log(path);
    console.log('---------------');
    imagemin([imagePath], 'build/'+path, {
        plugins: [
            imageminMozjpeg(),
            //imageminJpegoptim({size: '30%'}),
            imageminPngquant({quality: '40-45'})
        ]
    }).then(files => {
        //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
        console.log(files);
        next();
    }).catch((err)=>{
        console.log(err);
    })
}).then(()=>{
    console.log('All images minified');
});
