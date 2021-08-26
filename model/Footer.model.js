const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FooterSchema = new Schema(
	{
		logo: String,
		address: String,
		email: { type: String },
		phone: { type: String },
		socialMediaLinks: { type: Array },
		copyright: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('footer', FooterSchema);
