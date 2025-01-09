import { createChat, getAllChats } from '@/libs/chats/chat.repository';
// import { prisma } from '@/libs/prisma';
import { NextResponse } from 'next/server';

// export const revalidate = 0; // disable cache
// export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';

// export async function GET(req: Request) {
//     try {
//         console.time("DatabaseQuery");
//         const chats = await prisma.chat.findMany();
//         console.timeEnd("DatabaseQuery");
//         return NextResponse.json(chats);
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Internal server error" });
//     }
// }

// export async function POST(req: Request) {
//     try {
//         const { question, answer } = await req.json();
//         const chat = await prisma.chat.create({
//             data: {
//                 question,
//                 answer
//             }
//         });
//         return NextResponse.json(chat);
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Internal server error" });
//     }
// }

async function GET(req: Request) {
    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Successfully fetch all chats",
      data: await getAllChats(),
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