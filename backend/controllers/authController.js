const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

// Register
exports.register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      password,
      role,
    } = req.body;


    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role: role || "patient",
    });
    await sendEmail(
      user.email,
      "Welcome to Saanvi Hospital Management System",
      `
    <div style="font-family:Arial;padding:20px;">
        <h2 style="color:#0d6efd;">
            Welcome to Saanvi HMS
        </h2>

        <p>Hello <b>${user.fullname}</b>,</p>

        <p>
            Your account has been created successfully.
        </p>

        <p>
            You can now log in to the Hospital Management System and access all available services.
        </p>

        <hr>

        <p>
            Thank you,<br>
            <b>Saanvi Hospital Management System</b>
        </p>
    </div>
    `
    );

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        department: user.department,

      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail(
      user.email,
      "Reset Your Password - Saanvi HMS",
      `
      <div style="font-family:Arial;padding:20px">
        <h2>Password Reset</h2>

        <p>Hello <b>${user.fullname}</b>,</p>

        <p>You requested to reset your password.</p>

        <a href="${resetLink}"
           style="
             background:#0d6efd;
             color:white;
             padding:12px 20px;
             text-decoration:none;
             border-radius:5px;
           ">
           Reset Password
        </a>

        <br><br>

        <p>This link expires in <b>15 minutes</b>.</p>

        <hr>

        <b>Saanvi Hospital Management System</b>
      </div>
      `
    );

    res.json({
      success: true,
      message: "Password reset email sent.",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {

    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(400).json({
      message: "Invalid or expired reset link",
    });

  }
};
exports.getDoctors = async (
  req,
  res
) => {
  try {
    const doctors =
      await User.findAll({
        where: {
          role: "doctor",
        },
        attributes: [
          "id",
          "fullname",
          "email",
          "department",

        ],
      });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getAllUsers =
  async (req, res) => {
    try {

      const users =
        await User.findAll({
          attributes: {
            exclude: [
              "password",
            ],
          },
        });

      res.json(users);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }
  };
