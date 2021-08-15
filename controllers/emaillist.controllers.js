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

exports.getEmailListById = async (req, res) => {
	await emailListModel.findOne({ id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getEmailListByEmail = async (req, res) => {
	await emailListModel.find({ email: req.body.email }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
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

exports.updateList = async (req, res) => {
	await emailListModel
		.findByIdAndUpdate(
			{ _id: req.params.id },
			{ $set: req.body },
			{ useFindAndModify: false, new: true }
		)
		.then((response) =>
			res.json({
				status: 200,
				message: 'Email list is updated successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeList = async (req, res) => {
	await emailListModel
		.findByIdAndDelete({ _id: req.params.id })
		.then((response) =>
			res.json({
				status: 200,
				message: 'Email list is deleted successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
