const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
   
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:3,maxlength:20,
        validate(value){
            if(!value.match(/^[A-Za-z]+$/)){
                throw new Error("First name should only contain alphabets")
            }
        }
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minLength:3,maxlength:20,
        validate(value){
            if(!value.match(/^[A-Za-z]+$/)){
                throw new Error("Last name should only contain alphabets")
            }
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,maxlength:100
        }
    ,
    gender:{
        type:String,
        required:true,
        validate(value){
            value = value.trim();
            value = value.toLowerCase();
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender ");
            }
        }
    },
    age:{
        type:Number,
        required:true,
        min:4,
        max:110
    },
    phone:{
        type:String,
        validate(value){
            if(!value.match(/^[0-9]{10}$/)){
                throw new Error("Phone number is not valid")
            }
        }
    },
    bio:{
        type:String,
        trim:true,
        maxLength:100
    },
    image:{
        type:String,
        default:"https://www.hindustantimes.com/ht-img/img/2025/03/26/550x309/IMG_9850_1743016356335_1743016432763.jpeg",
        trim:true
        ,validate(value){
            if(!validator.isURL(value)){
                throw new Error("Image URL is not valid");
            }
        }
    },
    skills:{
        type:[String],
        required:true,
        validate(value) {
            if (!value.every((skill) => /^[A-Za-z0-9+]+$/.test(skill))) {
              throw new Error("Skills can only contain letters, numbers, and '+'");
            }
          },
        validate(value){
            if(value.length < 1 || value.length > 10){
                throw new Error("Skills should be between 1 to 10")
            }
        }
    },
    location: {
        type: String,
        trim: true,
        validate(value) {
            if (!value.match(/^[A-Za-z0-9\s.,#\-'/\\]{1,100}$/)) {
                throw new Error("Location should be a valid address (alphanumeric, spaces, ., #, -, /, etc.)");
            }
        }
    }
    ,
    project1:{
        type:String,
        trim:true,
        maxlength:100,
    }
},{timestamps:true});
module.exports = mongoose.model("User",userSchema);