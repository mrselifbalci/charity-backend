const DonationModel = require('../model/Donation.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await DonationModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const data = await DonationModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.populate('userId', 'firstname lastname email')
			.sort({ createdAt: -1 });
		res.json({ total, pages, status: 200, data });
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
	}).populate('userId', 'firstname lastname email');
};

exports.getDonationsByUserId = async (req, res) => {
	const { page, limit } = req.query;
	const total = await DonationModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await DonationModel.find({ userId: req.params.userid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.populate('userId', 'firstname lastname email')
		.sort({ createdAt: -1 });
};

exports.getDonationsByType = async (req, res) => {
	const { page, limit } = req.query;
	const total = await DonationModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await DonationModel.find({ type: req.params.type }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.populate('userId', 'firstname lastname email')
		.sort({ createdAt: -1 });
};

exports.getDonationsByPostcode = async (req, res) => {
	const { page, limit } = req.query;
	const total = await DonationModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await DonationModel.find({ postcode: req.params.postcode }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.populate('userId', 'firstname lastname email')
		.sort({ createdAt: -1 });
};

exports.getDonationsByCity = async (req, res) => {
	const { page, limit } = req.query;
	const total = await DonationModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await DonationModel.find({ city: req.params.city }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.populate('userId', 'firstname lastname email')
		.sort({ createdAt: -1 });
};

exports.create = async (req, res) => {
	const {
		userId,
		type,
		phone,
		address,
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

exports.update = async (req, res) => {
	await DonationModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
		{ useFindAndModify: false, new: true }
	)
		.then((response) =>
			res.json({
				status: 200,
				message: 'Donation is updated successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.delete = async (req, res) => {
	await DonationModel.findByIdAndDelete({ _id: req.params.id })
		.then((response) =>
			res.json({
				status: 200,
				message: 'Donation is deleted successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
