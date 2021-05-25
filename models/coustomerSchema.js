const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function passwordValidator(password) {
    if (password === this.firstName
        || password === this.lastName
        || password === this.email) {
        return false
    }
    return true
} 

const coustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have first name'],
        trim: true,
        maxlength: [25, 'max charater is 25'],
        minlingth: [3, 'name must have minimum  3 character']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'must have an email id'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    mobileNumber: {
        type: Number,
        match: [/^[1-9]{1}[0-9]{9}$/, 'please provide a valid phone number'],
        required: true
    },
    address: {
        addressLineOne: {
            type: String,
            required: true,
            maxlength: [100, 'address should not exceed 100 characters'],
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'city name should not exceed 100 characters']
        },
        state: {
            type: String,
            required: true,
            trim: true,
            maxlength: [100, 'state name should not exceed 100 characters']
        },
        zip: {
            type: Number,
            required: true
        }
    },
    password: {
        type: String,  
        required: [true, 'password field is must'],
        minlength: [8, 'password must have minimum length of 8 character'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            'Password must contain capital, small letters , alphabet, and spechal character'],
        validate: [passwordValidator, 'password should not contain user name or email'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'confirm password field is must'],
        validate: {
            validator: function (pass) {
                return pass === this.password
            },
            message: 'password and passwordConfirm must be same'
        }
    },
    userType: {
        type: String,
        default: 'coustomer'
    },
    passwordChangedAt: Date,
    PasswordResetExpiresIn: Date,
    emailVerificationToken: String
})


coustomerSchema.pre('save', async function(next){ 
    const coustomer = this;
    if (!coustomer.isModified('password')) return next(); // only run the function if the password is modified
    coustomer.password = await bcrypt.hash(coustomer.password, 12); //hashing the password of strength 12
    coustomer.passwordConfirm = undefined;     // deleting the passwordConfirm field
    next();
});

coustomerSchema.pre('save', function (next) {
    const coustomer = this;
    if (!coustomer.isModified('password') || coustomer.isNew) return next();
    coustomer.passwordChangedAt = Date.now() - 1000; // due to jwt token it must created before
    next();
});

coustomerSchema.methods.correctPassword = async function(rawPassword, hashedPassword) {
    return await bcrypt.compare(rawPassword, hashedPassword);
};

coustomerSchema.methods.changedPasswordAfter = function (JWTTimestamp) { 
    const coustomer = this;
    if (coustomer.passwordChangedAt) {
        const changedTimestamp = (coustomer.passwordChangedAt.getTime() / 1000) * 1;
        return JWTTimestamp < changedTimestamp
    };
    return false;
};



const Coustomer = mongoose.model('Coustomer', coustomerSchema);

module.exports = Coustomer;