export const profilePageLoader = async ({ params }: { params: { userId: string } }) => {
    const userInfoResponse = await fetch(`http://localhost:3000/user/${params.userId}`);
    const userInfoData = await userInfoResponse.json();
    const performanceInfoResponse = await fetch(`http://localhost:3000/user/${params.userId}/performance`);
    const performanceInfoData = await performanceInfoResponse.json();
    const activityInfoResponse = await fetch(`http://localhost:3000/user/${params.userId}/activity`);
    const activityInfoData = await activityInfoResponse.json();
    const timeInfoResponse = await fetch(`http://localhost:3000/user/${params.userId}/average-sessions`);
    const timeInfoData = await timeInfoResponse.json();
  
    return { userInfoData, performanceInfoData, activityInfoData, timeInfoData };
  };