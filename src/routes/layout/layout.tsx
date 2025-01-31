import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import styles from './Layout.module.css';

const LayoutPage = () => (
    <div className={styles.layoutContainer}>
        <Header />
        <div className={styles.contentContainer}>
            <SideBar />
            <Outlet />
        </div>
    </div>
);

export default LayoutPage;
