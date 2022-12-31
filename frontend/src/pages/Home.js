import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Suggestions from "../components/Suggestions";
import NoFeedSuggestions from "../components/NoFeedSuggestions";
import Post from "../components/Post";
import Loader from "../components/Loader";
import { FeedContext } from "../context/FeedContext";
import { UserContext } from "../context/UserContext";
import { client } from "../utils";

const Wrapper = styled.div`
  @media screen and (max-width: 1040px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Home = () => {
  const { setUser } = useContext(UserContext);
  const { feed, setFeed } = useContext(FeedContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    };

    client("/users/feed")
      .then((res) => {
        // access token expired
        let expired = false;
        if (res.accessToken) {
          localStorage.setItem("token", res.accessToken);
          expired = true;
        } else {
          setFeed(res.data);
          setLoading(false);
        }
        return expired;
      })
      .then((expired) => {
        // get new token and re-request
        if (expired) {
          client("/users/feed").then((res) => {
            setFeed(res.data);
            setLoading(false);
          });
        }
      })
      .catch((res) => {
        console.log(res);
        logout();
      });
  }, [setFeed, setUser]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {feed.length > 0 ? (
        <>
          <div className="home">
            {feed.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
          <Suggestions />{" "}
        </>
      ) : (
        <NoFeedSuggestions />
      )}
    </Wrapper>
  );
};

export default Home;
