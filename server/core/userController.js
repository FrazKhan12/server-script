import User from "../modals/userModal.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, userName, password, city } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).send({
        message: "Email already registered",
        success: false,
      });
    }
    let newUserName = userName;
    const checkUserName = await User.findOne({ userName });
    if (checkUserName) {
      const randomNum = Math.floor(Math.random() * 1000);
      newUserName = userName + randomNum;
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      userName: newUserName,
      password,
      city,
    });
    await newUser.save();
    res.status(200).send({
      message: "Account created Successfully",
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received Email:", email);
    console.log("Received Password:", password);
    const user = await User.findOne({ email });
    console.log("Stored Hashed Password:", user.password);
    if (!user) {
      return res.status(200).send({
        message: "Email is not registered",
        success: false,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    console.log("Password Comparison Result:", checkPassword);

    if (!checkPassword) {
      return res.status(200).send({
        message: "Password is wrong",
        success: false,
      });
    } else {
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30m",
      });
      res.status(200).send({
        message: "Login Succes",
        success: true,
        data: token,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      success: false,
    });
  }
};
