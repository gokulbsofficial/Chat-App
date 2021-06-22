import { Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import OtpInput from "react-otp-input";
import { useSelector, useDispatch } from "react-redux";
import { verifyOtp,sentOtp,mobilePage } from "../../actions/authAction";


const VerifyOtpScreen = (props) => {

    const { value, handleChange } = props

    const {authInfo} = useSelector(state => state)
    const { loading, error } = authInfo
    const dispatch = useDispatch()

    const confirmOTP = (e) => {
        e.preventDefault();
        dispatch(verifyOtp(value.mobile, value.otp))
    }
    const Back = (e) => {
        e.preventDefault();
        handleChange("otp", "")
        dispatch(mobilePage())
    }
    const resetOtp = e =>{
        e.preventDefault();
        dispatch(sentOtp(value.mobile,"sms"))
    }

    return (
        <Fragment>
            { loading ? (<Loader />) :
                (<div className="login-container d-flex align-items-center justify-content-center">
                    <Form className="login-form text-center">
                        {error && (<Message variant="danger">{error.message}</Message>)}
                        <h2 className="mb-3 font-weight-normal ">
                            <strong>+{value.mobile}</strong>
                        </h2>
                        <div className="mb-4 font-weight-light ">
                            <p>
                                We've sent an verify code to your phone <br />Please enter it below. <span onClick={Back}>Wrong number?</span>
                            </p>
                        </div>
                        <div className="margin-top--small">
                            <OtpInput
                                inputStyle="inputStyle"
                                value={value.otp}
                                onChange={otp => handleChange("otp", otp)}
                                numInputs={6}
                                isInputNum="true"
                            />
                        </div>
                        <div className="pt-2">
                            <p className="call-otp font-weight-normal text-left">We will call you in {60}  sec  </p><p onClick={resetOtp} className="font-weight-normal text-right">Re-sent</p>
                        </div>
                        <Button
                            type="submit" onClick={confirmOTP}
                            className="btn btn-custom btn-primary btn-block text-uppercase rounded-pill btn-lg"
                        >NEXT</Button>
                    </Form>
                </div>)
            }
        </Fragment>
    );
}
export default VerifyOtpScreen