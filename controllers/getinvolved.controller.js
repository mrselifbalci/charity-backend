const mongoose = require('mongoose');
const GetInvolvedModel = require('../model/Getinvolved.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try { 
		const { page = 1, limit } = req.query;
		const response = await GetInvolvedModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt');
		const total = await GetInvolvedModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: err });
	}
};

exports.create = async (req, res) => {
	if (req.files) {
		const data = async (data) => {
			const newImage = await new MediaModel({
				url: data.Location || null,
				title: req.body.title,
				mediaKey: data.Key,
				alt: req.body.name,
			});

			newImage.save();

			const { title, content,moreInfoLinkText,moreInfoContent, isActive, isDeleted,buttonText } = req.body;

			const newInvolved = await new GetInvolvedModel({
				title,
				content,
				mediaId: newImage._id,
                moreInfoLinkText,
                moreInfoContent,
				buttonText,
				isActive,
				isDeleted,
			});
			newInvolved.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'New involved is created successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		};
		await S3.uploadNewMedia(req, res, data);
	} else if (req.body.mediaId) {
		const { title, content,  moreInfoLinkText,moreInfoContent,isActive, isDeleted, mediaId,buttonText } = req.body;

		const newInvolved = await new GetInvolvedModel({
			title,
			content,
			mediaId,
            moreInfoLinkText,
            moreInfoContent,
			buttonText,
			isActive,
			isDeleted,
		});
		newInvolved
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'New involved is created successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: 404, message: error }));
	} else {
		const data = async (data) => {
			const newImage = await new MediaModel({
				url: data.Location || null,
				title: req.body.title,
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newImage.save();

			const { title, content, moreInfoLinkText,moreInfoContent, isActive, isDeleted,buttonText } = req.body;

			const newPage = await new StaticPageModel({
				title,
				content,
				mediaId: newImage._id,
                moreInfoLinkText,
                moreInfoContent,
				buttonText,
				isActive,
				isDeleted,
			});
			newPage
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'New involved is created successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		};
		await S3.uploadNewMedia(req, res, data);
	}
};
exports.getSingleInvolve = async (req, res) => {
	await GetInvolvedModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ data });
		}
	})
	.populate('mediaId', 'url title alt');
};
exports.updateGetInvolved = async (req, res) => {
	if (req.files) {
		await GetInvolvedModel.findById({ _id: req.params.id })
			.then(async (involved) => {
				await MediaModel.findById({ _id: involved.mediaId }).then(
					async (media) => {
						const data = async (data) => {
							await MediaModel.findByIdAndUpdate(
								{ _id: involved.mediaId },
								{
									$set: {
										url: data.Location || null,
										title: 'get-involved',
										mediaKey: data.Key,
										alt: req.body.title,
									},
								},
								{ useFindAndModify: false, new: true }
							).catch((err) => res.json({ status: 404, message: err }));
						};
						await S3.updateMedia(req, res, media.mediaKey, data);
					}
				);
				const { title, content,moreInfoLinkText,moreInfoContent,buttonText } = req.body;

				await GetInvolvedModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							title,
							content,
                            moreInfoLinkText,
                            moreInfoContent,
							buttonText,
							mediaId: involved.mediaId,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((data) =>
						res.json({
							status: 200,
							message: 'Get involved is updated successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		await GetInvolvedModel.findById({ _id: req.params.id })
			.then(async (involved) => {
				const { title, content, mediaId,moreInfoLinkText,moreInfoContent,buttonText } = req.body;

				await GetInvolvedModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							title,
							content,
                            moreInfoLinkText,
                            moreInfoContent,
							buttonText,
							mediaId: !mediaId ? staticpage.mediaId : mediaId,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((data) =>
						res.json({
							status: 200,
							message: 'Getinvolved is updated successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	}
};


exports.deleteGetInvolved = async (req, res) => {
	await GetInvolvedModel.findById({ _id: req.params.id })
		.then(async (involved) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: involved.mediaId },
				{
					$set: { isActive: false },
				},
				{ useFindAndModify: false, new: true }
			);

			await GetInvolvedModel.findByIdAndDelete({ _id: req.params.id })
				.then((data) =>
					res.json({
						status: 200,
						message: 'Getinvolved is deleted successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};