import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FeedContext } from "../context/FeedContext";
import { client } from "../utils";

const ModifyPost = ({ postId, closeModal, goToHome }) => {
  const { feed, setFeed } = useContext(FeedContext);
  const history = useHistory();

  const handleModifyPost = () => {
    closeModal();

    if (goToHome) {
      history.push(`/`);
    }

    setFeed(feed.filter((post) => post.id !== postId));
    toast.success("Your post has been modified successfully");
    client(`/posts/${postId}`, { method: "POST" });
  };

  return <span onClick={handleModifyPost}>Modify Post</span>;
};

export default ModifyPost;
