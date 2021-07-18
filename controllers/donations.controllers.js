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
