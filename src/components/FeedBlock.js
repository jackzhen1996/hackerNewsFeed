import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './components.css';
import CommentBlock from './CommentBlock';

type FeedBlockProps= {
  title: string,
  url: string,
  score: number,
  by: string,
  time: string,
  commentLength: number,
  comments: number[]
};

type CommentShape = {
  by: string,
  id: number,
  kids: number[],
  parent: number,
  text: string,
  time: number,
  type: string,
  order: number
};


const FeedBlock = ({id, title, url, score, by, time, commentLength, comments }: FeedBlockProps) => {
  const [expand, setExpand] = useState(false);
  const [data, setData] = useState([]);
  const [bookmark, isBookmarked] = useState(false);
  const feedBlockRef = useRef(null);
  const expandComments = () => {
    // get the data
    if (!expand && data.length === 0 ) {
      axios.get('http://localhost:3001/getComments', {
        params: {comments: comments}
      })
        .then(result=>{
          console.log(result.data)
          setData(result.data);
          // expand
          setExpand(!expand);

        })
        .catch(err=>{throw err})
    }

  };

  const handleBookmark = () => {
    axios.post('http://localhost:3001/bookmark', {
      id: id
    })
      .then(success=>{
        console.log(success.data)
        isBookmarked(!bookmark);
      })
      .catch(err=>{throw err})
  }

  // const getMeasurementFromTop = useCallback(node=>{
  //   let bottom = node.getBoundingClientRect().bottom;
  //   window.
  // },[]);
  const observerCB = (entries) => {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      console.log(`${entry.target.dataset.id} is ${entry.isIntersecting}`);
    }
  }

  const option = {
    root: null,
    rootMargin: '0px',
    threshold: 0
  };

  useEffect(()=>{
    const observer = new IntersectionObserver(observerCB, option);
    if (feedBlockRef.current) observer.observe(feedBlockRef.current);
    return ()=> {
      if (feedBlockRef.current) observer.unobserve(feedBlockRef.current);
    }
  },[option])

  return (
  <div ref={feedBlockRef} data-id ={id} className= {data.length > 0? 'feedBlockContainerExpanded':'feedBlockContainer'}>
    {id}
    <div className='upperContainer'>
      {title}
      <a href={url}>{url}</a>
    </div>
    <div className='middleContainer'>
      {score}
       | by {by} |
      {time} | <span className='expandComments' onClick={expandComments}>{commentLength} comments</span>
      <span onClick={handleBookmark}> {bookmark? 'Bookmarked': 'Bookmark'}</span>
    </div>
    {
      expand?
      data.map((comment, k)=>
        <CommentBlock type={comment.type} key={k} text={comment.text} by={comment.by} kids={comment.kids} time={comment.time}/>
      )
      :
      null
    }
  </div>
  )
}

export default FeedBlock;