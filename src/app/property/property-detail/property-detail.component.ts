import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { Property } from '../../model/property';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabsetComponent,
    TabsModule,
    CarouselModule
  ]
})
export class PropertyDetailComponent implements OnInit {
  public propertyId!: number;
  property = new Property();

  // Carousel image list
  images: string[] = [
    'assets/images/internal-1.jpeg',
    'assets/images/internal-2.jpeg',
    'assets/images/internal-3.jpeg',
    'assets/images/internal-4.jpeg',
    'assets/images/internal-5.jpeg'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private housingService: HousingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.propertyId = +params['id'];
      } else {
        this.router.navigate(['/']); // Redirect if no ID is found
      }
    });

    this.route.data.subscribe((data) => {
      this.property = data['prp'] as Property;
    });
  }
}
