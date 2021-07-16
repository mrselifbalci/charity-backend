const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAllMedia = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await MediaModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MediaModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ message: 'All Medias', total: total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const  query  = typeof req.body.query === "string" ? JSON.parse(req.body.query) : req.body.query
		const { page = 1, limit } = req.query;	
		const response = await MediaModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);	
		res.json({message: 'Filtered medias', pages, total:response.length ,status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};



exports.createMedia = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location,
			title: req.body.title,
			mediaKey: data.Key,
			isHomePage: req.body.isHomePage,
			isActive: req.body.isActive,
			isDeleted: req.body.isDeleted,
			alt: req.body.alt,
		});

		newMedia
			.save()
			.then((response) =>
				res.json({ status: 200, message: 'Media Created', response })
			)
			.catch((err) => res.json({ status: 404, message: err }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.getSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getSingleMediaByTitle = async (req, res) => {
	const { page, limit } = req.query;
	const title = req.params.title.toLowerCase();
	const total = await MediaModel.find({ title: title }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await MediaModel.find({ title }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.getMediaByIsActive = async (req, res) => {
	const { page, limit } = req.query;
	const total = await MediaModel.find({ title: title }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	const isActive = req.params.isactive.toLowerCase();
	await MediaModel.find({ isActive }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.updateSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaid })
		.then(async (response) => {
			const data = async (data) => {
				await MediaModel.findByIdAndUpdate(
					{ _id: req.params.mediaId },
					{
						$set: {
							url: data.Location,
							mediaKey: data.Key,
							title: req.body.title,
							isActive: req.body.isActive,
							isDeleted: req.body.isDeleted,
							alt: req.body.update,
						},
					}
				)
					.then((data) =>
						res.json({ status: 200, message: 'Media updated', data })
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.updateMedia(req, res, response.mediaKey, data);
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaId })
		.then(async (response) => {
			S3.deleteMedia(response.mediaKey);
			await MediaModel.findByIdAndDelete({ _id: req.params.mediaId })
				.then((data) => res.json({ status: 200, message: 'Media removed', data }))
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
