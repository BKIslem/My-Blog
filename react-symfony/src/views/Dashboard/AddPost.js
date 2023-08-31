import Nav from "../../components/Navbar/Nav";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const AddPost = () => {
    // const [Posts, setPosts] = useState();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('No access token found');
                    navigate('/login');
                }
                const currentDate = new Date();
                const isoDate = currentDate.toISOString();
                const newPosts = {
                    user: "/api/users/22",
                     title: title,
                     body: body,
                    comments: [],
                    publishedAt:isoDate 
                };
                const response = await fetch('http://localhost:8000/api/posts', {
                    method: 'Post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newPosts),
                });
        
                if (!response.ok) {
                    throw new Error('Failed to create post');
                }
        
                const responseData = await response.json(); 
                console.log(responseData);
                console.log(currentDate);
                console.log(isoDate);
                // setPosts(responseData);
                setSuccess(true);
                setBody();
                setTitle();
                
            } catch (err) {
                console.error(err);
                // navigate('/login');
                // navigate('/login', { state: { from: location }, replace: true });
            }


    };
    return (
        <>
         <Nav />
        {success ? (
            
            <section className="container mx-auto px-20">
            <h1 className="text-center text-white text-2xl">Success!</h1>
            <p className="text-center text-sky-400 text-2xl">
                <a href="http://localhost:3000/addpost" >Add Other Post</a>
            </p>
            </section>
            ) : (
                    
                        <section className="container mx-auto px-20">
                        <h1 className="text-center text-white text-2xl">Add Posts</h1>
                        <form onSubmit={handleSubmit}>
                        <label for="small-input" 
                        className="block mb-2 text-sm font-medium text-white dark:text-white">Title</label>
                        <input type="text" 
                            id="small-input" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg
                                bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700
                                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                                dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                <br></br>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                    <label for="editor" className="sr-only">Publish post</label>
                    <textarea id="editor" rows="8"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                        className="block w-full px-0 text-sm text-gray-800 bg-white border-0
                        dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                        placeholder="Write an article..."> </textarea>
                </div>
            </div>
            <button type="submit" className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Publish post
            </button>
            </form>
                        </section>
                        )}
        </>
)}
    export default AddPost;