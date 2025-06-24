import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = ['/pass'];
const authPages = ['/', 'Registration'];

export async function middleware(request) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })
    const {pathname} = request.nextUrl;
    if(!token && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/",request.url))
    }
    if(token && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/pass",request.url))
    }
    
  return NextResponse.next();
}
export const config = {
    matcher:["/pass",'/',"/Registration"],
};