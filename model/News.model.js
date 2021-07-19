const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
	type: String,
	title: String,
	mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
	quote: String,
	quoteAuthor: String,
	quoteAuthorMedia: { type: Schema.Types.ObjectId, ref: 'media' },
	content: String,
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('news', NewsSchema);
