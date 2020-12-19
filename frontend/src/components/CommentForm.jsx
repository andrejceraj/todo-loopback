import React from 'react';

const CommentForm = (props) => {
  return (
    <form onSubmit={(e) => props.postComment(e)}>
      <label htmlFor="content">Comment:</label><br/>
      <textarea type="text" id="content" name="content" /><br/>

      <input type="submit" value="Comment" />
    </form>
  );
}

export default CommentForm;