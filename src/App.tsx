import "./App.css";
import { useEffect, useState } from "react";
import MainFeed from "./components/MainFeed.js";
import axios from "axios";
import BookmarkIcon from "./components/BookmarkIcon.js";

// typescript is not letting me do "useState <someType> (some default value)", so i cant really use interface
// might have something to do with babel loader

// interface RawFeedObj {
//   by: string;
//   descedants: number;
//   id: number;
//   kids: number[];
//   score: number;
//   time: number;
//   title: string;
//   type: string;
//   url: string;
// }

// app entry point
const App = () => {
  const [data, setData] = useState([]);
  const [initial, setInitial] = useState(true);
  const [bookmarkedData, setBookmarkedData] = useState([]);
  const [currentType, setCurrent] = useState("data");
  const [seenPosts, setSeenPosts] = useState([]);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const getBookmarkedData = () => {
    return axios.get("http://localhost:3001/getBookmarkedData");
  };

  const getInitialData = () => {
    return axios.get("http://localhost:3001/getInitialFeeds");
  };

  const getMoreData = () => {
    return axios.get("http://localhost:3001/getMoreFeeds");
  };

  // opens bookmark view
  const handleBookmarkView = () => {
    // send request for bookmark posts
    getBookmarkedData()
      .then((result) => {
        if (!result.data) {
          setError("No Bookmarks yet");
        } else {
          setBookmarkedData(result.data);
        }
      })
      .catch((err) => {
        throw err;
      });
    setCurrent("bookmark");
  };

  // opens "Seen" view with post scrolled past previously
  const handleSeenPosts = () => {
    axios
      .get("http://localhost:3001/getSeenPosts")
      .then((result) => {
        if (!result.data) {
          setError("No Posts Visited Yet");
        } else {
          setSeenPosts(result.data);
        }
      })
      .catch((err) => {
        throw err;
      });
    setCurrent("seen");
  };

  // tracks scrolling position and check if the viewports hits the bottom of the total scrollable height
  // if so, then make a call for more data
  const handleScroll = () => {
    const bottom =
      document.scrollingElement.scrollHeight -
        document.scrollingElement.scrollTop ===
      document.scrollingElement.clientHeight;
    if (bottom) {
      // next batch of 10
      console.log("time to get more data");
      setLoadingData(true);
      getMoreData()
        .then((result) => {
          setData((data) => data.concat(result.data));
          setLoadingData(false);
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  // determine what type of data to render at the main feed
  let currentData;
  if (currentType === "data") {
    currentData = data;
  } else if (currentType === "seen") {
    currentData = seenPosts;
  } else {
    currentData = bookmarkedData;
  }

  useEffect(() => {
    // getting initial batch of stories
    if (initial) {
      getInitialData()
        .then((result) => setData(result.data))
        .catch((err) => {
          throw err;
        });
      setInitial(false);
    }

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const changeView = (view: string) => {
    if (view === "seen") {
      handleSeenPosts(view);
    } else {
      setCurrent(view);
    }
  };

  return (
    <div className="App">
      <div className="topContainer">
        <div className="titleBlock">
          <div>Y</div> Hacker <br /> News
        </div>
      </div>
      <div className="mainContainer">
        <div className="sideBar">
          <div>Hello, Jack!</div>
          <div
            className={
              currentType == "bookmark" ? "bookmarkActive" : "bookmark"
            }
            onClick={handleBookmarkView}
          >
            <BookmarkIcon /> Bookmarks
          </div>
        </div>
        <MainFeed
          loading={loadingData}
          error={error && error}
          getType={changeView}
          type={currentType}
          data={currentData}
        />
      </div>
    </div>
  );
};

export default App;
