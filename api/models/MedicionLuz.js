module.exports = function(mongoose) {
	const medicionLuzSchema = new mongoose.Schema({
        devEUI: String,
        data : String,
        light : Number,
        time: Date
    });
    mongoose.model('MedicionLuz', medicionLuzSchema);
};