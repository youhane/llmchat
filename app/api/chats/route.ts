import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

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