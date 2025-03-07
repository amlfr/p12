import styles from './NutritionalInfo.module.css';

interface NutritionalInfoProps {
    type: string;
    value: number;
}

const NutritionalInfo = ({ type, value }: NutritionalInfoProps) => {
    const typeInfos: Record<string, {
        name: string, unit:string, color: string, backgroundColor: string
    }> = {
        calorieCount: {
            name: 'calories',
            unit: 'kCal',
            color: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
        },
        proteinCount: {
            name: 'proteines',
            unit: 'g',
            color: 'light-blue',
            backgroundColor: 'rgba(74, 184, 255, 0.1)',
        },
        carbohydrateCount: {
            name: 'glucides',
            unit: 'g',
            color: 'yellow',
            backgroundColor: 'rgba(249, 206, 35, 0.1)',
        },
        lipidCount: {
            name: 'lipides',
            unit: 'g',
            color: 'pink',
            backgroundColor: 'rgba(253, 81, 129, 0.1)',
        },
    };
    const translatedType = typeInfos[type].name;
    const svgPath = `/${translatedType}.svg`;

    return (
        <div className={styles.wrapper}>
            <div className={styles.iconContainer} style={{ backgroundColor: typeInfos[type].backgroundColor }}>
                <img className={styles.icon} style={{ opacity: 1 }} src={svgPath} />
            </div>
            <div className={styles.textContainer}>
                <span className={styles.textValue}>{`${value}${typeInfos[type].unit}`}</span>
                <span className={styles.textName}>
                    {translatedType.charAt(0).toUpperCase()
                        + translatedType.slice(1)}
                </span>
            </div>
        </div>
    );
};

export default NutritionalInfo;
