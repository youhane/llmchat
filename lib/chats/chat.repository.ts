import prisma from "../prisma"

const getAllChats = async ({ email }: { email: string }) => {
    return await prisma.chat.findMany({
        where: {
            userEmail: email
        }
    })
}

const createChat = async (data: any) => {
    return await prisma.chat.create({
        data
    })
}

export { getAllChats, createChat }