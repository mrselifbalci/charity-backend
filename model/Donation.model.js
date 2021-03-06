const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DonationSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'user' },
		firstname: String,
		lastname: String,
		type: String,
		phone: String,
		address: String,
		city: String,
		postcode: String,
		email: String,
		comments: String,
		instructions: String,
		type_of_goods: String,
		number_of_pieces: String,
		interested_in: String,
		type_of_card: String,
		card_number: String,
		security_code: Number,
		amount: String,
		expiration_date: String,
		reason_to_join: String,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('donation', DonationSchema);
