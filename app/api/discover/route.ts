import { NextResponse } from "next/server";

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  types?: string[];
};

type GoogleSearchResponse = {
  places?: GooglePlace[];
  nextPageToken?: string;
};

type HunterEmail = {
  value?: string;
  type?: string;
  confidence?: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  department?: string;
};

function getDomain(url?: string) {
  if (!url) return null;

  try {
    return new URL(url).hostname
      .replace(/^www\./, "")
      .toLowerCase();
  } catch {
    return null;
  }
}

function extractSearchCategories(customer: string) {
  const cleaned = customer
    .replace(/\.$/, "")
    .trim();

  const parts = cleaned
    .split(/,| and | or |;|\n/i)
    .map((part) => part.trim())
    .filter(Boolean);

  const cleanedParts = parts
    .map((part) =>
      part
        .replace(
          /^(companies|businesses|companies that|businesses that|people|organizations|organisations)\s+(that\s+)?(need|want|use|require)?\s*/i,
          "",
        )
        .trim(),
    )
    .filter((part) => part.length > 2);

  return cleanedParts.slice(0, 6);
}

/*
 * Expands common customer descriptions into
 * additional Google search categories.
 *
 * Example:
 *
 * "hotels"
 *
 * becomes:
 * - hotels
 * - spa hotels
 * - resorts
 * - accommodation
 */
function expandCategory(category: string) {
  const lower = category.toLowerCase();

  const variations = new Set<string>();

  variations.add(category);

  if (
    lower.includes("hotel") ||
    lower.includes("spa") ||
    lower.includes("resort")
  ) {
    variations.add("hotels");
    variations.add("spa hotels");
    variations.add("resorts");
    variations.add("boutique hotels");
    variations.add("accommodation");
    variations.add("hotel restaurants");
  }

  if (
    lower.includes("restaurant") ||
    lower.includes("food") ||
    lower.includes("cafe") ||
    lower.includes("café")
  ) {
    variations.add("restaurants");
    variations.add("cafes");
    variations.add("bars");
    variations.add("bistros");
    variations.add("fine dining restaurants");
  }

  if (
    lower.includes("real estate") ||
    lower.includes("property") ||
    lower.includes("estate agent") ||
    lower.includes("realty")
  ) {
    variations.add("real estate agencies");
    variations.add("real estate companies");
    variations.add("property agencies");
    variations.add("real estate developers");
    variations.add("property developers");
    variations.add("real estate brokers");
  }

  if (
    lower.includes("construction") ||
    lower.includes("builder") ||
    lower.includes("building")
  ) {
    variations.add("construction companies");
    variations.add("building companies");
    variations.add("contractors");
    variations.add("property developers");
  }

  if (
    lower.includes("gym") ||
    lower.includes("fitness") ||
    lower.includes("sport")
  ) {
    variations.add("gyms");
    variations.add("fitness centers");
    variations.add("sports clubs");
    variations.add("fitness studios");
  }

  if (
    lower.includes("retail") ||
    lower.includes("shop") ||
    lower.includes("store")
  ) {
    variations.add("shops");
    variations.add("retail stores");
    variations.add("stores");
    variations.add("shopping centers");
  }

  if (
    lower.includes("beauty") ||
    lower.includes("salon") ||
    lower.includes("hair")
  ) {
    variations.add("beauty salons");
    variations.add("hair salons");
    variations.add("barbers");
    variations.add("beauty clinics");
  }

  if (
    lower.includes("car") ||
    lower.includes("auto") ||
    lower.includes("automotive")
  ) {
    variations.add("car dealerships");
    variations.add("auto repair shops");
    variations.add("automotive companies");
    variations.add("car rental companies");
  }

  if (
    lower.includes("marketing") ||
    lower.includes("advertising")
  ) {
    variations.add("marketing agencies");
    variations.add("advertising agencies");
    variations.add("creative agencies");
    variations.add("digital agencies");
  }

  return Array.from(variations).slice(0, 7);
}

