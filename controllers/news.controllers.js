const NewsModel = require('../model/News.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const total = await NewsModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const data = await NewsModel.find()
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

exports.getSingleNews = async (req, res) => {
	await NewsModel.findOne({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getNewsByType = async (req, res) => {
	const { page, limit } = req.query;
	const total = await NewsModel.find({ type: req.params.type }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await NewsModel.find({ type: req.params.type }, (err, data) => {
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
		const newsMedia = await new MediaModel({
			title: 'news',
			url: dataMedia.Location || null,
			mediaKey: data1.Key,
			alt: req.body.altImage || null,
		});
		newsMedia.save();

		const dataQuoteAuthorMedia = async (data2) => {
			const newsQuoteAuthorMedia = await new MediaModel({
				title: 'news-quote-author',
				url: dataQuoteAuthorMedia.Location || null,
				mediaKey: data2.Key,
				alt: req.body.altQuote || null,
			});

			newsQuoteAuthorMedia.save();

			const {
				type,
				title,
				quote,
				quoteAuthor,
				content,
				altImage,
				altQuote,
				isActive,
				isDeleted,
			} = req.body;

			const News = await new NewsModel({
				type,
				title,
				quote,
				quoteAuthor,
				mediaId: newsMedia._id,
				quoteAuthorMedia: newsQuoteAuthorMedia._id,
				content,
				altImage,
				altQuote,
				isActive,
				isDeleted,
			});

			News.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'News is created successfully',
						response,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		};
		await S3.uploadNewQuoteAuthorMedia(req, res, dataQuoteAuthorMedia);
	};
	await S3.uploadNewMedia(req, res, dataMedia);
};

exports.updateNews = async (req, res) => {
	await NewsModel.findById({ _id: req.params.id })
		.then(async (news) => {
			await MediaModel.findById({ _id: news.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: news.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'news',
								mediaKey: data.Key,
								alt: req.body.altImage || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});
			await MediaModel.findById({ _id: news.quoteAuthorMedia })
				.then(async (quoteauthormedia) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: news.quoteauthormedia },
							{
								$set: {
									url: data.Location || null,
									title: 'news-quote-author',
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

			const { type, title, quoteAuthor, content, altImage, altQuote } = req.body;

			await NewsModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						type,
						title,
						content,
						quoteAuthor,
						mediaId: news.mediaId,
						quoteAuthorMedia: news.quoteAuthorMedia,
						altImage,
						altQuote,
						isActive: req.body.isActive
							? req.body.isActive
							: trailer.isActive,
						isDeleted: req.body.isDeleted
							? req.body.isDeleted
							: trailer.isDeleted,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: true,
						message: 'News is updated successfully',
						data,
					})
				)

				.catch((err) => res.json({ message: err, status: 404 }));
		})
		.catch((err) => res.json({ message: err, status: 404 }));
};

exports.removeNews = async (req, res) => {
	await NewsModel.findByIdAndDelete({ _id: req.params.id })
		.then((response) =>
			res.json({ status: 200, messages: 'News is deleted successfully', response })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
