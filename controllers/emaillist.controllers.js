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

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page, limit } = req.query;
		const response = await emailListModel
			.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await response.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered email list',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.create = async (req, res) => {
	const { type, email, firstname, lastname, message, isActive, isDeleted } = req.body;

	const newEmailList = await new emailListModel({
		type,
		email,
		firstname,
		lastname,
		message,
		isActive,
		isDeleted,
	});

	newEmailList
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New email list is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
