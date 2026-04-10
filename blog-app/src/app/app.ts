import { Component } from '@angular/core';
import { HomeComponent } from './ui/pages/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent { }