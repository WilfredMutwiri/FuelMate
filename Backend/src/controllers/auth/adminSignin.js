const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/auth/adminModel");

const adminSignin = async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.trim().toLowerCase();

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required!" });
    }

    const admin = await Admin.findOne({ username });

    if (!admin || admin.role !== "admin") {
      return res.status(400).json({ message: "Access denied! Admins only." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    //token generation
    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        message: "Login successfull!",
        success: true,
        token,
        user: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const adminSignout = (req, res) => {
  try {
    res.clearCookie("access_token").status(200).json({
      message: "Signout successful!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminSignin,
  adminSignout,
};
