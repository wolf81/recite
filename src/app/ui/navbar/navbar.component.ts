import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppConfig } from '../../core/app.config';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  appName = AppConfig.appName;

  isDarkTheme(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Read theme from <html data-theme="...">, which index.html set
      const currentTheme = document.documentElement.getAttribute('data-theme');
      return currentTheme === 'dark';
    }
    return false;
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.isDarkTheme() ? 'light' : 'dark'
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
