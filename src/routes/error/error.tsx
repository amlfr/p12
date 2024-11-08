import {  useRouteError } from "react-router-dom";
import styles from "./Error.module.css";


const ErrorPage = () =>  {
    const error = useRouteError();
    console.error(error);

    return (
        <> 
            <main>
                <div className={styles.errorContainer}>
                    <span className={styles.errorNumber}>404</span>
                    <span className={styles.errorText}>Oups! La page que vous demandez n'existe pas.</span>
                </div>
            </main>
        </>
    );
};

export default ErrorPage;