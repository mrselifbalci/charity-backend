require('dotenv').config();
const mongoose = require('mongoose');
module.exports = () => {
	mongoose.connect(process.env.db_connection, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
	mongoose.connection.on('open', () => {
		console.log('DB connection established on','http://localhost:5001');
	});

	mongoose.connection.on('error', (err) => {
		console.log('Connection failed' + err);
	});
};
