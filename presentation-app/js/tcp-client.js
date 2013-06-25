function TCPClient(host, port, createCallback, readCallback, closeCallback) {
    this.host = host;
	this.port = port;
	this.bufferSize = 1000;
	this.buffer = new Uint8Array(this.bufferSize);
	this.bufferPos = 0;
	this.createCallback = createCallback;
	this.readCallback = readCallback;
	this.closeCallback = closeCallback;
	this.errorCount = 0;
	
	var o = this;
	
	this._readCallback = function(readInfo){
		if(readInfo.resultCode>0){
			var result = new Uint8Array(readInfo.data);
			o.buffer.set(result, o.bufferPos);//copy data into buffer
			o.bufferPos += readInfo.resultCode;//change new end of valid buffer data
			var numRead = readCallback(new Uint8Array(o.buffer.buffer, 0, o.bufferPos));
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
			o.errorCount = 0;
		}
		else if(readInfo.resultCode<0){
			if(o.errorCount>=10)//works out to 0.5 sec timeout
				o.close();
			else
				o.errorCount++;
		}
	};
	this._doRead = function(){
		chrome.socket.read(o.socketId, o.bufferSize-o.bufferPos, o._readCallback);
	};
	
	chrome.socket.create('tcp', {}, function(createInfo) {
		chrome.socket.connect(o.socketId = createInfo.socketId, host, port, function(){
			o.timer = setInterval(o._doRead, 50);
			createCallback();
		});
	});
	
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