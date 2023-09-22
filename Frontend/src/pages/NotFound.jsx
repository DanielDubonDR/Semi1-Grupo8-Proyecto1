import { Link, useRouteError } from "react-router-dom";
import { useUserContext } from '../context/UserContext';
import './NotFound.css';

const NotFound = () => {
    const error = useRouteError();
    const {logueado, setLogueado} = useUserContext();
    console.log(error);

    return (
      <div>
        <h1>404 Error</h1>
        <p class="zoom-area">
        </p>
        <section class="error-container">
          <span>
            <span>4</span>
          </span>
          <span>0</span>
          <span>
            <span>4</span>
          </span>
        </section>
        <div class="link-container">
          <Link to={logueado ? "/user/home" : "/login"}
            class="more-link"
          >
            Visit the original page
          </Link>
        </div>
      </div>
    );
}

export default NotFound;