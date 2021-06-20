import { Fragment } from "react";
import { Form, Button } from "react-bootstrap";
import Loader from '../../Loader'
import Message from '../../Message'
import { useDispatch, useSelector } from 'react-redux'
import { cloudPassword } from "../../../actions/authAction";

const CloudPasswordScreen = (props) => {
    const { value, handleChange } = props

    const { authInfo } = useSelector(state => state)
    const { loading, error } = authInfo
    const dispatch = useDispatch()

    const Continue = async (e) => {
        e.preventDefault();
        dispatch(cloudPassword(value.mobile, value.password))
    }
    return (
        <Fragment>
            { loading ? (<Loader />) :
                (<div className="login-container d-flex align-items-center justify-content-center">
                    <Form className="login-form text-center">
                        {error && (<Message variant="danger">{error.message}</Message>)}

                        <h2 className="mb-5 font-weight-normal "> <strong>Cloud Password</strong></h2>

                        <Form.Group controlId="formBasicPassword" className="mt-2 mb-3">
                            <Form.Control name="password" type="password" placeholder="Cloud Password" onChange={(e) => handleChange(e.target.name, e.target.value)} value={value.password} />
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
export default CloudPasswordScreen