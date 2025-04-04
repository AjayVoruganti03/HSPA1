import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

  constructor() { }

  authUser(user: any) {
    let UserArray: any[] = [];
    if (localStorage.getItem('users')) {
      UserArray = JSON.parse(localStorage.getItem('users') || '{}');
    }
    
    const foundUser = UserArray.find((u: any) => u.userName === user.userName && u.password === user.password);
    
    if (foundUser) {
     
      const token = foundUser.userName;  
      return { token }; 
    }

    return null;  
  }
}
