const formatResponse = (req, res, next) => {
  res.apiSuccess = (data, meta, respCode = 200, accessToken = null) => {
    let response = {
      status: true,
      content: {
        data,
      },
    };
    if (meta !== null) response.content.meta = meta;

    res.status(respCode).json(response);
  };

  res.apiError = (error, errCode = 500) => {
    const response = {
      status: false,
      errors: Array.isArray(error) ? error : [error],
    };
    res.status(errCode).json(response);
  };

  next();
};

module.exports = formatResponse;
