const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema(
	{
		url: String,
		title: String,
		alt: String,
		altImage: String,
		altBanner: String,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		mediaKey: { type: String },
	},

	{ timestamps: true }
);

module.exports = mongoose.model('media', MediaSchema);
