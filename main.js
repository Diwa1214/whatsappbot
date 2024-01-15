const express = require("express")

const app = express()

app.use(express.json())


app.get('/webhook',function(req,res){
  console.log(req,"req");  
  const mode = req.query["hub.mode"]
  const challenges = req.query['hub.challenge']
  const verify_token = req.query['hub.verify_token']

  const WHATSAPP_TOKEN ='whatsappBot'

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
    console.log(body_params)

})

app.get("/",function(req,res){
    res.send("Whatsapp server")
})

app.listen(5000,()=>{
    console.log("Whatsapp server is running on port 5000")
})