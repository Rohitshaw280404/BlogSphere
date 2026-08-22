import { Link } from "react-router-dom";

const PostCard = ({ post }) => {

    return (
        <article>

            <h2>
                {post.title}
            </h2>


            <p>
                {post.excerpt ||
                    post.content.substring(0, 150)}
            </p>


            <p>
                By {post.author?.fullName}
            </p>


            <p>
                Category: {post.category}
            </p>


            <p>
                Likes: {post.likes?.length || 0}
            </p>


            <Link to={`/posts/${post._id}`}>
                Read More
            </Link>

        </article>
    );
};

export default PostCard;