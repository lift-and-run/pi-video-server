var io = require("socket.io"),
    http = require("http"),
    fs = require("fs");
	
	
var htmlBody = fs.readFileSync("public/index.html","utf-8");

var clients = [],
    isFreshINotify = true;

function encodFileBase64(path) {
    var imageContent = fs.readFileSync(path);
    return new Buffer(imageContent).toString('base64');
}
	
var server = http.createServer(function(request, response) {
    response.writeHead(200, {"Content-type":"text/html"});
    //imageB64Encoded = encodFileBase64("web_cam_data/1.jpg");
    //response.end(htmlBody.replace('##anchor##', imageB64Encoded));
    response.end(htmlBody);
});

server.listen(80);


var sockvar = io.listen(server);
sockvar.set('log level', 1);

sockvar.sockets.on('connection', function(socket){
    console.log("          event is 'connection'");
    /*console.log("---------->socketId is:");
    console.log(socket.id);*/
    clients.push({"socketId":socket.id, "isTransmiting":false});
    /*console.log("---------->clients is:");
    console.log(clients);*/
    imageB64Encoded = encodFileBase64("web_cam_data/1.jpg");
    socket.emit('message', {'message': imageB64Encoded});
    
    /*console.log("----------> 'message' socketId is:");
    console.log(socket.id);
    console.log("----------> 'message' clients is:");
    console.log(clients);*/
    
        
        socket.on('disconnect', function() {
            console.log("          event is 'disconnect'");
            /*console.log("---------->socketId is:");
            console.log(socket.id);
            console.log("---------->clients is:");
            console.log(clients);*/
            
            for (var i=0; i<clients.length; i++) {
                /*console.log("---------->clients[i] is:");
                console.log(clients[i]);*/
                if (clients[i].socketId == socket.id) {
                    
                    /*console.log("---------->before delete socketId is:");
                    console.log(socket.id);*/
                    
                    clients.splice(i,1);
                    
                    /*console.log("---------->after delete clients is");
                    console.log(clients);*/
                }
            }
   });
});



fs.watch('web_cam_data/1.jpg', function (event, filename) {
    if (isFreshINotify == true) {
        isFreshINotify = false;
        setTimeout(function(){
            isFreshINotify = true
        },500)
        console.log('          event is: ' + event);
		
        setTimeout(function(){
            imageB64Encoded = encodFileBase64("web_cam_data/1.jpg");

            for (var i=0; i<clients.length; i++) {
                /*console.log("----->>clients[i] is:");
				console.log(clients[i]);*/
                if (clients[i].isTransmiting == false) {
                    /*console.log("----->>for 'start' clients is:");
					console.log(clients);*/
                    
                    clients[i].isTransmiting = true;
                    
                    /*console.log("----->>for 'in process' clients is:");
                    console.log(clients);*/
                    
                    clientId = clients[i].socketId;
                    
                    /*console.log("----->>for 'in process' clientId is:");
                    console.log(clientId);*/
                    
                    sockvar.sockets.sockets[clientId].emit('message', {'message': imageB64Encoded});
					clients[i].isTransmiting = false;
                    
					/*console.log("----->>for 'end': clients is:");
					console.log(clients);*/
                }
            }
        },100)
    }
});

/*
Так не надо делать, не работает, так как для слушателя события нужен экземпляр соединения.
sockvar.on('client_data', function(data){
    console.log(data.letter);
});
*/