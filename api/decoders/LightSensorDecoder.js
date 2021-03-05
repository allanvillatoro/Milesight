/////LIGHT///
function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

module.exports = function(bytes, port) {
    var decoded = {};

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // LIGHT
        else if (channel_id === 0x03 && channel_type === 0x94) {
            decoded.light = readInt16LE(bytes.slice(i, i + 4)) ;
            i += 4;
        } else {
            break;
        }
    }
    return decoded;
}

/*
var test = 'A5RGAAAA';
var bufferTest = Buffer.from(test, 'base64');
var decoded = DecoderLight(bufferTest,85);
console.log(decoded);*/
