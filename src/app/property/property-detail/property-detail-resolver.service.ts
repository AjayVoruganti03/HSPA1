import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Property } from '../../model/property';
import { Observable, of } from 'rxjs';
import { HousingService } from '../../services/housing.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class PropertyDetailResolverService implements Resolve<Property> {
  
  constructor(private router: Router,  private housingService: HousingService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Property>|Property {
      const propId = route.params['id'];
      return this.housingService.getProperty(+propId).pipe(
        map(property => {
          if (property) {
            return property;
          } else {
            this.router.navigate(['/not-found']);
            throw new Error('Property not found');
          }
        }),
        catchError(() => {
          this.router.navigate(['/not-found']);
          return of();
        })
      );
  }
  }