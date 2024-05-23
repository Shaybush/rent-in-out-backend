const { config } = require("../../config/config");
const axios = require("axios");

const apiUrl = config.google_api;

exports.getUserDetailFromAccessToken = (access_token) => {
  return axios.get(
    `${apiUrl}/oauth2/v1/userinfo?access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    }
  );
};
