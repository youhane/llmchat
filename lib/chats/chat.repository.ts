import prisma from "../prisma"

const getAllChats = async () => {
    return await prisma.chat.findMany()
}

const createChat = async (data: any) => {
    return await prisma.chat.create({
        data
    })
}

export { getAllChats, createChat }