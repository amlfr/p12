import { LoaderFunctionArgs } from 'react-router-dom';
import formatter from '../services/formatter';
import {
    UserInfoData, PerformanceInfoData, ActivityInfoData, TimeInfoData,
} from '../types/types';

export const profilePageLoader = async (
    { params }: LoaderFunctionArgs,
): Promise<{
  userInfoData: UserInfoData;
  performanceInfoData: PerformanceInfoData;
  activityInfoData: ActivityInfoData;
  timeInfoData: TimeInfoData;
}> => {
    const { userId, dataSource } = params;

    if (dataSource !== 'mock' && dataSource !== 'api') {
        throw new Response('Invalid data provider', { status: 400 });
    }

    const isApi = dataSource === 'api';

    let formattedUserInfoData;
    let formattedPerformanceInfoData;
    let formattedActivityInfoData;
    let formattedTimeInfoData;

    if (!isApi) {
        const mockResponse = isApi ? null : await fetch('/mockData/data.json');
        const mockData = await mockResponse.json();
        const mockDataFormatter = new formatter(mockData);
        ({
            formattedUserInfoData,
            formattedPerformanceInfoData,
            formattedActivityInfoData,
            formattedTimeInfoData,
        } = mockDataFormatter.formatData(dataSource, userId));
    } else {
        const userInfoResponse = await fetch(`http://localhost:3000/user/${userId}`);
        const userInfoData = await userInfoResponse.json();
        const performanceInfoResponse = await fetch(`http://localhost:3000/user/${userId}/performance`);
        const performanceInfoData = await performanceInfoResponse.json();
        const activityInfoResponse = await fetch(`http://localhost:3000/user/${userId}/activity`);
        const activityInfoData = await activityInfoResponse.json();
        const timeInfoResponse = await fetch(`http://localhost:3000/user/${userId}/average-sessions`);
        const timeInfoData = await timeInfoResponse.json();

        const dataFormatter = new formatter([userInfoData, performanceInfoData, activityInfoData, timeInfoData]);
        ({
            formattedUserInfoData,
            formattedPerformanceInfoData,
            formattedActivityInfoData,
            formattedTimeInfoData,
        } = dataFormatter.formatData(dataSource));
    }

    return {
        userInfoData: formattedUserInfoData,
        performanceInfoData: formattedPerformanceInfoData,
        activityInfoData: formattedActivityInfoData,
        timeInfoData: formattedTimeInfoData,
    };
};
