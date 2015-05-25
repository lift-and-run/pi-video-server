var io = require("socket.io"),
    http = require("http"),
    fs = require("fs");

var htmlBody = fs.readFileSync("public/index.html","utf-8");

var clients = [];

function encodFileBase64(path) {
    try {
        var imageContent = fs.readFileSync(path);
        return new Buffer(imageContent).toString('base64');
    } catch (err) {
        return ''
    }
}
	
var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-type":"text/html"});
    //imageB64Encoded = encodFileBase64("web_cam_data/1.jpg");
    //response.end(htmlBody.replace('##anchor##', imageB64Encoded));
    response.end(htmlBody);
});

server.listen(8080);


var sockvar = io.listen(server);
sockvar.set('log level', 1);

sockvar.sockets.on('connection', function(socket){
    console.log("          event is 'connection'");
    clients.push({"socketId":socket.id, "isTransmiting":false});
    imageB64Encoded = encodFileBase64("web_cam_data/1.jpg");
    socket.emit('message', {'message': imageB64Encoded});
    
    socket.on('disconnect', function() {
        console.log("          event is 'disconnect'");
        for (var i=0; i<clients.length; i++) {
            if (clients[i].socketId == socket.id) {
                clients.splice(i,1);
            }
        }
    });

    socket.on('imageHasBeenLoaded', function () {
        console.log('          event is imageHasBeenLoaded');
        for (var i=0; i < clients.length; i++) {
            if (clients[i].socketId == socket.id) {
                clients[i].isTransmiting = false;
            }
        }
    });

});



//fs.watch('web_cam_data/1.jpg', function (event, filename) {
fs.watch('web_cam_data/', function (event, filename) {
    console.log('          event is: ' + event);
    //console.log(event);
    		
    imageB64Encoded = encodFileBase64("web_cam_data/1.jpg");

    if (imageB64Encoded.length !=0) {
        for (var i=0; i<clients.length; i++) {
            if (clients[i].isTransmiting == false) {
                clients[i].isTransmiting = true;
                clientId = clients[i].socketId;
                sockvar.sockets.sockets[clientId].emit('message', {'message': imageB64Encoded});
            }
        }
    }
});

