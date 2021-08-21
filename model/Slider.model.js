const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SliderSchema = new Schema(
	{
		type: String,
		title: String,
		mediaId: { type: mongoose.Types.ObjectId, ref: 'media' },
		quote: String,
		quoteAuthor: String,
		quoteAuthorMedia: { type: mongoose.Types.ObjectId, ref: 'media' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},

	{ timestamps: true }
);

module.exports = mongoose.model('slider', SliderSchema);
