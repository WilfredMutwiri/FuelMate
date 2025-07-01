const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Station = require("../../models/auth/stationSignup");

const stationSignin = async (req, res) => {
  try {
    let { username, password } = req.body;

    username = username.trim().toLowerCase();

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and Password are required!" });
    }

    const station = await Station.findOne({ username });

    if (!station) {
      return res.status(400).json({ message: "Station does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, station.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    //token generation
    const token = jwt.sign(
      {
        stationId: station._id,
        username: station.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successfull!",
      success: true,
      token,
      user: {
        id: station._id,
        username: station.username,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  stationSignin,
};
