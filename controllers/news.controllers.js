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

exports.create = async (req, res) => {
	const data1 = async (data1) => {
		const newsMedia = await new MediaModel({
			title: 'news',
			url: data1.Location || null,
			mediaKey: data1.Key,
			alt: req.body.altImage || null,
		});
		newsMedia.save();

		const data2 = async (data2) => {
			const newsQuoteAuthorMedia = await new MediaModel({
				title: 'news-quote-author',
				url: data2.Location || null,
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
		await S3.uploadNewQuoteAuthorMedia(req, res, data2);
	};
	await S3.uploadNewMedia(req, res, data1);
};
