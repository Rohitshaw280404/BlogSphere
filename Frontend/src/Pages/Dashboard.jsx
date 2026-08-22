import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

    const { user } = useAuth();

    const [posts, setPosts] = useState([]);


    useEffect(() => {

        const fetchPosts = async () => {

            try {

                const response = await api.get(
                    `/posts?search=`
                );

                const allPosts =
                    response.data.data.posts;

                setPosts(
                    allPosts.filter(
                        post =>
                            post.author?._id === user?._id
                    )
                );

            } catch (error) {

                console.error(error);

            }
        };


        fetchPosts();

    }, [user]);


    return (
        <main>

            <h1>
                Welcome, {user?.fullName}
            </h1>


            <Link to="/create-post">
                Create New Post
            </Link>


            <h2>Your Posts</h2>


            {posts.map((post) => (
                <div key={post._id}>

                    <h3>
                        {post.title}
                    </h3>

                    <Link
                        to={`/posts/${post._id}`}
                    >
                        View
                    </Link>

                    {" "}

                    <Link
                        to={`/edit-post/${post._id}`}
                    >
                        Edit
                    </Link>

                </div>
            ))}

        </main>
    );
};

export default Dashboard;