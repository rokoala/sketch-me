var express = require('express')
,   path = require('path')
,   fs = require('fs')
,   uuid = require('node-uuid')
,   request = require('request')
;

var app = express();
app.use(express.static(path.join(__dirname,'public')))

app.get('/getRandomImage',function (req,res,next) {

  var id = uuid.v1();
  var pathImage = 'tmp/'+id;

  var download = function(uri, filename, callback){
    var imagedata = ''
    request.head(uri, function(err, res, body){
      if(res.headers['content-type'].split('/')[1] === 'jpeg'){
        filename +=".jpg";
      }else if(res.headers['content-type'].split('/')[1] === 'gif'){
        filename +=".gif";
      }else {
        filename += ".png";
      }
      pathImage = filename;
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  download('https://unsplash.it/500/500/?random',pathImage, function(){
    fs.readFile(pathImage, function(err, original_data){
      var base64Image = new Buffer(original_data, 'binary').toString('base64');
      res.send(base64Image);
      fs.unlink(pathImage);
    });
  });

});

app.listen(8080, function () {
  console.log("Server running on port 8080");
})
