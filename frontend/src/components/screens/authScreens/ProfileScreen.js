import { Fragment } from "react";
import { Form, Button, ButtonGroup } from "react-bootstrap";
import Loader from '../../Loader'
import Message from '../../Message'
import { useDispatch, useSelector } from 'react-redux'
import { loginProfile } from '../../../actions/authAction'

const ProfileScreen = (props) => {
    const { value, handleChange } = props

    const { authInfo } = useSelector(state => state)
    const { loading, error } = authInfo
    const dispatch = useDispatch()

    const Continue = async (e) => {
        e.preventDefault();
        let data = {
            name: value.name, userName: value.userName, mobile: value.mobile
        }
        if (value.profilePic) {
            data.profilePic = value.profilePic
        }
        dispatch(loginProfile(data))
    }
    return (
        <Fragment>
            { loading ? (<Loader />) :
                (<div className="login-container d-flex align-items-center justify-content-center">
                    <Form className="login-form text-center">
                        {error && (<Message variant="danger">{error.message}</Message>)}

                        <h2 className="mb-4 font-weight-normal "> <strong>Profile</strong></h2>

                        <div className="profile-pic">
                            <img src="./images/user.png" className=" rounded img-fluid" id="profilePic" alt="Profile"
                                style={{ "width": "160px", "height": "160px" }} />
                        </div>

                        <ButtonGroup aria-label="Basic example" className="mb-4 mt-4">
                            <Button variant="danger">Delete</Button>
                            <Button variant="info">
                                <span className="btn-info btn-file">Upload
                                <input type="file" name="profilePic" />
                                </span>
                            </Button>
                        </ButtonGroup>

                        <Form.Group controlId="formBasicName">
                            <Form.Control name="name" type="text" placeholder="Name" onChange={(e) => handleChange(e.target.name, e.target.value)} value={value.name} />
                        </Form.Group>

                        <Form.Group controlId="formBasicUsername">
                            <Form.Control name="userName" type="text" placeholder="Username" onChange={(e) => handleChange(e.target.name, e.target.value)} value={value.userName} />
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
    );
}
export default ProfileScreen