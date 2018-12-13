const express = require('express');
//creates server
const app = express();
//require blogpost.js file
const BlogPostRouter = require('./blogpost');
//server. use blogpostRouter when any request go to the url of localhost 8080/blogpost
app.use('/blogpost', BlogPostRouter);

app.listen(process.env.Port || 8080, () => {
    console.log(`Your app is listening on  port 8080`)
});