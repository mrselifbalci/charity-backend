const CompanyInfoModel = require('../model/CompanyInfo.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await CompanyInfoModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await CompanyInfoModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getById = async (req, res) => {
	await CompanyInfoModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.create = async (req, res) => {
	const { address, phone, socialMedia, isActive, isDeleted } = req.body;
	const newCompanyInfo = await new CompanyInfoModel({
		address,
		phone,
		socialMedia,
		isActive,
		isDeleted,
	});

	newCompanyInfo.save().then((response) =>
		res.json({
			status: 200,
			message: 'New company info is created successfully',
			response,
		})
	);
};

exports.update = async (req, res) => {
	await CompanyInfoModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((response) =>
			res.json({
				status: 200,
				message: 'Company info is updated successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.delete = async (req, res) => {
	await CompanyInfoModel.findByIdAndDelete({ _id: req.params.id })
		.then((response) =>
			res.json({
				status: 200,
				message: 'Company info is deleted successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
