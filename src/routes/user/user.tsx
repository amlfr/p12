import { useLoaderData } from 'react-router-dom';
import styles from './User.module.css';
import {
    UserInfoData, PerformanceInfoData, ActivityInfoData, TimeInfoData, KeyData,
} from '../../types/types';
import { profilePageLoader } from '../../loader/profilePageLoader';
import NutritionalInfo from '../../components/NutritionalInfo';
import { AverageSessions } from '../../components/AverageSessions';
import { OverallScore } from '../../components/OverallScore';

type LoaderData = Awaited<ReturnType<typeof profilePageLoader>>;

const UserPage = () => {
    const {
        userInfoData, performanceInfoData, activityInfoData, timeInfoData,
    } = useLoaderData() as LoaderData;
    console.log('userData', userInfoData);
    const nutritionalData: KeyData = userInfoData.keyData;

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>
                Bonjour
                <span className={styles.userName}>{` ${userInfoData.userInfos.firstName}`}</span>
            </h1>
            <span>
                Félicitation ! Vous avez explosé vos objectifs hier 👏
            </span>
            <div className={styles.layoutContainer}>
                <div className={styles.allInfoContainer}>
                    <div className={styles.lineInfoContainer}>
                        <AverageSessions timeInfoData={timeInfoData} />
                        <OverallScore score={userInfoData.score} />
                    </div>
                </div>
                <div className={styles.nutrionalInfoContainer}>
                    {Object.keys(nutritionalData).map((type, index) => (
                        <NutritionalInfo key={index} type={type as keyof KeyData} value={nutritionalData[type as keyof KeyData]} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default UserPage;
