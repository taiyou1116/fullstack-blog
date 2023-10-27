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
        const posts = await prisma.post.findMany();
        return NextResponse.json({message: "Success", posts}, {status: 200});
    } catch(err) {
        return NextResponse.json({message: "Err", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}

// ブログを投稿
export const POST = async (req: Request, res: NextResponse) => {
    try {
        const {title, description} = await req.json();

        await main();
        const post = await prisma.post.create({data: {title, description}});
        return NextResponse.json({message: "Success", post}, {status: 201});
    } catch(err) {
        return NextResponse.json({message: "Err", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}