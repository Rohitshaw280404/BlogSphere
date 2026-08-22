import { User } from "../Model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Generate access token and refresh token
const generateAccessAndRefreshTokens = async (userId) => {

    try {

        const user = await User.findById(userId);

        if (!user) {
            throw  ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false
        });

        return {
            accessToken,
            refreshToken
        };

    } catch (error) {

        throw  ApiError(
            500,
            "Something went wrong while generating access and refresh tokens"
        );
    }
};


// Register user

const registerUser = async (req, res) => {

    const {
        username,
        email,
        password,
        fullName
    } = req.body;


    // Check required fields
    if (!username || !email || !password || !fullName) {
        throw ApiError(
            400,
            "All fields are required"
        );
    }


    // Check if email already exists
    const existingEmail = await User.findOne({
        email: email.toLowerCase()
    });

    if (existingEmail) {
        throw  ApiError(
            400,
            "Email already exists"
        );
    }


    // Check if username already exists
    const existingUsername = await User.findOne({
        username: username.toLowerCase()
    });

    if (existingUsername) {
        throw  ApiError(
            400,
            "Username already exists"
        );
    }


    // Create user
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        fullName
    });


    // Remove sensitive fields
    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");


    if (!createdUser) {
        throw  ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }


    return res.status(201).json(
         ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
};


// Login user
const loginUser = async (req, res) => {

    const {
        email,
        password
    } = req.body;


    // Validate input
    if (!email || !password) {
        throw  ApiError(
            400,
            "Email and password are required"
        );
    }


    // Find user
    const existingUser = await User.findOne({
        email: email.toLowerCase()
    });


    if (!existingUser) {
        throw  ApiError(
            401,
            "Invalid email or password"
        );
    }


    // Check password
    const isPasswordCorrect =
        await existingUser.isPasswordCorrect(password);


    if (!isPasswordCorrect) {
        throw  ApiError(
            401,
            "Invalid email or password"
        );
    }


    // Generate tokens
    const {
        accessToken,
        refreshToken
    } = await generateAccessAndRefreshTokens(
        existingUser._id
    );


    // Remove sensitive fields
    const loggedInUser = await User.findById(
        existingUser._id
    ).select("-password -refreshToken");


    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
             ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
};

const logoutUser = async (req, res) => {

    // Remove refresh token from database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    // Cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            ApiResponse(
                200,
                null,
                "User logged out successfully"
            )
        );
};

const refreshAccessToken = async (req, res) => {

    try {

        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body?.refreshToken;

        if (!incomingRefreshToken) {
            throw ApiError(
                401,
                "Refresh token is required"
            );
        }


        // Verify refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );


        // Find user
        const user = await User.findById(
            decodedToken._id
        );

        if (!user) {
            throw ApiError(
                401,
                "Invalid refresh token"
            );
        }


        // Compare token stored in database
        if (
            incomingRefreshToken !==
            user.refreshToken
        ) {
            throw ApiError(
                401,
                "Refresh token is expired or invalid"
            );
        }


        // Generate new tokens
        const accessToken =
            user.generateAccessToken();

        const refreshToken =
            user.generateRefreshToken();


        // Store new refresh token
        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false
        });


        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };


        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                options
            )
            .cookie(
                "refreshToken",
                refreshToken,
                options
            )
            .json(
                ApiResponse(
                    200,
                    {
                        accessToken
                    },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {

        throw ApiError(
            401,
            error?.message ||
            "Invalid refresh token"
        );
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};