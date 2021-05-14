const axios = require('axios');

const bookmarks = new Set();
const seen = new Set();
let ids;
let feedArray = [];
let firstCall = true;
let cutOff = 30;

// start with 30
// all consecutive requests will return 10

const getFeedIds = async () => {
  const data =  await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
  return data.data;
};

const getFeedFromId = async (id) => {
  const data = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
  return data.data;
}

exports.getInitialFeeds = async (req, res) => {
  const {isCalled} = req.body;
  cutOff = 40;
  // get all the ids on first call
  let allIds;
  if (firstCall) {
    allIds = await getFeedIds();
    // cache the ids
    ids = [...allIds];
  }

  // iterate each id and get the data
  for (let i = 0; i < 20; i++) {
    let obj = {};
    if (firstCall) {
      obj = await getFeedFromId(allIds[i]);
      feedArray.push(obj);
    } else {
      obj = await getFeedFromId(ids[i]);
    }
  }
  firstCall = isCalled;
  console.log(feedArray)

  // send the data
  res.json(feedArray)
};

exports.getMoreFeeds = async (req, res) => {
  const feedArray = [];
  const limit = 10;
  let end = false;
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

const getCommentById = async (id) => {
  const data = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
  return data.data;
};

exports.getComments = async (req, res) => {
  // get all comments id
  const {comments} = req.query;
  console.log(comments)
  const commentArray = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = await getCommentById(comments[i]);
    commentArray.push(comment);
  };
  res.send(commentArray);
};

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

exports.getBookmarkedData = async (req, res) => {
  const feedArray = [];
  for (let i = 0; i < bookmarks.size; i ++) {
    const arr = Array.from(bookmarks);
    const obj = await getFeedFromId(arr[i]);
    feedArray.push(obj);
  }
  console.log(feedArray)
  res.send(feedArray);
};

exports.record = async (req, res) => {
  const {id} = req.body;
  if (seen.has(id))  {
    res.send('already seen')
  } else {
    seen.add(id);
    res.send('recorded ' + id)
  }
};

