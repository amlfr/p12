export interface UserInfo {
    firstName: string;
    lastName: string;
    age: number;
}

export interface KeyData {
    calorieCount: number;
    proteinCount: number;
    carbohydrateCount: number;
    lipidCount: number;
}

export interface ActivitySession {
    day: string;
    kilogram: number;
    calories: number;
}

export interface TimeSession {
    day: number;
    sessionLength: number;
}

export interface KindMap {
    [key: number]: string;
}

export interface PerformanceData {
    value: number;
    kind: number;
}

export interface UserInfoData {
    id: number;
    userInfos: UserInfo;
    score: number;
    keyData: KeyData;
}

export interface PerformanceInfoData {
    userId: number;
    data: PerformanceData[];
    kind: KindMap;
}

export interface ActivityInfoData {
    userId: number;
    sessions: ActivitySession[];
}

export interface TimeInfoData {
    userId: number;
    sessions: TimeSession[];
}
