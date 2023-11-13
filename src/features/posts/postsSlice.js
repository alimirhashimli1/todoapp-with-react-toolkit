import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postsAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionsAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder){
    builder.addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading"
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map(post => {
            post.date = sub(new Date(), {minutes: min++}).toISOString();
            post.reactions = {
                thumbsUp: 0,
                hooray: 0,
                heart: 0,
                rocket: 0,
                eyes: 0
            }
            return post
        })
        // add any fetched posts to the array
        state.posts = state.posts.concat(loadedPosts)
    })
    .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
    })
  }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const { postsAdded, reactionsAdded } = postsSlice.actions;
export default postsSlice.reducer;
