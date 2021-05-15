import React, { FC } from 'react';
import './MainFeed.css';
import FeedBlock from './FeedBlock.js';

type FeedObj = {
  title: string,
  url: string,
  score: number,
  by: string,
  time: string,
  id: number,
  kids: number[],
  // need to add function type
};

interface MainFeedProps {
  data: FeedObj[],
  type: string,
  error: string,
  loading: boolean,
  firstScroll: boolean
};

// Maps and contains all the stories
const MainFeed: FC<MainFeedProps> = ({data,type, getType, error, loading, firstScroll}) => {
  return (
    <div className='mainFeedContainer'>
      <div className='categoriesContainer'>
        <div className='categories'><span className={type==='data'? 'typeActive': null} onClick={()=>getType('data')}>New</span><span className={type==='seen'? 'typeActive': null}  onClick={()=>getType('seen')}>Seen</span><span>Show</span><span>Jobs</span><span>Ask</span></div>
      </div>
      {data.length !== 0 ? data.map((post,k)=>
        <FeedBlock type= {type} id={post.id} comments={post.kids} key={k} title = {post.title} url={post.url}
        score={post.score} by={post.by} time={post.time} commentLength ={post.descendants}
        />
      )
      :
      error ? <div>{error}</div> : <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    }
    {loading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
    </div>
  )
};

export default MainFeed;