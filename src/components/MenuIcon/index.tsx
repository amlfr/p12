import styles from './MenuIcon.module.css';

const MenuIcon = ({ sport }: {sport:string}) => {
    const svgPath = `/${sport}.svg`;

    return (
        <div className={styles.iconContainer}>
            <img src={svgPath} alt="" />
        </div>
    );
};

export default MenuIcon;
