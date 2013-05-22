function TCPServerConnection(socketId, readCallback, closeCallback) {
	this.socketId = socketId;
	this.bufferSize = 1000;
	this.buffer = new Uint8Array(this.bufferSize);
	this.bufferPos = 0;
	this.readCallback = readCallback;
	this.closeCallback = closeCallback;
	
	var o = this;
	
	this._readCallback = function(readInfo){
		if(readInfo.resultCode>0){
			var result = new Uint8Array(readInfo.data);
			o.buffer.set(result, o.bufferPos);//copy data into buffer
			o.bufferPos += readInfo.resultCode;//change new end of valid buffer data
			var numRead = o.readCallback(new Uint8Array(o.buffer.buffer, 0, o.bufferPos));
			if(numRead>0){
				o.buffer.set(o.buffer.subarray(numRead), 0);//move data after existing data to the beginning of the buffer
				o.bufferPos -= numRead;
			}
			else if(o.bufferPos == o.bufferSize){//buffer is full need to expand
				var oldBuffer = o.buffer;
				o.bufferSize = o.bufferSize * 2;//double buffer size
				o.buffer = new Uint8Array(o.bufferSize);//create the new buffer
				o.buffer.set(oldBuffer);//move the data from the old buffer
			}
		}
		else if(readInfo.resultCode<0){
			o.close();
		}
	};
	this._doRead = function(){
		chrome.socket.read(o.socketId, o.bufferSize-o.bufferPos, o._readCallback);
	};
	
	this.timer = setInterval(o._doRead, 50);
	
	this.write = function(buffer){
		chrome.socket.write(o.socketId, buffer, function(writeInfo){});
	};
	
    this.close = function() {
		window.clearInterval(o.timer);
		if(o.socketId!=0){
			chrome.socket.disconnect(o.socketId);
			chrome.socket.destroy(o.socketId);
		}
		o.socketId = 0;
		o.closeCallback(new Uint8Array(o.buffer.buffer, 0, o.bufferPos));
    };
}

function TCPServer(host, port, createConnectionCallback) {
    this.host = host;
	this.port = port;
	this.createConnectionCallback = createConnectionCallback;
	this.isopen = false;
	this.open_connections = [];
	
	var o = this;
	
	
	this._onAccept = function(acceptInfo){
		if(acceptInfo.resultCode==0){//success
			console.warn("got socket: ", acceptInfo.socketId);
			o.open_connections.push(createConnectionCallback(acceptInfo.socketId));
		}
		else{
			console.warn("Error on accept: ", acceptInfo.resultCode);
		}
		if(o.isopen)
			chrome.socket.accept(o.socketId, o._onAccept);
	};
	
	
	chrome.socket.create("tcp", {}, function(createInfo) {
		chrome.socket.listen(o.socketId = createInfo.socketId, host, port, 50, function(result) {
			o.isopen = true;
			chrome.socket.accept(o.socketId, o._onAccept);
		});
    });
	
	
    this.close = function() {
		if(o.socketId!=0){
			chrome.socket.disconnect(o.socketId);
			chrome.socket.destroy(o.socketId);
		}
		o.socketId = 0;
		o.isopen = false;
    };
}