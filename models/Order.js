const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  orderId: { type: String, required: true },
  transactionId: { type: String},
  paymentInfo: { type: Object, default: null },
  products: { type: Object, required: true},
  // [{
  //     productId: { type: String },
  //     quantity: { type: Number, default: 1 },
  //    }],
     address: { type: String, required: true },
     amount: { type: Number, required: true },
     status: { type: String, default: "Initiated", required: true },
     deliveryStatus: { type: String, default: "unshipped", required: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
