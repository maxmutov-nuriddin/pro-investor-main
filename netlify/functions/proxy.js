import fetch from "node-fetch";

export async function handler(event) {
  try {
    const url = "https://pro-investor-2.onrender.com" + event.path.replace("/.netlify/functions/proxy", "");

    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        "Content-Type": "application/json",
        ...event.headers,
      },
      body: ["POST", "PUT", "PATCH"].includes(event.httpMethod) ? event.body : undefined,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      body: data,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Proxy error", details: error.message }),
    };
  }
}
