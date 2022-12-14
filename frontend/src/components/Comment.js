import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Avatar from "../styles/Avatar";

const CommentWrapper = styled.div`
  display: flex;

  span {
    padding-right: 0.4rem;
  }
`;

const Comment = ({ comment, hideavatar }) => {
  const history = useHistory();

  return (
    <CommentWrapper style={{ padding: !hideavatar ? "0.4rem 0" : "" }}>
      {!hideavatar && (
        <Avatar
          className="pointer"
          onClick={() => history.push(`/${comment.User.username}`)}
          src={comment.User.avatar}
          alt="avatar"
        />
      )}

      <p>
        <span
          onClick={() => history.push(`/${comment.User.username}`)}
          className="bold pointer"
        >
          {comment.User.username}
        </span>
        {comment.text}
      </p>
    </CommentWrapper>
  );
};

export default Comment;
