import { createChat, getAllChats } from '@/libs/chats/chat.repository';
import { NextResponse } from 'next/server';

async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const email = authHeader?.split(' ')[1];

  if (!email) {
    return NextResponse.json({
      success: false,
      statusCode: 400,
      message: "Email is required",
    });
  }

  return NextResponse.json({
    success: true,
    statusCode: 200,
    message: "Successfully fetch all chats",
    data: await getAllChats({ email }),
  });
  }

async function POST(req: Request){
    const body = await req.json();
    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Successfully create chat",
      data: await createChat(body),
    });
}
  

export { GET, POST };