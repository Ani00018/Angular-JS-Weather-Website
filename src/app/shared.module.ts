// shared.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { LeftContainerComponent } from './left-container/left-container.component';
import { RightContainerComponent } from './right-container/right-container.component';
import { AppComponent } from './app.component';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    provideHttpClient(withFetch())
  ],
  exports: [HttpClientModule] // Export HttpClientModule so it's accessible where SharedModule is imported
})
export class SharedModule {}
