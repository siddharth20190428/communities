const formatResponse = (req, res, next) => {
  res.apiSuccess = (data, respCode, accessToken = null) => {
    let response = {
      status: true,
      content: {
        data,
      },
    };

    if (accessToken !== null)
      response.content.meta = { access_token: accessToken };

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
