const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FooterSchema = new Schema(
	{
		logo: String,
		address: String,
		email: String,
		phone: String,
		socialMediaLinks: Array,
		copyright: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('footer', FooterSchema);
