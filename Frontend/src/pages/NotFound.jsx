import { Link, useRouteError } from "react-router-dom";

const NotFound = () => {
    const error = useRouteError();
    console.log(error);

    return (
        <div>
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/">Go back to the main page</Link>
        </div>
    );
}

export default NotFound;