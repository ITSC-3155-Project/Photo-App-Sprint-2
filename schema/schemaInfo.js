"use strict";

const mongoose = require("mongoose");

const schemaInfoSchema = new mongoose.Schema({
  version: String,
  load_date_time: { type: Date, default: Date.now },
});

const SchemaInfo = mongoose.model("SchemaInfo", schemaInfoSchema);

module.exports = SchemaInfo;
