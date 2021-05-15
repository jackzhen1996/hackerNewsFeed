import React, { useState } from 'react';
import './CommentBlock.css';
import axios from 'axios';
import Moment from 'react-moment';

type CommentObj = {
  type: string,
  id: number,
  text: string,
  by: string,
  time: string,
  kids: number[],
  parent: number
};

const CommentBlock = ({type, id, text, by, time, kids, parent}: CommentObj) => {

  const [expand, setExpand] = useState(false);
  const [data, setData] = useState([]);

  const expandComments = () => {
    // get the data
    if (!expand && data.length === 0) {
      axios.get('http://localhost:3001/getComments', {
        params: {comments: kids}
      })
        .then(result=>{
          console.log(result.data)
          setData(result.data);
        })
        .catch(err=>{throw err})
    }
    setExpand(!expand);
  };

  return (
    <div className='commentContainer'>
      <div>
      <div><span className='author'>{by}</span> <span className='time'><Moment fromNow>{new Date(time*1000)}</Moment></span></div>
      <div className='commentBody'>{text}</div>
      {
        kids ?
        <span onClick={expandComments} className={expand?'expandedComments':'expandComments'}>{kids.length} comments</span>
        :
        <span>0 comments</span>
      }
      </div>
      {
        expand && (
          data.length > 0?
          data.map((comment,k)=>
          <CommentBlock type={comment.type} key={k} text={comment.text} by={comment.by} kids={comment.kids} time={comment.time}/>
        )
        :
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>)
      }
    </div>
  )
};

export default CommentBlock;