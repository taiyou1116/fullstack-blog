import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main() {
    try {
        await prisma.$connect();
    } catch(err) {
        Error("DB接続に失敗しました");
    }
}

// ブログを全て取得
export const GET = async (req: Request, res: NextResponse) => {
    try {
        await main();
        const posts = prisma.post.findMany();
        return NextResponse.json({message: "success", posts}, {status: 200});
    } catch(err) {
        return NextResponse.json({message: "Err", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}