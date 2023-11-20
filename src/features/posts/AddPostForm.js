import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { addNewPost } from "./postsSlice.js";
import { selectAllUsers } from "../users/usersSlice.js";
import { useNavigate } from "react-router-dom";

const AddPostForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle")

  const users = useSelector(selectAllUsers);

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === "idle"


  const onSavePostClicked = () => {
   if(canSave){
    try {
      setAddRequestStatus("pending")
      dispatch(addNewPost({title, body: content, userId})).unwrap()
      setTitle("")
      setContent("")
      setUserId("")
      navigate("/")
    } catch (error) {
      console.error("Failed to save the post", error)
    } finally {
      setAddRequestStatus("idle")
    }
   }
  };


  const usersOptions = users.map((user) => (
    <option value={user.id} key={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
         
        <label htmlFor="">Author:</label>
        <select
          id="post Author"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value=""></option>
          {usersOptions}
        </select>

        <label htmlFor="postContent">Post Content:</label>
        <input
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
