import Header from "../../components/Header";
import { Outlet, useLocation } from "react-router-dom";
import styles from './Layout.module.css';

const LayoutPage = () => {

    return (
        <>
            <Header />
            <Outlet />
          
        </>
    );    
};
 
export default LayoutPage;