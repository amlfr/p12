import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => (
    <header className={styles.header}>
        <img src="../../../public/logo.png" className={styles.logo} />
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

export default Header;
