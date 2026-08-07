import user from "../Model/user.model.jsx"; 
import ApiError from "../utils/ApiError.js";


//generate access and refresh token

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}



// signup user
function registerUser(req, res) {
    const { username, email, password} = req.body;

    if(email==user.email){
        throw new ApiError(400, "Email already exists")
    }
     const user = await User.create({
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

}
// login user
function loginUser(req, res) {
    const { email, password } = req.body;

    const existingUser = user.findOne({ email: email });
    const ispasswordCorrect = await user.ispasswordCorrect(password);

    if(!existingUser || !ispasswordCorrect){ {
        throw new ApiError(400, "Invalid email or password")
    }
const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

}