const DonationModel = require('../model/Donation.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await DonationModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await DonationModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('userId', 'firstname lastname email');
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: err });
	}
};

exports.create = async (req, res) => {
	const {
		userId,
		type,
		phone,
		address,
		email,
		city,
		postcode,
		comments,
		instructions,
		type_of_goods,
		type_of_card,
		card_number,
		security_code,
		amount,
		expiration_date,
		reason_to_join,
		isActive,
		isDeleted,
	} = req.body;

	const newDonation = await new DonationModel({
		userId,
		type,
		phone,
		address,
		email,
		city,
		postcode,
		comments,
		instructions,
		type_of_goods,
		type_of_card,
		card_number,
		security_code,
		amount,
		expiration_date,
		reason_to_join,
		isActive,
		isDeleted,
	});

	newDonation
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New donation is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
