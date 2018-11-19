const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const companiesSchema = new Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: false },
  isEnabled: {  type: String, required: false  },
  type: { type: String, required: false },
}, { collection: 'companies' });

const Company = mongoose.model('Company', companiesSchema);

module.exports = Company;
