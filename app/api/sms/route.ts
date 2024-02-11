import twilio from "twilio";
import {NextResponse} from "next/server";


const accountSid = 'AC9f542013a6c231da6ae9c8dc90b30ed8';
const authToken = '2a86ebcee1b5c7c84e1dbe026f4092ef';
export async function POST(req:any) {
  try {
    const client = require("twilio")(accountSid, authToken);
    console.log(req);
    const {message,tel} = await req.json();
    console.log("message",message)
    console.log("tel",tel)
    const response = await client.messages.create({
      body: message,
      from: '+12408216255',
      to: tel
    });
    return  NextResponse.json({message: response}, {status: 200});
  } catch (error:any) {
    return NextResponse.json({message: error}, {status: 500});
  }
}