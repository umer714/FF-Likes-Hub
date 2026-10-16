   export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const uid = String(req.query.uid || "").trim();
  const region = String(req.query.region || "PK")
    .trim()
    .toUpperCase();

  const allowedRegions = [
    "PK", "BD", "IND", "BR", "US",
    "SAC", "NA", "TH", "ID", "SG"
  ];

  if (!/^\d{5,15}$/.test(uid)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid player UID."
    });
  }

  if (!allowedRegions.includes(region)) {
    return res.status(400).json({
      success: false,
      message: "Invalid region."
    });
  }

  const apiKey = process.env.GAMESKINBO_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    console.error("DIAGNOSTIC: API key is missing.");

    return res.status(500).json({
      success: false,
      message: "API key is not configured."
    });
  }

  try {
    const url = new URL(
      "https://api.gameskinbo.com/ff-info/get"
    );

    url.searchParams.set("uid", uid);
    url.searchParams.set("region", region);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": apiKey.trim(),
        "Accept": "application/json"
      },
      signal: AbortSignal.timeout(20000)
    });

    const contentType =
      response.headers.get("content-type") || "unknown";

    const body = await response.text();

    let data;

    try {
      data = JSON.parse(body);
    } catch {
      console.error("DIAGNOSTIC: Invalid JSON from Gameskinbo", {
        status: response.status,
        contentType: contentType,
        bodyPreview: body.slice(0, 300)
      });

      return res.status(502).json({
        success: false,
        message: "Gameskinbo returned a non-JSON response.",
        upstreamStatus: response.status,
        upstreamContentType: contentType
      });
    }

    if (!response.ok) {
      console.error("DIAGNOSTIC: Gameskinbo API error", {
        status: response.status,
        contentType: contentType
      });

      return res.status(502).json({
        success: false,
        message:
          response.status === 401 ||
          response.status === 403
            ? "API authentication failed. Check your API key."
            : response.status === 429
            ? "API usage limit reached."
            : "Gameskinbo could not retrieve player information.",
        upstreamStatus: response.status
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("DIAGNOSTIC: Player API request failed", {
      name: error.name || "UnknownError",
      message: error.message || "No error message"
    });

    return res.status(502).json({
      success: false,
      message:
        error.name === "TimeoutError"
          ? "Gameskinbo API request timed out."
          : "Unable to connect to Gameskinbo API."
    });
  }
}     
