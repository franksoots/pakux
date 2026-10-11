import {
  type EmailOtpType,
} from "@supabase/supabase-js";

import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "../../../lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
  const requestUrl =
    new URL(request.url);

  const code =
    requestUrl.searchParams.get(
      "code",
    );

  const tokenHash =
    requestUrl.searchParams.get(
      "token_hash",
    );

  const type =
    requestUrl.searchParams.get(
      "type",
    ) as EmailOtpType | null;

  const next =
    requestUrl.searchParams.get(
      "next",
    ) || "/dashboard";

  const supabase =
    await createClient();

  /*
   * Token-hash confirmation
   */
  if (
    tokenHash &&
    type
  ) {
    const {
      error,
    } =
      await supabase.auth.verifyOtp(
        {
          type,
          token_hash:
            tokenHash,
        },
      );

    if (!error) {
      return NextResponse.redirect(
        new URL(
          next,
          requestUrl.origin,
        ),
      );
    }
  }

  /*
   * PKCE confirmation
   */
  if (code) {
    const {
      error,
    } =
      await supabase.auth.exchangeCodeForSession(
        code,
      );

    if (!error) {
      return NextResponse.redirect(
        new URL(
          next,
          requestUrl.origin,
        ),
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/login?error=confirmation_failed",
      requestUrl.origin,
    ),
  );
}