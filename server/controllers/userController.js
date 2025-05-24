import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

// Register user: /api/user/register
export const register = async (req, res) => {
  console.log('register called', req.body)
  try {
    const { name, email, password } = req.body;

    // Check required info
    if(!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    // Check existing email
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.json({ success: false, message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    // Create token
    const token = jwt.sign({ id: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Token settings
    res.cookie('token', token, {
      httpOnly: true, // Prevent js to access cookie
      secure: process.env.NODE_ENV === 'production', // TODO: Use secure cookies in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Expiration time - 7d
    })

    // return user data
    return res.json({ success: true, 
      user: { email: user.email, name: user.name }
    })
    
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}