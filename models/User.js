const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlainTextPassword = ' s0 / \ / \ P 4 $$ w0rD ' ;
const someOtherPlaintextPassword = ' not_bacon ' ;   

const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength:50
    },
    email:{
        type : String,
        trim : true,
        unique : 1
    },
    password:{
        type: String,
        maxlength : 50
    },
    lastname:{
        type : String,
        maxlength : 50
    },
    role:{
        type : Number,
        default: 0
    },
    image : String,
    token:{
        type : String
    },
    tokenExp:{
        type : Number
    }
})

userSchema.pre('save', function(next){
    var user = this;
    
    // 비밀번호가 modified 되면
    if(user.isModified('password')){
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        });
    });
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
        cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }