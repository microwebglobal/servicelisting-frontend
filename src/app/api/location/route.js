import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const params = req.nextUrl.searchParams;
    const latitude = params.get("latitude");
    const longitude = params.get("longitude");

    if (!latitude || !longitude) {
      return new NextResponse("Latitude and Longitude are required", {
        status: 400,
      });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    const data = await res.json();

    if (data.status !== "OK") {
      return new NextResponse("Failed to get location data", { status: 500 });
    }

    const addressComponent = data.results[0]?.address_components.find((comp) =>
      comp.types.includes("locality")
    );
    const city = addressComponent?.long_name || "Unknown";

    return new NextResponse(JSON.stringify({ city }), { status: 200 });
  } catch (error) {
    console.error("Error in geolocation API:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
