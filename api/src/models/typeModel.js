const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    desc: String,
    msgChannelId: mongoose.Schema.Types.ObjectId,
    status: String,
  },
  { collection: "msgType" }
);


const Type = mongoose.model("type", typeSchema);

module.exports = Type;

