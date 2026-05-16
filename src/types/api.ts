export interface UserStatus {
  status: 'new' | 'existing';
  userData: {
    id: string;
    userProfile?: UserProfile;
  };
  token: string;
}

export interface InitDataResponse {
  userStatus: UserStatus;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
}
