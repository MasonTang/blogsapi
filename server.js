const express = require('express');
//creates server
const app = express();
app.use(express.json());
//require blogpost.js file
const BlogPostRouter = require('./blogpost');
app.use('/blogpost', BlogPostRouter);
//server. use blogpostRouter when any request go to the url of localhost 8080/blogpost

let server;

function runServer(){
    const port = process.env.Port || 8080;
    return new Promise((resolve, reject) => {
        server = app
            .listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve(server);
            })
            .on('error', err => {
                reject(err);
            });
    });
}

function closeServer(){
    return new Promise((resolve, reject) => {
        console.log('Closing Server');
        server.close(err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

if(require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
