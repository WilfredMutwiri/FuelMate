const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  fileUrl: {
    data: Buffer,
    contentType: String,
  },
});

const fileModel = mongoose.model("File", fileSchema);
module.exports = fileModel;
