import { Fragment, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom'
import Loader from '../../Loader'
import Message from '../../Message'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from "../../../actions/authAction";

export const ResetPasswordScreen = (props) => {

    const { token } = useParams()

    const [value, setValue] = useState({
        newPassword: "",
        confirmNewPassword: "",
        resetToken: `${token}`
    })

    const { authInfo } = useSelector(state => state)
    const { loading, error } = authInfo
    const dispatch = useDispatch()

    const handleChange = (input, value) => {
        setValue({ ...value, [input]: value })
    }

    const Continue = async (e) => {
        e.preventDefault();
        if (value.newPassword !== value.confirmNewPassword) {
            dispatch(resetPassword(value.resetToken, value.newPassword))
        }
    }
    return (
        <Fragment>
            { loading ? (<Loader />) :
                (<div className="login-container d-flex align-items-center justify-content-center">
                    <Form className="login-form text-center">
                        {error && (<Message variant="danger">{error.message}</Message>)}

                        <h2 className="mb-5 font-weight-normal "> <strong>Reset Cloud Password</strong></h2>

                        <Form.Group controlId="newPassword" className="mt-2 mb-3">
                            <Form.Control name="newPassword" type="password" placeholder="New Password" onChange={(e) => handleChange(e.target.name, e.target.value)} value={value.newPassword} />
                        </Form.Group>


                        <Form.Group controlId="confirmNewPassword" className="mt-2 mb-3">
                            <Form.Control name="confirmNewPassword" type="password" placeholder="Confirm Password" onChange={(e) => handleChange(e.target.name, e.target.value)} value={value.confirmNewPassword} />
                        </Form.Group>

                        <Button
                            type="submit"
                            onClick={Continue}
                            className="btn mt-5 btn-custom btn-primary btn-block text-uppercase rounded-pill btn-lg"
                        >NEXT</Button>
                    </Form>
                </div>)
            }
        </Fragment>
    )
}

export default ResetPasswordScreen