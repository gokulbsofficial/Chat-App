import { useDispatch } from "react-redux";
import { logout } from "../../../actions/authAction";

const HomeScreen = () => {
    const dispatch = useDispatch()
    return (
        <div>
            <h1>Welcome to Home Page</h1>
            <button onClick={(e)=>{
                e.preventDefault()
                dispatch(logout())
            }}>LOGOUT</button>
        </div>
    )
}

export default HomeScreen