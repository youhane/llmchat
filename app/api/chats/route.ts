import prisma from '@/libs/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0; // disable cache
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes
export const fetchCache = 'force-no-store';

export async function GET(req: Request) {
    try {
        const chats = await prisma.chat.findMany();
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