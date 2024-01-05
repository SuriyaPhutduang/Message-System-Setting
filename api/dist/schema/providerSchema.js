const mongoose = require("mongoose");
const credentialSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  credential: credentialSchema,
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"] // ถ้าคุณต้องการจำกัดค่าของ 'status'
  }
}, {
  timestamps: true
});
const Provider = mongoose.model("Provider", providerSchema);
module.exports = Provider;