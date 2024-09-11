import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        // Connect to MongoDB using the URI from environment variables
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        // Log the error and provide a descriptive message
        console.log('Error connecting to MongoDB:', error);
    }
}

export default connectToMongoDB;
