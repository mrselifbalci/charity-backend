const UserModel = require('../model/User.model');
const MediaModel = require('../model/Media.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const S3 = require('../config/aws.s3.config');

exports.getAllUsers = async (req, res) => {
	const { page = 1, limit } = req.query;
	const total = await UserModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await UserModel.find()
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 })
		.populate('mediaId', 'url title alt')
		.then((data) => res.json({ total: total, pages, status: 200, data }))
		.catch((err) => res.json({ message: err }));
};

exports.getSingleUserById = async (req, res) => {
	await UserModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.getSingleUserByFirstName = async (req, res) => {
	await UserModel.findById({ firstname: req.params.firstname }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.getSingleUserByLastName = async (req, res) => {
	await UserModel.findById({ lastname: req.params.lastname }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.getSingleUserByEmail = async (req, res) => {
	await UserModel.findById({ email: req.params.email }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.getSingleUserByCountry = async (req, res) => {
	await UserModel.findById({ country: req.params.country }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.createUser = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location || null,
			title: 'users',
			mediaKey: data.Key,
			alt: req.body.alt || null,
		});

		newMedia.save();

		const {
			firstname,
			lastname,
			email,
			password,
			country,
			isActive,
			isDeleted,
			role,
		} = req.body;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await new UserModel({
			firstname,
			lastname,
			email,
			country,
			mediaId: newMedia._id,
			password: hashedPassword,
			role,
			isActive,
			isDeleted,
		});
		newUser
			.save()
			.then((response) =>
				res.json({ status: true, message: 'Signed up successfully.', response })
			)
			.catch((err) => res.json({ status: false, message: err }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	if(!email) {
		return res.json({status:400, message:'Enter a email address.'})
	}

	if(!password) {
		return res.json({status:400, message:'Enter your password.'})
	}

	await UserModel.findOne({email}, async (err, data) => {
		if(err) {
			res.json({message: err})
		} else if(data === null) {
			res.json({message: 'Email does not exist.'})
		} else {
			if (await bcrypt.compare(password, data.password)) {
							const token = jwt.sign(
								{ name: email, role: data.role },
								process.env.ACCESS_TOKEN_SECRET,
								{ expiresIn: '1h' }
							);
							res.json({
								status: true,
								firstname: data.firstname,
								lastname: data.lastname,
								email: data.email,
								country: data.country,
								isActive: data.isActive,
								isDeleted: data.isDeleted,
								id: data._id,
								mediaId: data.mediaId,
								role: data.role,
								token: token
							});
						} else {
							res.json({ status: false, message: 'Wrong password' });
						}
		}
	}).populate('mediaId', 'title url alt')
};

exports.updateUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: user.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'users',
								mediaKey: data.Key,
								alt: req.body.alt || null,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});
			const { firstname, lastname, country, role } = req.body;
			await UserModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						firstname,
						lastname,
						country: !req.body.country ? user.country : req.body.country,
						mediaId: user.mediaId,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						role: !req.body.role ? user.role : req.body.role,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: true,
						message: 'User is updated successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: false, message: err }));
		})
		.catch((err) => res.json({ status: false, message: err }));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: user.mediaId },
				{
					$set: { isActive: false },
				},
				{ useFindAndModify: false, new: true }
			);
			await UserModel.findByIdAndRemove({ _id: req.params.id })
				.then((data) =>
					res.json({ message: 'User is deleted successfully', data })
				)
				.catch((err) => res.json({ message: err }));
		})
		.catch((err) => res.json({ message: err }));
};

// exports.deleteUser = async (req, res) => {
// 	await UserModel.findByIdAndDelete({ _id: req.params.id })
// 		.then(async (user) => {
// 			await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
// 				S3.deleteMedia(media.mediaKey);
// 				await MediaModel.findByIdAndDelete({ _id: user.mediaId });
// 			});
// 			res.json(user);
// 		})
// 		.then((data) => res.json({ message: 'User is removed successfully.', data }))
// 		.catch((err) => res.json({ message: err }));
// };
