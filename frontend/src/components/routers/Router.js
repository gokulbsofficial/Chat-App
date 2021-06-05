import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import StepForm from "../StepForm";
// import PrivateRouter from "./PrivateRouter";
import HomeScreen from "../screens/userScreens/HomeScreen";
import ResetCloudPasswdScreen from "../screens/authScreens/ResetCloudPasswdScreen";
import AdminPanel from "../screens/adminScreens/AdminPanel";

const Routers = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <HomeScreen />
                </Route>
                <Route path="/admin" exact>
                    <AdminPanel />
                </Route>
                <Route path="/login" exact>
                    <StepForm />
                </Route>
                <Route path="/forget-cloud-passwd/:token" >
                    <ResetCloudPasswdScreen />
                </Route>
                <Route path="*">
                    <h1>Not Found</h1>
                </Route>
            </Switch>
        </Router>
    );
};

export default Routers;