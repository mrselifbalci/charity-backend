const emailListModel = require('../model/emailList.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await emailListModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const data = await emailListModel
			.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({ total, pages, status: 200, data });
	} catch (error) {
		res.json({ status: 404, error });
	}
};
