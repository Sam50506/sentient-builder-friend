export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed — but API route is finally working ✅",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Next.js API backend live!",
  });
}
