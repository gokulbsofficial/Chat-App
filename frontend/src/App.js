import Router from "./routers/Router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