async function searchGoogle(
  query: string,
  location: string,
) {
  const apiKey =
    process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is missing.",
    );
  }

  const results: GooglePlace[] = [];

  let pageToken: string | undefined =
    undefined;

  /*
   * Google Places allows pagination.
   *
   * We retrieve up to 3 pages for every
   * search category.
   */
  for (
    let page = 0;
    page < 3;
    page++
  ) {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.internationalPhoneNumber,places.types,nextPageToken",
        },
        body: JSON.stringify({
          textQuery: `${query} in ${location}`,
          pageSize: 20,
          ...(pageToken
            ? {
                pageToken,
              }
            : {}),
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Google Places error ${response.status}: ${errorText}`,
      );
    }

    const data =
      (await response.json()) as GoogleSearchResponse;

    if (data.places) {
      results.push(...data.places);
    }

    if (!data.nextPageToken) {
      break;
    }

    pageToken = data.nextPageToken;

    /*
     * Small delay before requesting the
     * next Google page.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 300),
    );
  }

  return results;
}

async function searchHunter(
  domain: string,
) {
  const apiKey =
    process.env.HUNTER_API_KEY;

  if (!apiKey) {
    return [];
  }

  const url = new URL(
    "https://api.hunter.io/v2/domain-search",
  );

  url.searchParams.set(
    "domain",
    domain,
  );

  url.searchParams.set(
    "api_key",
    apiKey,
  );

  url.searchParams.set(
    "limit",
    "10",
  );

  const response = await fetch(
    url.toString(),
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  const data =
    await response.json();

  return (data.data?.emails ||
    []) as HunterEmail[];
}

function chooseBestContact(
  emails: HunterEmail[],
) {
  if (emails.length === 0) {
    return null;
  }

  const priorityWords = [
    "owner",
    "founder",
    "ceo",
    "director",
    "marketing",
    "manager",
    "sales",
    "commercial",
    "business development",
  ];

  const sorted = [...emails].sort(
    (a, b) => {
      const aText =
        `${a.position || ""} ${
          a.department || ""
        }`.toLowerCase();

      const bText =
        `${b.position || ""} ${
          b.department || ""
        }`.toLowerCase();

      const aPriority =
        priorityWords.some((word) =>
          aText.includes(word),
        )
          ? 1
          : 0;

      const bPriority =
        priorityWords.some((word) =>
          bText.includes(word),
        )
          ? 1
          : 0;

      if (
        aPriority !== bPriority
      ) {
        return (
          bPriority - aPriority
        );
      }

      return (
        (b.confidence || 0) -
        (a.confidence || 0)
      );
    },
  );

  return sorted[0];
}

function deduplicatePlaces(
  places: GooglePlace[],
) {
  const seen = new Set<string>();

  const unique: GooglePlace[] =
    [];

  for (const place of places) {
    const key =
      place.id ||
      place.websiteUri ||
      place.displayName?.text;

    if (!key) {
      continue;
    }

    const normalizedKey =
      key.toLowerCase();

    if (
      seen.has(normalizedKey)
    ) {
      continue;
    }

    seen.add(normalizedKey);

    unique.push(place);
  }

  return unique;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const offer =
      String(
        body.offer || "",
      ).trim();

    const location =
      String(
        body.location || "",
      ).trim();

    const customer =
      String(
        body.customer || "",
      ).trim();

    if (!offer || !location) {
      return NextResponse.json(
        {
          error:
            "Offer and location are required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * -----------------------------------------
     * 1. Understand who the customer is
     * -----------------------------------------
     */

    const categories =
      extractSearchCategories(
        customer,
      );

    const fallbackCategories = [
      "companies",
      "businesses",
      "local businesses",
    ];

    const baseCategories =
      categories.length > 0
        ? categories
        : fallbackCategories;

    /*
     * -----------------------------------------
     * 2. Expand the customer categories
     * -----------------------------------------
     */

    const expandedCategories =
      new Set<string>();

    for (const category of baseCategories) {
      const variations =
        expandCategory(category);

      for (const variation of variations) {
        expandedCategories.add(
          variation,
        );
      }
    }

    const searchCategories =
      Array.from(
        expandedCategories,
      ).slice(0, 18);

    console.log(
      "PAKUX SEARCH CATEGORIES:",
      searchCategories,
    );

    /*
     * -----------------------------------------
     * 3. Search Google Places
     * -----------------------------------------
     */

    const allPlaces: GooglePlace[] =
      [];

    for (const category of searchCategories) {
      try {
        const places =
          await searchGoogle(
            category,
            location,
          );

        allPlaces.push(...places);
      } catch (error) {
        console.error(
          `Google search failed for "${category}":`,
          error,
        );
      }
    }

    /*
     * -----------------------------------------
     * 4. Deduplicate
     * -----------------------------------------
     */

    const places =
      deduplicatePlaces(
        allPlaces,
      ).slice(0, 100);

    console.log(
      `PAKUX FOUND ${places.length} UNIQUE PLACES`,
    );

    /*
     * -----------------------------------------
     * 5. Find contacts
     * -----------------------------------------
     *
     * Hunter can be expensive/slow if we query
     * hundreds of domains, so we limit this to
     * the first 60 companies.
     */

    const contactSearchPlaces =
      places.slice(0, 60);

    const results = [];

    /*
     * Run Hunter searches in small batches
     * rather than everything simultaneously.
     */

    const batchSize = 8;

    for (
      let i = 0;
      i <
      contactSearchPlaces.length;
      i += batchSize
    ) {
      const batch =
        contactSearchPlaces.slice(
          i,
          i + batchSize,
        );

      const batchResults =
        await Promise.all(
          batch.map(
            async (place) => {
              const company =
                place.displayName?.text ||
                "Unknown company";

              const domain =
                getDomain(
                  place.websiteUri,
                );

              let emails: HunterEmail[] =
                [];

              if (domain) {
                emails =
                  await searchHunter(
                    domain,
                  );
              }

              const contact =
                chooseBestContact(
                  emails,
                );

              return {
                company,

                address:
                  place.formattedAddress ||
                  "",

                website:
                  place.websiteUri ||
                  null,

                domain,

                phone:
                  place.internationalPhoneNumber ||
                  place.nationalPhoneNumber ||
                  null,

                types:
                  place.types || [],

                contact: contact
                  ? {
                      name: [
                        contact.first_name,
                        contact.last_name,
                      ]
                        .filter(Boolean)
                        .join(" "),

                      email:
                        contact.value ||
                        null,

                      position:
                        contact.position ||
                        contact.department ||
                        null,

                      confidence:
                        contact.confidence ||
                        null,
                    }
                  : null,
              };
            },
          ),
        );

      results.push(...batchResults);
    }

    /*
     * -----------------------------------------
     * 6. Put companies with contacts first
     * -----------------------------------------
     */

    results.sort((a, b) => {
      const aHasContact =
        a.contact?.email ? 1 : 0;

      const bHasContact =
        b.contact?.email ? 1 : 0;

      return (
        bHasContact -
        aHasContact
      );
    });

    return NextResponse.json({
      success: true,

      offer,

      customer,

      location,

      categories:
        searchCategories,

      count: results.length,

      results,
    });
  } catch (error) {
    console.error(
      "DISCOVER API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Discovery failed.",
      },
      {
        status: 500,
      },
    );
  }
}