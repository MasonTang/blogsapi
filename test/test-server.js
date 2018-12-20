const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const {app, runServer, closeServer} = require("../server");

describe('Blog Post', function() {
    
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    });

    it("should list items on Get", function(){
        return chai
            .request(app)
            .get("/blogpost")
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("array");
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['title', 'content', 'author'];
                res.body.forEach(function(item){
                    expect(item).to.be.a("object");
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add an item on POST', function() {
        const newItem = {title: 'travel', content:'yes', author:'Mason'}
        const expectedKeys = ['id',  'publishDate'].concat(Object.keys(newItem));
        return chai 
            .request(app)
            .post("/blogpost")
            .send(newItem)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object");
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.title).to.equal(newItem.title)
            });
    });

    it('should update items on PUT', function() {
        
        return (
            chai
                .request(app)
                // first have to get
                .get("/blogpost")
                .then(function (res) {
                    const updatedPost = Object.assign(res.body[0], {
                        title: "connect the dots",
                        content: "la la la la la"
                    });
                    return chai
                        .request(app)
                        .put(`/blogpost/${res.body[0].id}`)
                        .send(updatedPost)
                        .then(function (res) {
                            expect(res).to.have.status(204);
                        });
                })
        );
    });

    it('should delete items on Delete', function() {
        return (
            chai    
                .request(app)
                .get("/blogpost")
                .then(function(res) {
                    return chai
                        .request(app)
                        .delete(`/blogpost/${res.body[0].id}`)
                        .then(function(res){
                            expect(res).to.have.status(204);
                    })
                })
        )
    })
})