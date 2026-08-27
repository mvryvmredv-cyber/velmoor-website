import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];

  // =========================
  // next-intl
  // =========================
  const intlResponse = intlMiddleware(request);

  // أي صفحة مش تبع الشركة
  if (!pathname.startsWith(`/${locale}/company`)) {
    return intlResponse;
  }

  // =========================
  // Supabase response
  // =========================
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // =========================
  // Check logged-in user
  // =========================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("PROXY:", pathname, "USER:", user?.email ?? "NO USER");

  // =========================
  // Login page
  // =========================
  const isLoginPage = pathname === `/${locale}/company/login`;

  if (isLoginPage) {
    // لو already logged in
    if (user) {
      return NextResponse.redirect(
        new URL(`/${locale}/company/dashboard`, request.url),
      );
    }

    return response;
  }

  // =========================
  // Protected company pages
  // =========================
  if (!user) {
    return NextResponse.redirect(
      new URL(`/${locale}/company/login`, request.url),
    );
  }

  // =========================
  // Allow company page
  // =========================
  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
