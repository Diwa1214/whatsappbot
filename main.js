const express = require("express")
require('dotenv').config()
const axios = require('axios');

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

app.post('/webhook', async function(req,res){
    const body_params = req.body
    console.log(body_params.entry,"params");

    if(body_params.object){


        if(body_params.entry && body_params.entry[0].changes && body_params.entry[0].changes[0].value.messages && body_params.entry[0].changes[0].value.messages[0]){
            let phone_no_id =  body_params.entry[0].changes[0].value.metadata.phone_number_id
            let from  = body_params.entry[0].changes[0].value.messages[0].from
            let body = body_params.entry[0].changes[0].value.messages[0].text.body

            
            let url = `https://graph.facebook.com/v17.0/${phone_no_id}/messages?access_token=${process.env.TOKEN}`

            // console.log(body,"body");

           if(body == "Hai"){
                await axios.post(url,{
                    "messaging_product": "whatsapp",
                    "to":from,
                    "type":"template",
                    "template":{
                        "name":"hello_world",
                        "language":{
                            "code":"en_US"
                        }
                    }
                })
                res.status(200).send("success")
           }
           else{
              res.status(403).send("failure")
           }

        }
    }

})

app.get("/",function(req,res){
    res.send("Whatsapp server")
})

app.listen(process.env.PORT,()=>{
    console.log("Whatsapp server is running on port 5000")
})