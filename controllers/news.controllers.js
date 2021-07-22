const NewsModel = require('../model/News.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await NewsModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const data = await NewsModel.find()
			.limit(limit * 1)
			.skip((pages - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt')
			.populate('quoteAuthorMedia', 'url title alt');
		res.json({ total, pages, status: 200, data });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};
