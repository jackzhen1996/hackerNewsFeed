import './App.css';
import { useEffect, useState, useRef} from 'react';
import MainFeed from './components/MainFeed.js';
import axios from 'axios';

// interface RawFeedObj {
//   by: string,
//   descedants: number,
//   id: number,
//   kids: number[],
//   score: number,
//   time: number,
//   title: string,
//   type: string,
//   url: string
// };

const App=()=>{
  const [data, setData] = useState([]);
  const [initial, setInitial] = useState(true);
  const [bookmarkedData, setBookmarkedData] = useState([]);
  const [bookmarkView, changeView] = useState(false);

  const getBookmarkedData = () => {
    return axios.get('http://localhost:3001/getBookmarkedData');
  };

  const getInitialData = () => {
    return axios.get('http://localhost:3001/getInitialFeeds');
  };

  const getMoreData = () => {
    return axios.get('http://localhost:3001/getMoreFeeds');
  };

  const handleBookmarkView = () => {
    // send request for bookmark posts
    getBookmarkedData()
      .then(result=>{
        console.log(result.data)
        setBookmarkedData(result.data);
        changeView(!bookmarkView);
      })
      .catch(err=>{throw err})
  }

  const handleScroll = () => {
      // let currentHeight = document.scrollingElement.height;
      // console.log('scroll top ' + currentHeight)
      // console.log('window height ' + 0.85 * windowHeight)
      // console.log('scroll height' + document.scrollingElement?.scrollHeight)
      const bottom = document.scrollingElement.scrollHeight - document.scrollingElement.scrollTop === document.scrollingElement.clientHeight;
      if (bottom) {
        // next batch of 10
        console.log('time to get more data')
        getMoreData()
          .then(result=>{
            setData(data=>data.concat(result.data));
          })
          .catch(err=>{throw err})
      }
    }


  useEffect(()=>{

    if (initial) {
      getInitialData()
        .then(result=>setData(result.data))
        .catch(err=>{throw err})
      setInitial(false);
    }

    window.addEventListener('scroll',handleScroll ,true);

    return ()=>{
      window.removeEventListener('scroll', handleScroll);
    }

  },[]);


  return (
    <div className="App" >
      <div className='titleBlock'>Hacker News Feed</div>
      <div onClick={handleBookmarkView}>Bookmarks</div>
      <div className='mainContainer' >
        {/* <div className='sideBar'>side</div> */}
        {data.length === 0? "Loading...":
          <MainFeed data={bookmarkView? bookmarkedData: data}/>
        }
      </div>
    </div>
  );
}

export default App;
