import { Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from "../../Loader";
import Message from "../../Message";
import { sentOtp } from "../../../actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import "../style";

const MobileScreen = (props) => {
  const { value, handleChange } = props;

  const { authInfo, globalError } = useSelector((state) => state);
  const { loading } = authInfo;
  const { message, id } = globalError;
  const dispatch = useDispatch();

  const Continue = async (e) => {
    e.preventDefault();
    dispatch(sentOtp(value.mobile, "sms"));
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="login-container d-flex align-items-center justify-content-center">
          <Form className="login-form text-center">
            {message && (
              <Message variant="danger" id={id}>
                {message}
              </Message>
            )}
            <h2 className="mb-3 font-weight-normal ">
              <strong>Your Phone Number</strong>
            </h2>
            <p className="mb-4 font-weight-light">
              Please confirm your country code and <br />
              enter your mobile phone number
            </p>
            <PhoneInput
              inputProps={{
                name: "mobile",
                required: true,
                autoFocus: true,
              }}
              placeholder="Select your country and mobile number"
              country={"in"}
              value={value.mobile}
              className="form-control rounded-pill form-control-lg mobile_number"
              onChange={(mobile) => handleChange("mobile", mobile)}
            />
            <Button
              type="submit"
              onClick={Continue}
              className="btn mt-5 btn-custom btn-primary btn-block text-uppercase rounded-pill btn-lg"
            >
              NEXT
            </Button>
            <p className="mt-3 font-weight-normal">
              Quick log in using QR code
            </p>
          </Form>
        </div>
      )}
    </Fragment>
  );
};
export default MobileScreen;
