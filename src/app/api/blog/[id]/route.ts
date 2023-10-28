import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { main } from "../route";

const prisma = new PrismaClient();

// 固有のブログ取得
export const GET = async (req: Request, res: NextResponse) => {
    try {
        const id: number = parseInt(req.url.split("/blog/")[1]);

        await main();
        const post = await prisma.post.findFirst({ where: { id } });
        return NextResponse.json({message: "Success", post}, {status: 200});
    } catch(err) {
        return NextResponse.json({message: "Err", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}

// 固有のブログ編集
export const PUT = async (req: Request, res: NextResponse) => {
    try {
        const id: number = parseInt(req.url.split("/blog/")[1]);
        const { title, description } = await req.json();

        await main();
        const post = await prisma.post.update({
            data: {title, description},
            where: { id },
        })
        return NextResponse.json({message: "Success", post}, {status: 200});
    } catch(err) {
        return NextResponse.json({message: "Err", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}

// 固有のブログ削除
export const DELETE = async (req: Request, res: NextResponse) => {
    try {
        const id: number = parseInt(req.url.split("/blog/")[1]);

        await main();
        const post = await prisma.post.delete({
            where: { id },
        })
        return NextResponse.json({message: "Success", post}, {status: 200});
    } catch(err) {
        return NextResponse.json({message: "Err", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
}