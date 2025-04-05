import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await User.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Email Already Exists",
          }),
          { status: 400 }
        );
      } else {
        // Hash the password and update the existing user
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save(); // Save the updated user
        
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );

        if (!emailResponse.success) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Error sending verification email",
            }),
            {
              status: 500,
            }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Verification email sent successfully",
          })
        );
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry date for the verification code

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save(); // Save the new user

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Error sending verification email",
          }),
          {
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "User registered successfully. Please check your email to verify.",
        })
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      {
        status: 500,
      }
    );
  }
}
