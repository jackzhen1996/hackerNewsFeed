import React, {useState} from 'react';
import Icon from './Icon.js';

type CommentOrSaveProps = {
  type: string,
  expand: boolean
};

// Component that is either the comment svg and comment button or bookmark svg and bookmark button
const CommentOrSave = ({expand, type, expandComments, handleBookmark, commentLength, bookmark}: CommentOrSaveProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div onMouseOver={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {type === 'comment'?
      <span className={expand?'expandedComments':'expandComments'} onClick={expandComments}> <Icon expand={expand} hover={hover} type='comment'/>
<span className='commentText'>{commentLength} comments</span></span>
      :
     <span className='bookmarkContainer' onClick={handleBookmark}><Icon hover={hover} type='save'/>
<span>{bookmark? 'Saved': 'Save'}</span></span>
  }
    </div>
  )
};

export default CommentOrSave;