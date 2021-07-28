const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailListSchema = new Schema({
	type: String,
	email: String,
	firstname: String,
	lastname: String,
	message: String,
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('emailList', EmailListSchema);
