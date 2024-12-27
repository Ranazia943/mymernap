import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(
      'mongodb://localhost:27017/goldmine3x?retryWrites=true&w=majority'
    );
		console.log('db connection established', mongoose.connection.host)
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
