import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import StepForm from "../StepForm";
import PrivateRouter from "./PrivateRouter";
import HomeScreen from "../screens/authScreens/HomeScreen";
import ResetCloudPasswdScreen from "../screens/authScreens/ResetCloudPasswdScreen";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";

const Routers = () => {
    return (
        <Router>
            <Switch>
                <PrivateRouter path="/" exact>
                    <HomeScreen />
                </PrivateRouter>
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