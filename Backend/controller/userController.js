const ErrorHander = require("../utils/errorHander");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");


// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar: {
            public_id: "This is sample image",
            url: "PicURL",
        },
    });

    // const message = `Welcome to TeleConnect \n If you have not registered this email then, please ignore it.`;
    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: `Welcome to TeleConnect`,
    //         message,
    //     });
    // } catch (error) {
    //     return next(new ErrorHander(error.message, 500));
    // }

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Get User Detail
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    console.log(user);
    res.status(200).json({
        success: true,
        user,
    });
});

// Update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Update User Details
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {}); // TODO : ADD IF POSSIBLE

// Get all users --> Admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        users: users,
    })
})

// Get single users --> Admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorHander(`User not found with id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user: user,
    })
})

// update User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});