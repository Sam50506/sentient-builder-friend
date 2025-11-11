export const config = {
  runtime: "edge",
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed (Edge function live ✅)" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ message: "Edge backend working perfectly 🎉" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
