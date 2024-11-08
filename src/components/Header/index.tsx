import styles from './Header.module.css';
import { Link } from 'react-router-dom';


const Header = () => {
    return (
        <header className={styles.header}>
            <img src="../../../public/logo.png" className={styles.logo}></img>
            <nav className={styles.nav}> 
                <ul className={styles.linkList}>
                    <span className={styles.linkItem}>Accueil</span>
                    <span className={styles.linkItem}>Profil</span>
                    <span className={styles.linkItem}>Reglage</span>
                    <span className={styles.linkItem}>Communaute</span>
                </ul>
            </nav>
        </header>
    );
};

export default Header;