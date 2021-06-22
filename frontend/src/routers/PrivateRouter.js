import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRouter = ({ children, ...rest }) => {
  const { token } = useSelector((store) => store.authInfo);

  const isLogin = token;

  return (
    <Route
      {...rest}
      render={() => (isLogin ? children : <Redirect to="/login" />)}
    />
  );
};
export default PrivateRouter;
