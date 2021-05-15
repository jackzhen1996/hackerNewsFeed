import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './FeedBlock.css';
import CommentBlock from './CommentBlock.js';
import Moment from 'react-moment';
import CommentOrSave from './CommentOrSave.js';
import UpvoteIcon from './UpvoteIcon.js';

type FeedBlockProps= {
  title: string,
  url: string,
  score: number,
  by: string,
  time: string,
  commentLength: number,
  comments: number[],
  type: string,
};

// this don't work right now
// type CommentShape = {
//   by: string,
//   id: number,
//   kids: number[],
//   parent: number,
//   text: string,
//   time: number,
//   type: string,
//   order: number,
// };


const FeedBlock = ({id, title, url, score, by, time, commentLength, comments, type}: FeedBlockProps) => {
  const [expand, setExpand] = useState(false);
  const [data, setData] = useState([]);
  const [bookmark, isBookmarked] = useState(false);
  const feedBlockRef = useRef(null);
  const [error,setError] = useState(null);

  // expand the comment section and get data from server
  const expandComments = () => {
    if (!comments) {
      setError('No comments');
    } else {
    if (!expand && data.length === 0 ) {
      axios.get('http://localhost:3001/getComments', {
        params: {comments: comments}
      })
        .then(result=>{
          setData(result.data);
        })
        .catch(err=>{throw err})
    }
    }
    setExpand(!expand);


  };

  // add current story to bookmark list
  const handleBookmark = () => {
    axios.post('http://localhost:3001/bookmark', {
      id: id
    })
      .then(success=>{
        isBookmarked(!bookmark);
      })
      .catch(err=>{throw err})
  };

  // add current story to the list of seen post
  const sendSeenPosts = (id) => {
    return axios.post('http://localhost:3001/record',{
      id: id
    });
  };

  useEffect(()=>{
    /*
      How to track if element is completely out of viewport:
        - place imaginary box outside of viewport
        - check if the item of interest is completely inside the viewport
        - if the item is completely inside the imaginary box that means it is completely outside the viewport
    */

    /*
    option for intersection observer to check for intersection with FeedBlock components
    root: null because it defaults to the viewport
    rootMargin: top margin goes above the viewport by 30% so top border is above the viewport,
    the bottom margin is -100% so the border is at the top of the screen, and 0px on left and right
    threshold: 1 because the entire FeedBlock component has to fit within the rootMargins to count as scrolled pasts
    */
    const option = {
      root: null,
      rootMargin: '30% 0px -100%',
      threshold: 1
    };
    // checks for intersection
    const observerCB = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        sendSeenPosts(entry.target.dataset.id)
          .then(result=>{
            // console.log(result.data)
          })
      }
    }

    // only do the intersection check if its currently at the 'New' tab
    if (type === 'data') {
    const observer = new IntersectionObserver(observerCB, option);
    if (feedBlockRef.current) {
      observer.observe(feedBlockRef.current);
    };
    return ()=> {
      if (feedBlockRef.current) observer.unobserve(feedBlockRef.current);
    }
  }

  },[type]);

  return (
  <div ref={feedBlockRef} data-id ={id} className= {expand? 'feedBlockContainerExpanded':'feedBlockContainer'}>
    <div className='leftContainer'>
      <div className='scoreContainer'>
       <div><UpvoteIcon /></div>
        <div className='score'>{score} PTS</div>
        </div>
    </div>
    <div className='rightContainer'>
    <div className='upperContainer'>
      <span className='title'><a href={url}> {title} ( {url && url.slice(0,30)}... )</a> </span>
    </div>
    <div className='middleContainer'>
      <span className='authorContainer'>Posted by <span className='author'>{by} </span></span>
      <span className='time'><Moment fromNow>{new Date(time*1000)}</Moment></span>
    </div>
    <div className='lowerContainer'>
      <CommentOrSave expand={expand} commentLength={commentLength} type='comment' expandComments={expandComments}/>
      <CommentOrSave bookmark={bookmark} type='save' handleBookmark={handleBookmark}/>
    </div>

    </div>
    {
      expand &&
      (data.length > 0? data.map((comment, k)=>
        <CommentBlock type={comment.type} key={k} text={comment.text} by={comment.by} kids={comment.kids} time={comment.time}/>
      )
      :
      error? error : <div className="lds-ring"><div></div><div></div><div></div><div></div></div>)

    }
  </div>
  )
}

export default FeedBlock;