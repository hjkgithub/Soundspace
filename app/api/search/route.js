
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term")?.trim();

  if (!term) {
    return Response.json({ results: [] });
  }

  try {
    const url = new URL(
      "https://itunes.apple.com/search"
    );

    url.searchParams.set("term", term);
    url.searchParams.set("entity", "song");
    url.searchParams.set("limit", "50");
    url.searchParams.set("country", "in");

    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return Response.json(
        { error: "Music search is temporarily unavailable." },
        { status: 502 }
      );
    }

    const data = await response.json();

    return Response.json(
      { results: data.results || [] },
      {
        headers: {
          "Cache-Control":
            "s-maxage=3600, stale-while-revalidate=86400"
        }
      }
    );
  } catch {
    return Response.json(
      { error: "Unable to connect to the music service." },
      { status: 502 }
    );
  }
}

