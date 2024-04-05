// Import Mongoose
const mongoose = require("mongoose");
const dataSchemaObj = {
    name: { type: String, require: true },
}
// Create schema
const mongooseSchema = mongoose.Schema(dataSchemaObj);
// Create and export model
module.exports = mongoose.model("Product", mongooseSchema);
