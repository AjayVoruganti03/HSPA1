import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
    providedIn: 'root'
})
export class UserServiceService {

constructor() { }

addUser(user: User) {
    let users: any[] = [];

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            users = JSON.parse(storedUsers);
            if (!Array.isArray(users)) {
                users = []; 
            }
        } catch (error) {
            console.error('Error parsing users from localStorage:', error);
            users = []; 
        }
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users)); 
}

  
}
