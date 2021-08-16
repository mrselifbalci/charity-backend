const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanyInfoSchema = new Schema({
	address: String,
	phone: String,
	socialMedia: Array,
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('companyinfo', CompanyInfoSchema);
