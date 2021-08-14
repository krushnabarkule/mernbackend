const mongoose = require("mongoose")

//to connect or create our database
mongoose.connect("mongodb://localhost:27017/LoginDetails",{
    useCreateIndex : true,
    useUnifiedTopology : true,
    useNewUrlParser : true ,
    useFindAndModify : false
}).then( () =>{
    console.log(`Connection successfull`)
}).catch((e) =>{
    console.log(`No connection`)
})

