import mongoose from "mongoose";

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true, // 4.20 — index for faster title search
    },
    author: String,
    url: String,
    likes: {
        type: Number,
        default: 0,
    },
    // 4.17 — reference to the user who created the blog
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

blogSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Blog", blogSchema);
