
import { useLoaderData } from "react-router-dom";
import styles from './User.module.scss';

const UserPage = () => {
    const  { userInfoData, performanceInfoData, activityInfoData, timeInfoData } = useLoaderData();
    console.log('userData', userInfoData, performanceInfoData)

    return ( 
        <main >
           <span>USER PAGE NAME IS :</span>
        </main>
    );
};


export default UserPage;