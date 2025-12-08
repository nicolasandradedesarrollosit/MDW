import moongose from 'mongoose';

const productSizeSchema = new moongose.Schema({
    id_product: {
            type: moongose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
    },
    size: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    }
}, {timestamps: true});

const ProductSize = moongose.model('ProductSize', productSizeSchema);
export default ProductSize;