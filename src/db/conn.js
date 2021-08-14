const mongoose = require("mongoose")

//to connect or create our database
mongoose.connect(process.env.DATABASE,{
    useCreateIndex : true,
    useUnifiedTopology : true,
    useNewUrlParser : true ,
    useFindAndModify : false
}).then( () =>{
    console.log(`Connection successfull`)
}).catch((e) =>{
    console.log(`No connection`)
})

