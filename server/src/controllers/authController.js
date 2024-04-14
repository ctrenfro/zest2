import User from "../model/User.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  //evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //create JWTs
    const accessToken = jwt.sign(
      { UserInfo: { username: foundUser.username } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    //Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true, //for production only - used in https, but not http
      maxAge: 24 * 60 * 60 * 1000,
    });
    const id = foundUser._id.toString();

    res.json({ accessToken, id });
  } else {
    res.sendStatus(401);
  }
};
export { handleLogin };
