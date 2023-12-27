const formatResponse = (req, res, next) => {
  res.apiSuccess = (data, accessToken, respCode) => {
    const response = {
      status: true,
      content: {
        data,
        meta: {
          access_token: accessToken,
        },
      },
    };
    res.status(respCode).json(response);
  };

  res.apiError = (error, errCode) => {
    const response = {
      status: false,
      errors: Array.isArray(error) ? error : [error],
    };
    res.status(errCode).json(response);
  };

  next();
};

module.exports = formatResponse;
