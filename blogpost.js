const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require ('./models')

//add BlogPosts
BlogPosts.create('Travel Blog', 'There was once a time, I traveled to Spain', 'Mason Tang')
BlogPosts.create('Teacher Blog', 'Counting down the days', 'Mason Tang')
BlogPosts.create('Medical Blog', 'I discected a body today and I ate to eat lunch afterwards', 'Mason Tang')

//the router will get the BlogPosts items
router.get('/', (req,res) => {
    res.json(BlogPosts.get());
});

//when a new BlogPosts is posted, check if 
// required fields has title, content and author
// if not then log an error and 400 status code
//if okay then add a new item to Blog Post List
//and return it with a 201 code

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for(let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)){
           const message = `Missing ${field} in request body`
           console.error(message);
           return res.status(400).send(message); 
        }
    }
    const item = BlogPosts.create(
        req.body.title, 
        req.body.content, 
        req.body.author
    );
    res.status(201).json(item);
    })

//delete request that has the proper id in the BlogPosts List
router.delete('/:id', (req,res) => {
    BlogPosts.delete(req.params.id);
    console.log(`${req.params.ID} was deleted`)
    res.status(204).end();
})

//when put request comes in with an updated item,
//check if it has the required fields,
//also check if the url id and item id match
//if there is a problem log error and send back status code 400
//otherwise call `BlogPosts.update` with updated item

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
    for(let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing ${field} in body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if(req.params.id !== req.body.id){
        const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating Blog Post items ${req.params.id}`)
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(204).end();
})

module.exports = router;