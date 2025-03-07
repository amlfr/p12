import { useLoaderData } from 'react-router-dom';
import styles from './User.module.css';
import {
    UserInfoData, PerformanceInfoData, ActivityInfoData, TimeInfoData, KeyData,
} from '../../types/types';
import { profilePageLoader } from '../../loader/profilePageLoader';
import NutritionalInfo from '../../components/NutritionalInfo';
import { AverageSessions } from '../../components/AverageSessions';
import { OverallScore } from '../../components/OverallScore';
import { SkillChart } from '../../components/SkillChart';
import { DailyActivity } from '../../components/DailyActivity';

type LoaderData = Awaited<ReturnType<typeof profilePageLoader>>;

const UserPage = () => {
    const {
        userInfoData, performanceInfoData, activityInfoData, timeInfoData,
    } = useLoaderData() as LoaderData;

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
                    <DailyActivity activityInfoData={activityInfoData} />
                    <div className={styles.lineInfoContainer}>
                        <AverageSessions timeInfoData={timeInfoData} />
                        <SkillChart performanceInfoData={performanceInfoData} />
                        <OverallScore score={userInfoData.score} />
                    </div>
                </div>
                <div className={styles.nutrionalInfoContainer}>
                    {Object.keys(userInfoData.keyData).map((type, index) => (
                        <NutritionalInfo key={index} type={type as keyof KeyData} value={userInfoData.keyData[type as keyof KeyData]} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default UserPage;
