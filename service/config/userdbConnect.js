require("dotenv").config();
const mongoose = require("mongoose");

const userdbConnect = async () => { 
	try { 
		await mongoose.connect(process.env.USERDB_CONNECT); 
	} catch(error) { 
		console.error(`userdbConnect ERROR : ${error}`); 
	}
}
module.exports = { userdbConnect };

