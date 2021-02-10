import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  navLinks: any[];
  routerSubscription: Subscription;
  activeLinkIndex = -1;
 
  constructor(private router: Router) {
    this.navLinks = [
        {
            label: 'Account',
            link: './account',
            index: 0
        }, {
            label: 'Blogs',
            link: './blogs',
            index: 1
        }, {
            label: 'Messages',
            link: './messages',
            index: 2
        }, 
    ];
  }
  
  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }
  
}
