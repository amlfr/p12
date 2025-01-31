import styles from './SideBar.module.css';
import MenuIcon from '../MenuIcon';

const SideBar = () => {
    ///TODO THINK ABOUT SCALING SVGS ???
    const sportsEnum = ['yoga', 'swimming', 'cycling', 'lifting'];

    return (
        <div className={styles.sideBar}>
            <div className={styles.menuIconsContainer}>
                {sportsEnum.map((sport, key) => <MenuIcon sport={sport} key={key} />)}
            </div>
            <p className={styles.text}>Copiryght, SportSee 2020</p>
        </div>
    );
};

export default SideBar;
