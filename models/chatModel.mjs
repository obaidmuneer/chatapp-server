import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config()
mongoose.connect(process.env.DB_URI)

const chatSchema = mongoose.Schema({
    name: { type: String, required: true },
    msg: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const chatModel = mongoose.model('chat', chatSchema)

export default chatModel