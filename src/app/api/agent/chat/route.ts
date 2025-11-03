import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest){
    try {
        const body = await request.json();
    } catch (error) {
        
    }
}