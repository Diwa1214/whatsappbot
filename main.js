const express = require("express")
require('dotenv').config()

const app = express()

app.use(express.json())

console.log(process.env.WHATSAPP_TOKEN,process.env.PORT);


app.get('/webhook',function(req,res){
  console.log(req,"req");  
  const mode = req.query["hub.mode"]
  const challenges = req.query['hub.challenge']
  const verify_token = req.query['hub.verify_token']

  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN 

  if(mode && challenges){
      if(WHATSAPP_TOKEN == verify_token){
           res.status(200).send(challenges)
      }
  }
  else{
     res.status(403)
  }
})

app.post('/webhook',function(req,res){
    const body_params = JSON.stringify(req.body) 
    console.log(body_params,"hai")

})

app.get("/",function(req,res){
    res.send("Whatsapp server")
})

app.listen(process.env.PORT,()=>{
    console.log("Whatsapp server is running on port 5000")
})