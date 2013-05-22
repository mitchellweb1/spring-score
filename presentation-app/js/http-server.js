function HTTPServer(host, port, createConnectionCallback) {
	this.createConnectionCallback = createConnectionCallback;
	
	var o = this;
	
	this._processRequest = function(buffer){
		var str = arrayBufferToStr(buffer);
		var header_end = str.indexOf("\r\n\r\n");
		if(header_end==-1)//have not yet received end of header
			return 0;
		var header = str.substring(0, header_end+2);//include last \r\n so that header regex succeeds
		var header_length = header_end+4;
		
		var first_line_regex = /(.+?) (.+?) HTTP\/(\d+?\.\d+?)\r\n/;
		var first_line = first_line_regex.exec(header);
		var request_type = first_line[1];
		var location = first_line[2];
		var http_version = first_line[3];
		
		var header_map = {};
		var header_param_regex = /(.+?): (.+?)\r\n/gm;
		while (match = header_param_regex.exec(header)) {
			header_map[match[1]] = match[2];
		}
		var message_body = '';
		var content_length = 0;
		if(header_map.hasOwnProperty('Content-Length')){
			content_length = parseInt(header_map['Content-Length']);
			if(buffer.byteLength<header_length+content_length)//message body has not arrived yet
				return 0;
			message_body = str.substring(header_length);//get mesage body
		}
		
		responseCallback(http_version, http_response_code, http_response_message, header_map, message_body);
		return header_length+content_length;
			var message_body = str.substring(header_length);//get mesage body
			responseCallback(http_version, http_response_code, http_response_message, header_map, message_body);
			return buffer.byteLength;
		}
		return 0;
	}
	
	this._readCallback = function(buffer){
		return o._processResponse(buffer, false);
	};
	this.tcp_server = new TCPServer(host, port, function(){
		return new TCPServerConnection(socketId, readCallback, closeCallback);
	});
	this.doGet = function(host, location){
		this.tcp_client.write(strToArrayBuffer("GET "+location+" HTTP/1.1\r\nHost: "+host+"\r\n\r\n"));
	};
}