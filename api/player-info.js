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
    console.error("GAMESKINBO_API_KEY is missing.");

    return res.status(500).json({
      success: false,
      message: "API key is missing. Check Vercel Environment Variables."
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

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Gameskinbo returned a non-JSON response. HTTP:",
        response.status
      );

      return res.status(502).json({
        success: false,
        message: "The player API returned an invalid response."
      });
    }

    if (!response.ok) {
      console.error(
        "Gameskinbo API error. HTTP:",
        response.status
      );

      return res.status(502).json({
        success: false,
        message:
          response.status === 401 || response.status === 403
            ? "API authentication failed. Check your API key and account access."
            : response.status === 429
            ? "API request limit reached. Check your Gameskinbo usage."
            : "Gameskinbo could not retrieve player information."
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error(
      "Player API request failed:",
      error.name || "UnknownError"
    );

    return res.status(502).json({
      success: false,
      message:
        error.name === "TimeoutError"
          ? "The player API request timed out. Please try again."
          : "Unable to connect to the player API. Please try again later."
    });
  }
}
