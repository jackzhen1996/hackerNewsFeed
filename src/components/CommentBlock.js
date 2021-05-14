import React, { useEffect, useState, FC } from 'react';
import './components.css';
import axios from 'axios';

type CommentObj = {
  type: string,
  id: number,
  text: string,
  by: string,
  time: string,
  kids: number[],
  parent: number
};

// interface CommentProps {
//   data: CommentObj[]
// };


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

    // expand
    setExpand(!expand);
  };

  return (
    <div className='commentContainer'>
      <div>
      <div><span>{by}</span> <span>{time}</span></div>
      <div>{text}</div>
      {
        kids ?
        <span onClick={expandComments} className='expandComments'>{kids.length} comments</span>
        :
        <span>0 comments</span>
      }
      </div>
      {
        data && data.map((comment,k)=>
          <CommentBlock type={comment.type} key={k} text={comment.text} by={comment.by} kids={comment.kids} time={comment.time}/>
        )
      }
    </div>
  )
};

export default CommentBlock;