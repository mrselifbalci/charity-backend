const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
	{
		type: { type: String },
		title: { type: String },
		mediaId: {
			type: Schema.Types.ObjectId,
			ref: 'media',
			required: 'Media must be uploaded',
		},
		quote: String,
		quoteAuthor: String,
		quoteAuthorMedia: {
			type: Schema.Types.ObjectId,
			ref: 'media',
			required: 'Media for author quote must be uploaded',
		},
		content: { type: String, max: 100 },
		quoteAuthorMedia: {
			type: Schema.Types.ObjectId,
			ref: 'media',
			required: 'Media for author quote must be uploaded',
		},
		content: String,
		summary: String,
		altImage: String,
		altQuote: String,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('news', NewsSchema);
