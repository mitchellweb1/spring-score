function strToArrayBuffer(str){
	var buffer = new Uint8Array(str.length);
	for(var i = 0; i < str.length; i++) {
		buffer[i] = str.charCodeAt(i);
	}
	return buffer.buffer;
}
function arrayBufferToStr(raw_buffer){
	var buffer = new Uint8Array(raw_buffer);
	var str = "";
	for(var i = 0; i < buffer.byteLength; i++) {
		str += String.fromCharCode(buffer[i]);
	}
	return str;
}