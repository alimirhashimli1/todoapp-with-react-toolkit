import AddPostForm from './features/posts/AddPostForm';
import PostsList from './features/posts/PostsList';
import Layout from './components/Layout';
import SinglePostPage from './features/posts/SinglePostPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <AddPostForm/>
     <PostsList/>
    </div>
  );
}

export default App;
