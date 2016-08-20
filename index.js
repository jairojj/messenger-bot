'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if(text === "Pedra" || text === "Papel" || text === "Tesoura"){
                let array = ["Pedra", "Papel", "Tesoura"]
                let rand = array[Math.floor(Math.random() * array.length)]
                sendTextMessage(sender, rand)

                if(text === "Pedra" && rand === "Pedra"){
                    sendFinalMsg(sender, "Empatou :( Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Pedra" && rand === "Tesoura"){
                    sendFinalMsg(sender, "Parabéns, você ganhou :D Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Pedra" && rand === "Papel"){
                    sendFinalMsg(sender, "Que pena, eu ganhei :D Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Papel" && rand === "Pedra"){
                    sendFinalMsg(sender, "Parabéns, você ganhou :D Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Papel" && rand === "Tesoura"){
                    sendFinalMsg(sender, "Que pena, eu ganhei :D Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Papel" && rand === "Papel"){
                    sendFinalMsg(sender, "Empatou :( Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Tesoura" && rand === "Tesoura"){
                    sendFinalMsg(sender, "Empatou :( Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Tesoura" && rand === "Pedra"){
                    sendFinalMsg(sender, "Que pena, eu ganhei :D Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                if(text === "Tesoura" && rand === "Papel"){
                    sendFinalMsg(sender, "Parabéns, você ganhou :D Para jogar novamente clique no botão abaixo.)")
                    continue
                }
                continue
            }
        }
        if (event.postback) {
            let text = event.postback.payload
            console.log(text)
            if(text === "welcome"){
                sendWelcomeMsg(sender)
                continue
            }
            if(text === "play"){
                game(sender)
                continue
            }
        }
    }
    res.sendStatus(200)
})

const token = "EAAI33LrhKcMBAKilGPBKAX5kZBmfC19kNDoFAZBEhzlMSFZCevHLWS0MkWDZA7ycQkpUmYmHAuMQ6ZC5ooxMjo2A3VpzC4StoRvt7BrcH9rnVDAgYCfzgC6XZBZCw5JNDApnPjMzptFMSZCbxlgMnm2tQ9B8Q5zhjY0eAHMILF3wTAZDZD"

function sendFinalMsg(sender, msg){
    let message = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text": msg,
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Jogar Novamente",
                        "payload":"play"
                    }
                ]
            }
        }
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function game(sender){
    let msg = {
        "text":"Escolha uma das opções:",
            "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Pedra",
                    "payload":"pedra"
                },
                {
                    "content_type":"text",
                    "title":"Papel",
                    "payload":"papel"
                },
                {
                    "content_type":"text",
                    "title":"Tesoura",
                    "payload":"tesoura"
                }
            ]    
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: msg,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function sendWelcomeMsg(sender){
    let msg = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":"Vamos jogar pedra, papel e tesoura. Clique em jogar e digite sua escolha.",
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Jogar",
                        "payload":"play"
                    }
                ]
            }
        }
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: msg,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})