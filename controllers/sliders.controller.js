const mongoose = require('mongoose');
const SlidersModel = require('../model/Slider.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');
const SliderModel = require('../model/Slider.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await SlidersModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const data = await SlidersModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.populate('mediaId', 'url title alt')
			.populate('quoteAuthorMedia', 'url title alt')
			.sort({ createdAt: -1 });
		res.json({ total, pages, status: 200, data });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getSliderByType = async (req, res) => {
	const { page, limit } = req.query;
	const total = await SlidersModel.find({ type: req.params.type }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await SlidersModel.find({ type: req.params.type }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.populate('mediaId', 'url title alt')
		.populate('quoteAuthorMedia', 'url title alt')
		.sort({ createdAt: -1 });
};

exports.create = async (req, res) => {
	const dataMedia = async (data1) => {
		const sliderMedia = await new MediaModel({
			title: 'sliders',
			url: data1.Location || null,
			mediaKey: data1.Key,
			alt: req.body.altImage || null,
		});
		sliderMedia.save();

		const dataQuoteAuthorMedia = async (data2) => {
			const slidersQuoteAuthorMedia = await new MediaModel({
				title: 'news-quote-author',
				url: data2.Location || null,
				mediaKey: data2.Key,
				alt: req.body.altQuote || null,
			});

			slidersQuoteAuthorMedia.save();
			const {
				type,
				title,
				mediaId,
				quote,
				quoteAuthor,
				quoteAuthorMedia,
				altImage,
				altQuote,
				isActive,
				isDeleted,
			} = req.body;
			const Slider = await new SlidersModel({
				type,
				title,
				mediaId: sliderMedia._id,
				quote,
				quoteAuthor,
				quoteAuthorMedia: slidersQuoteAuthorMedia._id,
				altImage,
				altQuote,
				isActive,
				isDeleted,
			});
			Slider.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Slider is created successfully',
						response,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		};
		await S3.uploadNewQuoteAuthorMedia(req, res, dataQuoteAuthorMedia);
	};
	await S3.uploadNewMedia(req, res, dataMedia);
};

exports.updateSlider = async (req, res) => {
	await SlidersModel.findById({ _id: req.params.id })
		.then(async (sliders) => {
			await MediaModel.findById({ _id: sliders.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: sliders.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'sliders',
								mediaKey: data.Key,
								alt: req.body.altImage || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});

			await MediaModel.findById({ _id: sliders.quoteAuthorMedia })
				.then(async (quoteauthormedia) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: sliders.quoteAuthorMedia },
							{
								$set: {
									url: data.Location || null,
									title: 'sliders-quote-author',
									mediaKey: data.Key,
									alt: req.body.altQuote || null,
								},
							},
							{ useFindAndModify: false, new: true }
						);
					};
					await S3.updateQuoteAuthorMedia(
						req,
						res,
						quoteauthormedia.mediaKey,
						data
					);
				})
				.catch((err) => res.json({ status: 404, message: err }));
			const { type, title, quoteAuthor, quote, altImage, altQuote } = req.body;

			await SlidersModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						type,
						title,
						quote,
						quoteAuthor,
						mediaId: sliders.mediaId,
						quoteAuthorMedia: sliders.quoteAuthorMedia,
						altImage,
						altQuote,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: true,
						message: 'Slider is updated successfully',
						data,
					})
				)

				.catch((err) => res.json({ message: err, status: 4040 }));
		})
		.catch((err) => res.json({ message: err, status: 4041 }));
};

exports.deleteSlider = async (req, res) => {
	await SlidersModel.findByIdAndDelete({ _id: req.params.id })
		.then((response) =>
			res.json({
				status: 200,
				messages: 'Slider is deleted successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
