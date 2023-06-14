import mongoose from 'mongoose';

// Define schema for Payment model
const PaymentSchema = new mongoose.Schema({
  _idIdentity: {
    type: String,
    required: true,
  },
  type: {// credit or debit
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
});

// Export model
export default mongoose.model('Payment', PaymentSchema);
