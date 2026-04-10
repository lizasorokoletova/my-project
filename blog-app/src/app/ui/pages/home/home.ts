import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';
import { HeroComponent } from '../../components/hero/hero';
import { PostsComponent } from '../../components/posts/posts';
import { SkillsComponent } from '../../components/skills/skills';
import { WorkComponent } from '../../components/work/work';
import { HobbyComponent } from '../../components/hobby/hobby';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    PostsComponent,
    SkillsComponent,
    WorkComponent,
    HobbyComponent,
    FooterComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent { }