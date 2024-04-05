const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const dataSchemaObj = {
  username: { type: String, require: true },
  password: { type: String, require: true },
  oauthId: { type: String },
  oauthProvider: { type: String },
  created: { type: Date }
};

// Create schema
const mongooseSchema = mongoose.Schema(dataSchemaObj);
mongooseSchema.plugin(plm);

// Create and export model
module.exports = mongoose.model("User", mongooseSchema);
