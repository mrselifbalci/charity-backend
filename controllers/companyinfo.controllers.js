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
