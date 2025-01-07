import { prisma } from '@/libs/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0; // disable cache
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
    try {
        console.time("DatabaseQuery");
        const chats = await prisma.chat.findMany();
        console.timeEnd("DatabaseQuery");
        return NextResponse.json(chats);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" });
    }
}

export async function POST(req: Request) {
    try {
        const { question, answer } = await req.json();
        const chat = await prisma.chat.create({
            data: {
                question,
                answer
            }
        });
        return NextResponse.json(chat);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" });
    }
}