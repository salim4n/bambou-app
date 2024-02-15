import twilio from "twilio";
import {NextResponse} from "next/server";


const accountSid = 'AC82b58b8cb865c42dbbb4a4ff70d47dce';
const authToken = '14e5400f996ff2bcefa9eeb6fa2ce2a6';
export async function POST(req:any) {
  try {
    const client = require("twilio")(accountSid, authToken);
    const {message,tel} = await req.json();
    const response = await client.messages.create({
      body: message,
      from: '+12138163392',
      to: tel
    });
    return  NextResponse.json({message: response}, {status: 200});
  } catch (error:any) {
    return NextResponse.json({message: error}, {status: 500});
  }
}