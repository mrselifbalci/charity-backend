const NewsModel = require('../model/News.model');

exports.getAll = async (req, res) => {
	try {
		const response = await NewsModel.find();
		res.json(response);
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};
