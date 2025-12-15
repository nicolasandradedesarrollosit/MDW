import moongose from 'mongoose';

const orderSchema = new moongose.Schema({
    userId: { type: moongose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: moongose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            price: {type: Number, required: true }
        }]
    ,
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

const Order = moongose.model('Order', orderSchema);

export default Order;