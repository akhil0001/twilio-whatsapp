/**
 * Copy account SID and authToken from twilio dashboard and paste theme here
 */
const accountSid = '';
const authToken = '';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

const https = require('https');

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    let result = 'I do not think the input is a number';
    const { body: { Body } } = req;
    if (typeof +Body === 'number' && !isNaN(+Body)) {
        result = Body % 2 === 0 ? 'It is an Even number' : 'It is an Odd Number';
        twiml.message(result);

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
    else if (Body.toLowerCase().includes('tp')) {
        https.get('https://jsonplaceholder.typicode.com/posts/1', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(result);
                result = `This is from Third Party : ${(JSON.parse(data).body)}`
                twiml.message(result);

                res.writeHead(200, { 'Content-Type': 'text/xml' });
                res.end(twiml.toString());
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }
});

http.createServer(app).listen(8080, () => {
    console.log('Express server listening on port 8080');
});
