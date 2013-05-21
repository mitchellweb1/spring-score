function HTTPClient(host, port, createCallback, responseCallback) {
	this.createCallback = createCallback;
	this.responseCallback = responseCallback;
	
	var o = this;
	
	this._processResponse = function(buffer, forceEnd){
		var str = arrayBufferToStr(buffer);
		var header_end = str.indexOf("\r\n\r\n");
		if(header_end==-1)//have not yet received end of header
			return 0;
		var header = str.substring(0, header_end+2);//include last \r\n so that header regex succeeds
		var header_length = header_end+4;
		
		var first_line_regex = /HTTP\/(\d+?\.\d+?) (\d+?) (.+?)\r\n/;
		var first_line = first_line_regex.exec(header);
		var http_version = first_line[1];
		var http_response_code = first_line[2];
		var http_response_message = first_line[3];
		
		var header_map = {};
		var header_param_regex = /(.+?): (.+?)\r\n/gm;
		while (match = header_param_regex.exec(header)) {
			header_map[match[1]] = match[2];
		}
		if(header_map.hasOwnProperty('Content-Length')){
			var content_length = parseInt(header_map['Content-Length']);
			if(buffer.byteLength<header_length+content_length && !forceEnd)//message body has not arrived yet
				return 0;
			var message_body = str.substring(header_length);//get mesage body
			responseCallback(http_version, http_response_code, http_response_message, header_map, message_body);
			return header_length+content_length;
		}
		if(header_map.hasOwnProperty('Transfer-Encoding')){
			if(header_map['Transfer-Encoding'] == "chunked"){
				var message_body = "";
				var body_data_length = 0;
				var remaining_body = str.substring(header_length);
				while(true){
					if(remaining_body.length==0)
						break;
					var chunked_encoding_length_regex = /(.+?)\r\n/;
					var chunk_length_str = remaining_body.match(chunked_encoding_length_regex)[1];
					if(!chunk_length_str)
						return 0;
					var chunk_length_str_length = chunk_length_str.length+2;//add 2 for \r\n
					var chunk_length = parseInt(chunk_length_str, 16);
					if(remaining_body.length<chunk_length+chunk_length_str_length){
						if(!forceEnd)
							return 0;
						message_body += remaining_body.substring(chunk_length_str_length);
						body_data_length += remaining_body.length;
						break;
					}
					body_data_length += chunk_length_str_length+chunk_length+2;
					message_body += remaining_body.substring(chunk_length_str_length, chunk_length_str_length+chunk_length);
					remaining_body = remaining_body.substring(chunk_length_str_length+chunk_length+2);//add 2 for \r\n at the end of the chunk
				}
				responseCallback(http_version, http_response_code, http_response_message, header_map, message_body);
				return header_length+body_data_length;
			}
			else
				console.error("Unsupported Transfer-Encoding: "+header_map['Transfer-Encoding']);
		}
		if(forceEnd){
			var message_body = str.substring(header_length);//get mesage body
			responseCallback(http_version, http_response_code, http_response_message, header_map, message_body);
			return buffer.byteLength;
		}
		return 0;
	}
	
	this._readCallback = function(buffer){
		return o._processResponse(buffer, false);
	};
	this.tcp_client = new TCPClient(host, port, function(){
		createCallback();
	},
	this._readCallback,
	function(buffer){
		o._processResponse(buffer, true);
	});
	this.doGet = function(host, location){
		this.tcp_client.write(strToArrayBuffer("GET "+location+" HTTP/1.1\r\nHost: "+host+"\r\n\r\n"));
	};
}