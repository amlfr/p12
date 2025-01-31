import {
    UserInfoData, PerformanceInfoData, ActivityInfoData, TimeInfoData,
} from '../types/types';

class formatter {
    data: object[];

    constructor(data: object[]) {
        this.data = data;
    }

    formatData(dataSource, userId?: string) {
        if (dataSource === 'api') {
            const formattedData = this.data.map((dataObject) => {
                if (dataObject.data.todayScore) {
                    dataObject.data.score = dataObject.data.todayScore;
                    delete dataObject.data.todayScore;
                }

                return dataObject.data;
            });
            console.log(formattedData, 'formatter data api');

            return {
                formattedUserInfoData: formattedData[0] as UserInfoData,
                formattedPerformanceInfoData: formattedData[1] as PerformanceInfoData,
                formattedActivityInfoData: formattedData[2] as ActivityInfoData,
                formattedTimeInfoData: formattedData[3] as TimeInfoData,
            };
        }

        if (!userId) { return; }

        const currentUserData = this.data.find((obj) => obj.id === parseInt(userId, 10));
        this.data = currentUserData;
        const userInfoMockData: UserInfoData = {
            id: this.data.id,
            userInfos: this.data.userInfos,
            score: this.data.score,
            keyData: this.data.keyData,
        };

        const performanceInfoMockData: PerformanceInfoData = {
            userId: this.data.id,
            data: this.data.performance,
            kind: this.data.kind,
        };

        const activityInfoMockData: ActivityInfoData = {
            userId: this.data.id,
            sessions: this.data.sessions,
        };

        const timeInfoMockData: TimeInfoData = {
            userId: this.data.id,
            sessions: this.data.averageSessions,
        };

        return {
            formattedUserInfoData: userInfoMockData,
            formattedPerformanceInfoData: performanceInfoMockData,
            formattedActivityInfoData: activityInfoMockData,
            formattedTimeInfoData: timeInfoMockData,
        };
    }
}

export default formatter;
