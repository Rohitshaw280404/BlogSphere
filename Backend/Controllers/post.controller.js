import { Post } from "../Model/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Create a new post
const createPost = async (req, res) => {

    const {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        status
    } = req.body;

    // Validate required fields
    if (!title || !slug || !content || !category) {
        throw ApiError(
            400,
            "Title, slug, content and category are required"
        );
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });

    if (existingPost) {
        throw ApiError(400, "A post with this slug already exists");
    }

    // Create post
    const post = await Post.create({
        title,
        slug,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        status,
        author: req.user._id
    });

    // Get created post with author information
    const createdPost = await Post.findById(post._id)
        .populate("author", "username fullName");

    if (!createdPost) {
        throw ApiError(
            500,
            "Something went wrong while creating the post"
        );
    }

    return res.status(201).json(
        ApiResponse(
            201,
            createdPost,
            "Post created successfully"
        )
    );
};


// Get all published posts
const getAllPosts = async (req, res) => {

    const {
        page = 1,
        limit = 10,
        search = "",
        category = "",
        tag = ""
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    const query = {
        status: "published"
    };

    // Search by title or content
    if (search) {
        query.$or = [
            {
                title: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                content: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    // Filter by category
    if (category) {
        query.category = category;
    }

    // Filter by tag
    if (tag) {
        query.tags = tag.toLowerCase();
    }


    // Get posts
    const posts = await Post.find(query)
        .populate("author", "username fullName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);


    // Get total number of matching posts
    const totalPosts = await Post.countDocuments(query);

    const totalPages = Math.ceil(totalPosts / limitNumber);


    return res.status(200).json(
        ApiResponse(
            200,
            {
                posts,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalPosts,
                    limit: limitNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPreviousPage: pageNumber > 1
                }
            },
            "Posts fetched successfully"
        )
    );
};


// Get single post
const getPostById = async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id)
        .populate("author", "username fullName");

    if (!post) {
        throw ApiError(404, "Post not found");
    }

    return res.status(200).json(
        ApiResponse(
            200,
            post,
            "Post fetched successfully"
        )
    );
};


// Update post
const updatePost = async (req, res) => {

    const { id } = req.params;

    const {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        category,
        tags,
        status
    } = req.body;

    const post = await Post.findById(id);

    if (!post) {
        throw ApiError(404, "Post not found");
    }

    // Only the author can update the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw ApiError(
            403,
            "You are not authorized to update this post"
        );
    }

    // Check slug uniqueness if slug is being changed
    if (slug && slug !== post.slug) {

        const existingPost = await Post.findOne({ slug });

        if (existingPost) {
            throw ApiError(
                400,
                "A post with this slug already exists"
            );
        }
    }

    // Update fields only if provided
    if (title !== undefined) post.title = title;
    if (slug !== undefined) post.slug = slug;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) post.status = status;

    await post.save();

    const updatedPost = await Post.findById(post._id)
        .populate("author", "username fullName");

    return res.status(200).json(
        ApiResponse(
            200,
            updatedPost,
            "Post updated successfully"
        )
    );
};


// Delete post
const deletePost = async (req, res) => {

    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
        throw ApiError(404, "Post not found");
    }

    // Only the author can delete the post
    if (post.author.toString() !== req.user._id.toString()) {
        throw ApiError(
            403,
            "You are not authorized to delete this post"
        );
    }

    await Post.findByIdAndDelete(id);

    return res.status(200).json(
        ApiResponse(
            200,
            null,
            "Post deleted successfully"
        )
    );
};


export {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};