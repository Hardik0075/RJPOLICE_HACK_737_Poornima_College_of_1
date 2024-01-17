const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');

//nodemailer 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "gaminghardik097@gmail.com",
    pass: "rqxzbfxuoozcwvno",
  },
});


// Ensure you replace the MongoDB connection string with the correct one
mongoose.connect('mongodb://0.0.0.0/rph', { useNewUrlParser: true, useUnifiedTopology: true });

var conn = mongoose.connection;

conn.on('connected', function() {
    console.log('Database is connected successfully');
});

conn.on('disconnected', function() {
    console.log('Database is disconnected');
});

var bodyParser = require('body-parser');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Added for URL-encoded data

const reviewSchema = new mongoose.Schema({
    name: String,
    contact: String,
    email: String,
    city: String,
    thana: String,
    rating : String,
    feedback : String,
    issue: String,
    // date: Date.now
});

// Renamed the model for clarity
const Review = mongoose.model('Review', reviewSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname+ "/views/form.html"); // Using the direct view name
});

app.post("/post", async (req, res) => {
    let inputText = req.body.feedback;
    var myData = new Review(req.body);

    const url = `https://googles-bert-sentiment-analysis.p.rapidapi.com/sentiment?text=${encodeURIComponent(inputText)}&lang=en`;

    const options = {
        method: 'GET',
        headers: {
        'X-RapidAPI-Key': 'abc0508769mshb8592cf98146751p191b6fjsnb4a1946ba880',
        'X-RapidAPI-Host': 'googles-bert-sentiment-analysis.p.rapidapi.com'
        }
    };
    const response = await fetch(url, options);
    const result = await response.json();
    var textToSend='';
    // console.log(result.label);
    if(result.label==="negative"){
        textToSend='SORRY FOR INCOVINIENCE, we will try to make your experience more better next time.';
    }
    else{
        textToSend='Hello thank you for your feedback';
    }
    // mail api
    try {
        const info = await transporter.sendMail({
            from: {name : 'Hardik',address:"gaminghardik097@gmail.com"},
            to: myData.email, // Receiver's email address
            text: textToSend,
            subject: 'Feedback recieved',
            // attachments:{
            //     filename:"logo.png",
            //     path: path.join(__dirname+"/logo.png"),
            //     contentType:"image/png"
            // }
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }

    // sentimental analysis
    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse the response as JSON
        // const sentimentLabel = result.data.label; 
        // const result = await response.text();
        // Display the result on the page
        // document.getElementById('result').innerHTML = `<p>Sentiment Analysis Result: ${result}</p>`;
        console.log(result.label);
    } catch (error) {
        console.error(error);
    }
    console.log(req.body);
    myData.save()
        .then(() => {
            res.sendFile(__dirname+"/views/uploaded.html");
        })
        .catch((err) => {
            console.error(err);
            res.send("Failed to save the data. Please try again.");
        });
});

app.get("/feed",async(req,res)=>{
    const items = await Review.find();
const numberFeed = await Review.countDocuments();  // Use countDocuments() instead of count()
res.render("newFeed", { items: items, num: numberFeed });
})



app.get("/chatbot",(req,res)=>{
    res.render("chatbog");
})

// app.get("/hello",(req,res)=>{
     
// const apiKey = 'isc6ZoNwrUFjzaISV13v2POxfEtLTuglDh4JQCykReAYq8MmG0bYh3aOXWFzRrIlyw6N01BTVpZGA4xL';
// const phoneNumber = '+919414994690';  // Include country code, e.g., '+91' for India
// const message = 'Hello, this is a test message from your Node.js app!';
// const apiUrl = 'https://www.fast2sms.com/dev/bulkV2';
// const headers = {
//   'authorization': apiKey,
//   'Content-Type': 'application/x-www-form-urlencoded',
// };

// const data = `route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${phoneNumber}`;

// axios.post(apiUrl, data, { headers })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error('Error sending SMS:', error.response ? error.response.data : error.message);
//   });

// })


//fileer based on thana
app.get("/filters",async(req,res)=>{
    const items = await Review.find(req.query);

    // const contents = await Contact.find();
    const numItems = items.length;
    res.render("newFeed",{items:items,num:numItems});
})

//analysis

app.get("/analysis",async(req,res)=>{
    // const items = await Contact.find(req.query);
    // const contents = await Contact.find();
    
    const reviews = await Review.find(req.query);
    let numItems = await Review.find(req.query).countDocuments();
    const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating, 10), 0);
    let dreq = totalRating/numItems;
    console.log(totalRating);
    console.log(numItems);
    res.render("ana",{dreq:dreq});
    // res.render("stu1",{items:items,num:numItems});
})




app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});

