const axios = require('axios');
const bookmarks = new Set();
// seen array resets after server restarts
const seen = new Set();
let ids;
let feedArray = [];
let firstCall = true;
// initial number of stories sent to client
let cutOff = 20;

// gets all ids from top stories
const getFeedIds = async () => {
  const data =  await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
  return data.data;
};

// gets a single story from an id
const getFeedFromId = async (id) => {
  const data = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
  return data.data;
}

// gets all stores at initla app start
exports.getInitialFeeds = async (req, res) => {
  const {isCalled} = req.body;
  // get all the ids on first call
  let allIds;
  if (firstCall) {
    allIds = await getFeedIds();
    // cache the ids
    ids = [...allIds];
  }

  // iterate each id and get the data
  for (let i = 0; i < cutOff; i++) {
    let obj = {};
    if (firstCall) {
      obj = await getFeedFromId(allIds[i]);
      feedArray.push(obj);
    } else {
      obj = await getFeedFromId(ids[i]);
    }
  }
  firstCall = isCalled;

  // send the data
  res.json(feedArray)
};

// gets more feeds when scrolling towards bottom of the page
exports.getMoreFeeds = async (req, res) => {
  const feedArray = [];
  const limit = 10;
  let end = false;

  // just in case if there less items then the request of 10 items
  // just stop iterating and return what is in the feedArray instead
  for (let i = cutOff-limit; i < cutOff; i++) {
    const obj = await getFeedFromId(ids[i]);
    // if at any point obj is undefined, the end of feedArray
    // is reached
    if (!obj) {
      end = true;
      break;
    }
    feedArray.push(obj);
  }
  if (end) {
    // reset cutoff
    cutOff = 30;
  } else {
    cutOff+=10;
  }
  res.send(feedArray);
};

// gets a single comment by id
const getCommentById = async (id) => {
  const data = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
  return data.data;
};

// gets all comments in the comments array sent from client
exports.getComments = async (req, res) => {
  // get all comments id
  const {comments} = req.query;
  if (comments.length === 0) {
    res.send(null);
  }
  const commentArray = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = await getCommentById(comments[i]);
    commentArray.push(comment);
  };
  res.send(commentArray);
};

// add bookmark to a set of book
exports.bookmark = async (req, res) => {
  const {id} = req.body;
  if (bookmarks.has(id)) {
    bookmarks.delete(id);
    res.send('Removed from Bookmark list');
  }
   else {
    bookmarks.add(id);
    res.send('Added to Bookmark list');
  }
};

// send back all bookmarked stories
exports.getBookmarkedData = async (req, res) => {
  if (bookmarks.size === 0) {
    res.send(null);
  };
  const feedArray = [];
  for (let i = 0; i < bookmarks.size; i ++) {
    const arr = Array.from(bookmarks);
    const obj = await getFeedFromId(arr[i]);
    feedArray.push(obj);
  }
  res.send(feedArray);
};

// record a story scrolled past the top
exports.record = async (req, res) => {
  const {id} = req.body;
  if (seen.has(id))  {
    res.send('already seen')
  } else {
    seen.add(id);
    res.send('recorded ' + id)
  }
};

// gets all stories the user scrolled past
exports.getSeenPosts = async (req, res) => {
  const feedArray = [];
  if (seen.size === 0) {
    res.send(null);
  }
  for (let i = 0; i < seen.size; i ++) {
    const arr = Array.from(seen);
    const obj = await getFeedFromId(arr[i]);
    feedArray.push(obj);
  }
  res.send(feedArray);
};

