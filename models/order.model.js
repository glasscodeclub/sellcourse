const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    raz_payment_id: {
        type: String,
        required: true
    },
    raz_order_id: {
        type: String,
        required: true,
        unique: true
    },
    raz_signature: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
    },
    courseID: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);