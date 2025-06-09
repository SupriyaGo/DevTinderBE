const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is not a valid status`,
            required: true
        }
    }
}, {timestamps: true});

requestSchema.index({senderId: 1, receiverId: 1})

requestSchema.pre('save', async function(){
    if(this.senderId.equals(this.receiverId)) {
        throw new Error("You can not send connection request to yourself");
    }
})

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;