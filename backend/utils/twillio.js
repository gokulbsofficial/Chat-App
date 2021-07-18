const { twilio } = require("../config/default");
const client = require("twilio")(twilio.accountSid, twilio.authToken);

const setErrorMessage = (message, code) => {
  let error = { message };

  if (code === 11000) {
    error.message = `Duplicate field value entered`;
  }

  if (code === "EAI_AGAIN") {
    error.message = `Check your Internet Connection`;
  }

  if (code === 20404) {
    error.message = `OTP request not found, Try again!!`;
  }
  console.log(error);
  return error;
};

module.exports = {
  sentOtp: (mobile, channel) => {
    return new Promise((resolve, reject) => {
      client.verify
        .services(twilio.servicesId)
        .verifications.create({
          to: `+${mobile}`,
          channel: `${channel || "sms"}`,
        })
        .then(async (verification) => {
          resolve({ data: { sid: verification.sid, mobile } });
        })
        .catch((error) => {
          console.log(error.message);
          console.log(error.code);
          let { message } = setErrorMessage(error.message, error.code);
          reject({ msg: `${message}` });
        });
    });
  },
  verifyOtp: (mobile, code) => {
    return new Promise((resolve, reject) => {
      client.verify
        .services(twilio.servicesId)
        .verificationChecks.create({ to: `+${mobile}`, code: code })
        .then(async (verification_check) => {
          if (verification_check.valid) {
            resolve({ mobile });
          } else {
            reject({
              msg: `Please provide an mobile and OTP code`,
            });
          }
        })
        .catch(async (error) => {
          console.log(error.message);
          console.log(error.code);
          let { message } = await setErrorMessage(error.message, error.code);
          reject({
            msg: `${message}`,
          });
        });
    });
  },
};
