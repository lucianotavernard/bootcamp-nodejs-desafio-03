const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const PurchaseSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

PurchaseSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('Purchase', PurchaseSchema)
