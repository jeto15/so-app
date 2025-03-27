import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const isAuthPage = req.nextUrl.pathname === "/signin";

    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/", "/signin"],
};
 