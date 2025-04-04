import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, BsDropdownModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  loggedinUser: string = '';

  constructor(private alertify: AlertifyService) { }

  ngOnInit(){}

  loggedin() { 
    this.loggedinUser = localStorage.getItem('token') || '';
    return this.loggedinUser;  
  }

  onLogout() {
    localStorage.removeItem('token');
    this.loggedinUser = '';  
    this.alertify.success('Logged out successfully');
  }

}
