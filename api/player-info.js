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
    "PK", "BD", "IND", "BR", "US", "SAC",
    "NA", "TH", "ID", "SG"
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

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "Player information API key is not configured."
    });
  }

  try {
    const url = new URL(
      "https://api.gameskinbo.com/ff-info/get"
    );

    url.searchParams.set("uid", uid);
    url.searchParams.set("region", region);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": apiKey
      },
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          data.error || "Unable to retrieve player information."
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Player information service is temporarily unavailable."
    });
  }
}
