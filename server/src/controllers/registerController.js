import User from "../model/User.js";
import bcrypt from "bcrypt";

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  //check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    res.status(201).json({ message: `New user ${user} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handleNewUser;
