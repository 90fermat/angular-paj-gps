export class LoginDetails {
  token: string;
  refresh_token: string;
  expires_in: number;
  isAdmin: number;
  userID: number;
  routeIcon: string;

  constructor(loginDetails?: LoginDetails | any) {

    if (loginDetails) {
      this.token = loginDetails.token;
      this.refresh_token = loginDetails.refresh_token;
      this.expires_in = loginDetails.expires_in;
      this.isAdmin = loginDetails.isAdmin;
      this.userID = loginDetails.userID;
      this.routeIcon= loginDetails.routeIcon;

    }
  }
}