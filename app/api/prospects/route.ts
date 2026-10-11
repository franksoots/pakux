import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

async function getWorkspaceId() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      workspaceId: null,
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (error || !profile?.workspace_id) {
    return {
      supabase,
      user,
      workspaceId: null,
    };
  }

  return {
    supabase,
    user,
    workspaceId: profile.workspace_id,
  };
}

export async function GET(request: NextRequest) {
  const { supabase, user, workspaceId } =
    await getWorkspaceId();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 400 },
    );
  }

  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get("search")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const limit = Math.min(
    Number(searchParams.get("limit")) || 100,
    200,
  );

  let query = supabase
    .from("prospects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (search) {
    query = query.or(
      [
        `company_name.ilike.%${search}%`,
        `website.ilike.%${search}%`,
        `industry.ilike.%${search}%`,
        `location.ilike.%${search}%`,
        `contact_name.ilike.%${search}%`,
        `contact_email.ilike.%${search}%`,
      ].join(","),
    );
  }

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("GET /api/prospects", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    prospects: data || [],
  });
}

export async function POST(request: NextRequest) {
  const { supabase, user, workspaceId } =
    await getWorkspaceId();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const companyName =
      body.company_name?.trim();

    if (!companyName) {
      return NextResponse.json(
        {
          error: "Company name is required",
        },
        { status: 400 },
      );
    }

    const prospect = {
      workspace_id: workspaceId,
      company_name: companyName,
      website:
        body.website?.trim() || null,
      industry:
        body.industry?.trim() || null,
      location:
        body.location?.trim() || null,
      contact_name:
        body.contact_name?.trim() || null,
      contact_email:
        body.contact_email?.trim() || null,
      contact_role:
        body.contact_role?.trim() || null,
      contact_phone:
        body.contact_phone?.trim() || null,
      fit_score:
        typeof body.fit_score === "number"
          ? body.fit_score
          : null,
      fit_reason:
        body.fit_reason?.trim() || null,
      source:
        body.source?.trim() || "manual",
      status:
        body.status?.trim() || "new",
    };

    const { data, error } = await supabase
      .from("prospects")
      .insert(prospect)
      .select()
      .single();

    if (error) {
      console.error("POST /api/prospects", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        prospect: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const { supabase, user, workspaceId } =
    await getWorkspaceId();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const id = body.id?.trim();

    if (!id) {
      return NextResponse.json(
        {
          error: "Prospect id is required",
        },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};

    const fields = [
      "company_name",
      "website",
      "industry",
      "location",
      "contact_name",
      "contact_email",
      "contact_role",
      "contact_phone",
      "fit_reason",
      "source",
      "status",
    ];

    for (const field of fields) {
      if (field in body) {
        updates[field] =
          typeof body[field] === "string"
            ? body[field].trim()
            : body[field];
      }
    }

    if ("fit_score" in body) {
      updates.fit_score = body.fit_score;
    }

    updates.updated_at =
      new Date().toISOString();

    const { data, error } = await supabase
      .from("prospects")
      .update(updates)
      .eq("id", id)
      .eq("workspace_id", workspaceId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      prospect: data,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { supabase, user, workspaceId } =
    await getWorkspaceId();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace not found" },
      { status: 400 },
    );
  }

  const id =
    request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      {
        error: "Prospect id is required",
      },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("prospects")
    .delete()
    .eq("id", id)
    .eq("workspace_id", workspaceId);

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}