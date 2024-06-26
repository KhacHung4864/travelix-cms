import { LoadingOutlined } from "@ant-design/icons";
import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import LayoutDefault from "./components/layouts/DefaultLayout";
import PrivateRoute from './components/PrivateRoute';
import LoginPages from './pages/login';
import routes from "./pages/routes";

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingOutlined />}>
        <Routes>
          <Route element={<LoginPages />} key={'login'} path={"/dang-nhap"} />
          <Route path="/" element={<PrivateRoute />}>
          {routes.map(
            ({ component: Component, path, label, ...rest }, index) => {
              return (
                <Route
                  element={
                    <LayoutDefault>
                      <Component />
                    </LayoutDefault>
                  }
                  key={index}
                  path={path}
                  {...rest}
                />
              );
            }
          )}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
