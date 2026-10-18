// Mindora API response helpers.
// Keep responses consistent across all backend endpoints.
export function sendSuccess(res, data = {}, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

export function sendError(res, status, message, code = "REQUEST_ERROR") {
  return res.status(status).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

export function allowMethods(req, res, allowedMethods) {
  res.setHeader("Allow", allowedMethods.join(", "));
  if (!allowedMethods.includes(req.method)) {
    sendError(res, 405, "Method not allowed.", "METHOD_NOT_ALLOWED");
    return false;
  }
  return true;
}
