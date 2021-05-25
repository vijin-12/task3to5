const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'must have first name'],
        trim: true,
        maxlength: [25, 'max charater is 25'],
        minlingth: [3, 'name must have minimum  3 character']
    },
    price: {
        type: Number,
        required: [true, 'Product must have price'],
    },
    image: {
        type: String,
        default: 'default.jpg',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    slug: String,
})

productSchema.index({ slug: 1 });

productSchema.pre('save', function (next) { 
    this.slug = slugify(this.productName, { lower: true });
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;