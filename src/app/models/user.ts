export interface User {
  id?: number;
  username?: string;
  password: string;
  email: string;
  token?: string;

// constructor(user?: User | any) {

//   if (user) {
//      this.email = user.email;
//      this.password = user.password;
//      this.username = user.username;
//      this.id = user.id;
//      this.token = user.token;
//    }
//  }
}