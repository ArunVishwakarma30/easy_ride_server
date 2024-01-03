const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema(
    {
        type : {type : String, required : true},
        image : {type : String, required : true},
        model : {type : String, required : true},
        registrationNumber : {type : String, required : true},
        offeringSeat : {type : Number, required : false},
        makeAndCategory :  {type : String, required : false},
        features : {type : String, required : false},
        exception :  {type : String, required : false},
        isDefault : {type : Boolean, default : false},
        requiredHelmet : {type : Boolean, required : false},
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Vehicle", VehicleSchema)