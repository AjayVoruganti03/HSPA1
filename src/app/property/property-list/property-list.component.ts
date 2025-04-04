import { Component } from '@angular/core';
import { PropertyCardComponent } from "../property-card/property-card.component";
import { CommonModule } from '@angular/common';
import { HousingService } from '../../services/housing.service';
import { IPropertyBase } from '../../model/ipropertybase';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../../Pipes/filter.pipe';
import { SortPipe } from '../../Pipes/sort.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [PropertyCardComponent, CommonModule, FilterPipe, SortPipe, FormsModule],
  providers: [],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent {
  SellRent: number = 1;
  properties: Array<IPropertyBase> = [];
  City: string = "";
  SearchCity: string = "";
  
  SortbyParam = '';
  SortDirection = 'asc';

  // get filteredProperties(): Array<IPropertyBase> {
  //   if (this.SearchCity.trim() === "") {
  //     return this.properties;
  //   }
  //   return this.properties.filter(property =>
  //     property.City.toLowerCase().includes(this.SearchCity.toLowerCase())
  //   );
  // }

  constructor(private route : ActivatedRoute, private housingService: HousingService) {
  }

  ngOnInit(): void {
    if(this.route.snapshot.url.toString()) {
      this.SellRent = 2;
    }
    this.housingService.getAllProperties(this.SellRent).subscribe(data=> {
      this.properties = data;
      //console.log(localStorage.getItem('newProp'));
      // const newProperty = JSON.parse(localStorage.getItem('newProp') || '{}');

      // if(newProperty.SellRent === this.SellRent){
      //   this.properties = [newProperty, ...this.properties];
      // }

      console.log(data);
    },error => {
      console.log(error);
    }
  )
  }
  onCityFilter(){
    this.SearchCity = this.City;
  }
  
  onCityFilterClear(){
    this.SearchCity = '';
    this.City = '';
  }

  onSortDirection() {
    if (this.SortDirection === 'desc') {
      this.SortDirection = 'asc';
    } else {
      this.SortDirection = 'desc';
    }
  }

}
