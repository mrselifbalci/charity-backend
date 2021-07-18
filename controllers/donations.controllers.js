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

exports.getDonationById = async (req, res) => {
	await DonationModel.findOne({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getDonationsByUserId = async (req, res) => {
	await DonationModel.find({ userId: req.params.userid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getDonationsByType = async (req, res) => {
	await DonationModel.find({ type: req.params.type }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getDonationsByPostcode = async (req, res) => {
	await DonationModel.find({ postcode: req.params.postcode }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getDonationsByCity = async (req, res) => {
	await DonationModel.find({ city: req.params.city }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
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
