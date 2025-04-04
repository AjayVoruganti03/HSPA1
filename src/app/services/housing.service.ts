import { Injectable } from '@angular/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IPropertyBase } from '../model/ipropertybase';
import { Observable } from 'rxjs';
import { Property } from '../model/property';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  constructor(private http: HttpClient) { }

  getProperty(id: number) {
    return this.getAllProperties().pipe(
      map(propertiesArray => {
        return propertiesArray.find(p => p.Id === id);
      })
    );
  }

  getAllProperties(SellRent?: number): Observable<Property[]> {
    return this.http.get('data/properties.json').pipe(
      map((data: { [key: string]: any }) => {
        const propertiesArray: Array<Property> = [];
        const localProperties = JSON.parse(localStorage.getItem('newProp') || '[]');
        if (localProperties) {
          for (const key in localProperties) {
            if (SellRent) {
              if (localProperties.hasOwnProperty(key) && localProperties[key].SellRent === SellRent) {
                propertiesArray.push(localProperties[key]);
              }
            } else {
              propertiesArray.push(localProperties[key]);
            }
          }
        }

        for (const key in data) {
          if (SellRent) {
            if (data.hasOwnProperty(key) && data[key].SellRent === SellRent) {
              propertiesArray.push(data[key]);
            }
          } else {
            propertiesArray.push(data[key]);
          }
        }
        return propertiesArray;
      })

    );
    return this.http.get<Property[]>('data/properties.json');
  }
  addProperty(property: Property) {
    let existingProps = localStorage.getItem('newProp');

    // Ensure existingProps is valid JSON or default to an empty array
    let newProp: Property[] = [];

    if (existingProps) {
      try {
        newProp = JSON.parse(existingProps);
        if (!Array.isArray(newProp)) {
          newProp = [];
        }
      } catch (error) {
        console.error("Error parsing newProp from localStorage:", error);
        newProp = [];
      }
    }

    newProp.unshift(property);
    localStorage.setItem('newProp', JSON.stringify(newProp));
  }



  newPropID() {
    if (localStorage.getItem('PID')) {
      const currentPID = localStorage.getItem('PID') ? +localStorage.getItem('PID')! : 0;
      localStorage.setItem('PID', String(currentPID + 1));
      return +(localStorage.getItem('PID') || '0');
    }
    else {
      localStorage.setItem('PID', '101');
      return 101;
    }
  }
}
