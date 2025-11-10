import { generateToekn } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/User.js";

export const logInUser = TryCatch(async (req,res) => {
      const {email} = req.body;

      const rateLimitKey = `otp:ratelimit:${email}`; 
      const rateLimit = await redisClient.get(rateLimitKey);

      if(rateLimit) { 
        res.status(429).json({
            message:"Too many requests. Please Wait."
         })
         return;
      }

      const otp = Math.floor(100000 + Math.random() *900000).toString();
      
      const otpKey = `otp:${email}`;
      await redisClient.set(otpKey, otp, { 
        EX:300,
      } )

      await redisClient.set(rateLimitKey, 'true', {
        EX:60,
      })

      const message = {
        to:email, 
        subject: "Your otp code", 
        body: "Your OTP code is " + otp + ". It is valid for 5 minutes.",
      }

      await publishToQueue("send-otp", message); 
      res.status(200).json({
        message:"OTP sent to your mail",
      })
})


// to verify User OTP 

export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp:enteredOtp} = req.body; 

    if(!email || !enteredOtp) {
      res.status(400).json({ 
        message:"Email and OTP are required",
      })
      return;
    }
      const otpKey = `otp:${email}`;

      const storedOtp = await redisClient.get(otpKey);
      if(!storedOtp || storedOtp !== enteredOtp) { 
        res.status(400).json({
            message:"Invalid or expred OTP",
        })
        return;
      }

      await redisClient.del(otpKey);

      let user = await User.findOne({ email });

      if(!user) {
        const name = email.split("@")[0];
        user = await User.create({ name, email });
      }

      const token = generateToekn(user)
      res.status(200).json({
        message:"User verified successfully",
        user, 
        token,
      })
} )

export const myProfile = TryCatch(async(req:AuthenticatedRequest, res) => {
     const user = req.user;
     res.json(user);
})

export const updateName = TryCatch(async(req:AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?._id); 
  if(!user) {
    res.status(404).json({
      message:"User not found",
    });
    return;
  }

  const {name} = req.body;
  user.name = name || user.name;
  await user.save();

  const token= generateToekn(user);


  res.status(200).json({
    message:"Name updated successfully",
    user,
    token,
  })
});

export const getAllUsers = TryCatch(async(req:AuthenticatedRequest, res) => {
     const users = await User.find();
     res.json(users);
} )

export const getAUser = TryCatch(async(req, res) => {
     const userId = req.params.id;
     const user = await User.findById(userId);
     if(!user) {
      res.status(404).json({
        message:"User not found",
      });
      return;
     }
     res.json(user);
} )