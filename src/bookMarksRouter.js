const express = require('express');
const uuid = require('uuid/v4');
const bookmarks = require('./store');
const bookMarksRouter = express.Router();
const bodyParser = express.json();
const logger = require('./logger');

bookMarksRouter
    .route('/bookmarks')
    .get((req,res)=> {
        res.json(bookmarks)
    })
    .post(bodyParser,(req,res)=> {
        const{url,title,rating,description} = req.body;
        if(!title) {
            logger.error('no title');
            return res
                .status(400)
                .send('Invalid data')
        }
        if(!description) {
            logger.error('no description');
            return res
                .status(400)
                .send('Invalid data')
        }
        if(!url) {
            logger.error('no url');
            return res
                .status(400)
                .send('Invalid data')
        }
        if(!rating) {
            logger.error('no rating');
            return res
                .status(400)
                .send('Invalid data')
        }
        const id=uuid();
        const bookmark = {
            id,
            title,
            url,
            rating,
            description
        };
        console.log('id is',bookmark.id);
        bookmarks.push(bookmark);
        logger.info(`bookmark with id ${id} is created`);
        res
            .status(201)
            .location(`http://localhost:8000/bookmark/${id}`)
            .json(bookmark);
     
        // bookMarksRouter.get((req,res)=> {
        //     const {id} = req.params;
        //     const bookmarkId = bookmarks.find(bookmark => bookmark.id == id);
        //     console.log(bookmarkId);
        //     if(!bookmarkId){
        //         return res
        //             .status(404)
        //             .send('bookmark not found')
        //     }
        //     return res
        //         .status(302)
        //         .send(bookmark)
        // })
    })
   
    bookMarksRouter
        .route('/bookmarks/:id')
        .get((req,res)=> {
            const {id} = req.params;
            const bookmarkExist = bookmarks.find(bookmark => bookmark.id == id);
            if(!bookmarkExist){
                return res
                     .status(404)
                    .send('bookmark not found')
                }
            res.json(bookmarkExist)
        })
        .delete((req,res)=> {
            const {id} = req.params;
            const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
            if(bookmarkIndex === -1) {
                logger.error(`Bookmark with id ${id} not exist`);
                return res
                    .status(404)
                    .send('Bookmark Not found')
            }
            bookmarks.splice(bookmarkIndex,1);
            logger.info(`Bookmark with ${id} deleted`);
            res
                .status(204)
                .end();
        })
   
module.exports = bookMarksRouter;

// {
//     "title":"MDN",
//     "url":"https://developer.mozilla.org/en-US/",
//     "rating":5,
//     "description":"web documentation"
// }