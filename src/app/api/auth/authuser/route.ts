import { connect } from "@/dbconfig/dbConfig";
import User from "@/models/userModel";
import { ITokenData } from "@/types/token-data-interface";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const token = cookies().get("token")?.value || "";
    if (token.length > 0) {
      const data: ITokenData = jwt.verify(
        token,
        process.env.TOKEN_SECRET!
      ) as ITokenData;
      const userId = data.id;
      const user = await User.findById(userId).select("-password");

      if (user) {
        return NextResponse.json({
          message: "User Details Found",
          success: true,
          data: user,
        });
      } else {
        // Remove token from cookies
        const response = NextResponse.json({
          message: "Invalid Token !",
          success: false,
          staus: 400,
        });
        response.cookies.delete("token");
        return response;
      }
    } else {
      // Remove token from cookies
      const response = NextResponse.json({
        message: "Can not access token !",
        success: false,
        staus: 400,
      });
      response.cookies.delete("token");
      return response;
    }
  } catch (error: any) {
    // Remove token from cookies
    const response = NextResponse.json({
      message: "Sorry, some error occured !",
      success: false,
      staus: 400,
    });
    response.cookies.delete("token");
    return response;
  }
}
