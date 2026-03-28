export const Resolve=function (req, res) {
    const { token, refreshToken } = req.user;

    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        accessToken: token,
        refreshToken: refreshToken
    });
}  