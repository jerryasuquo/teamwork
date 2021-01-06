class Handler {
  success = (code, message, payload, response) =>
    response.status(code).json({
      status: code,
      message,
      data: payload,
    });

  error = (code, message, response) =>
    response.status(code).json({
      status: code,
      error: message,
    });
}

export default new Handler();
