import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", user.id)
        .single();

    if (profileError || !profile?.workspace_id) {
      console.error(
        "Workspace lookup failed:",
        profileError,
      );

      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const prospects = Array.isArray(body.prospects)
      ? body.prospects
      : [];

    console.log(
      `Saving ${prospects.length} prospects...`,
    );

    let saved = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const prospect of prospects) {
      const companyName =
        prospect.company?.trim();

      if (!companyName) continue;

      const { data: existing, error: lookupError } =
        await supabase
          .from("prospects")
          .select("id")
          .eq(
            "workspace_id",
            profile.workspace_id,
          )
          .eq("company_name", companyName)
          .maybeSingle();

      if (lookupError) {
        console.error(
          "Prospect lookup error:",
          lookupError,
        );

        errors.push(
          `${companyName}: ${lookupError.message}`,
        );

        continue;
      }

      const prospectData = {
        workspace_id:
          profile.workspace_id,

        company_name:
          companyName,

        website:
          prospect.website || null,

        industry:
          Array.isArray(prospect.types)
            ? prospect.types.join(", ")
            : null,

        location:
          prospect.address || null,

        contact_name:
          prospect.contact?.name || null,

        contact_email:
          prospect.contact?.email || null,

        contact_role:
          prospect.contact?.position ||
          prospect.recommended_contact_role ||
          null,

        contact_phone:
          prospect.phone || null,

        fit_score:
          typeof prospect.fit_score === "number"
            ? prospect.fit_score
            : null,

        fit_reason:
          prospect.fit_reason || null,

        source: "ai-discovery",

        status: "new",
      };

      if (existing?.id) {
        const { error } = await supabase
          .from("prospects")
          .update(prospectData)
          .eq("id", existing.id)
          .eq(
            "workspace_id",
            profile.workspace_id,
          );

        if (error) {
          console.error(
            `Update failed for ${companyName}:`,
            error,
          );

          errors.push(
            `${companyName}: ${error.message}`,
          );

          continue;
        }

        updated++;
      } else {
        const { error } = await supabase
          .from("prospects")
          .insert(prospectData);

        if (error) {
          console.error(
            `Insert failed for ${companyName}:`,
            error,
          );

          errors.push(
            `${companyName}: ${error.message}`,
          );

          continue;
        }

        saved++;
      }
    }

    console.log(
      `Prospects complete: ${saved} saved, ${updated} updated`,
    );

    if (errors.length > 0) {
      console.error(
        "PROSPECT SAVE ERRORS:",
        errors,
      );
    }

    return NextResponse.json({
      success: errors.length === 0,
      saved,
      updated,
      total: saved + updated,
      errors,
    });
  } catch (error) {
    console.error(
      "SAVE PROSPECTS FATAL ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save prospects",
      },
      { status: 500 },
    );
  }
}
