import { Route, Redirect } from "react-router-dom"
import {useSelector} from 'react-redux'

const PrivateRouter = ({ children, ...rest }) => {
    const {isLogin} = useSelector(store=>store.authInfo)

    return (
        <Route
            {...rest}
            render={() => (isLogin ?  children : <Redirect to="/login" />)}
        />
    )
};
export default PrivateRouter;
