const express = require("express")

const app = express()
const PORT = process.env.PORT || 4000;

app.use(express.json())

const amqp = require("amqplib");
var channel, connection;

const exchange_name = 'test-exchange';
const exchange_type = 'fanout';

connectQueue() // call connectQueue function
async function connectQueue() {
    try {

        connection = await amqp.connect("amqp://10.0.39.71:5672");
        channel = await connection.createChannel()

        // https://amqp-node.github.io/amqplib/channel_api.html#channel_assertExchange
        await channel.assertExchange(exchange_name, exchange_type, {
            durable: false
        })

    } catch (error) {
        console.log(error)
    }
}

const sendMessageToQueue = async (message) => {
    const queue_name = '';
    await channel.publish(
        exchange_name,
        queue_name, 
        Buffer.from(message)
    );
}

app.get("/send-msg", (req, res) => {
    const message = "Hello World!";

    sendMessageToQueue(message)

    console.log("Message sent to the exchange");

    res.send("Message Sent");
    
})

app.post("/post-msg",(req,res)=>
{
    const message = req.body.message; // Assuming you're using middleware like bodyParser to parse the request body

    if (!message) {
        return res.status(400).send("Message is required");
    }

    sendMessageToQueue(message);

    console.log("Message sent to the exchange");


    res.send(message);
});

app.listen(PORT, () => console.log("Server listening at port " + PORT))