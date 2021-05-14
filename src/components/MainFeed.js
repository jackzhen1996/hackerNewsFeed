import React, { useEffect, useState, useRef, useCallback, FC } from 'react';
import './components.css';
import FeedBlock from './FeedBlock.js';

type FeedObj = {
  title: string,
  url: string,
  score: number,
  by: string,
  time: string,
  id: number,
  kids: number[]
};

interface MainFeedProps {
  data: FeedObj[],
};


const MainFeed: FC<MainFeedProps> = ({data}) => {

  return (
    <div className='mainFeedContainer'>
      {/* <div ref={getBoxChange} className='boundingRect'>bounding rect</div> */}
      {data.map((post,k)=>
        <FeedBlock id={post.id} comments={post.kids} key={k} title = {post.title} url={post.url}
        score={post.score} by={post.by} time={post.time} commentLength ={post.descendants}
        />
      )}
    </div>
  )
};

export default MainFeed;