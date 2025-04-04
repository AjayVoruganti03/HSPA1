import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PropertyCardComponent } from "../property-card/property-card.component";
import { IPropertyBase } from '../../model/ipropertybase';
import { AlertifyService } from '../../services/alertify.service';
import { HousingService } from '../../services/housing.service';
import { Property } from '../../model/property';

@Component({
  selector: 'app-add-property',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ButtonsModule,
    PropertyCardComponent
  ],
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.css']
})
export class AddPropertyComponent implements OnInit {

  //@ViewChild('formTabs', { static: false }) addPropertyForm!: NgForm;
  @ViewChild('formTabs', { static: false }) formTabs!: TabsetComponent;

  addPropertyForm!: FormGroup;
  NextClicked!: boolean;
  sellRent: number = 1;

  property = new Property();

  propertyTypes: string[] = ['House', 'Apartment', 'Villa', 'Land'];
  furnishingTypes: string[] = ['Fully', 'Semi', 'Unfurnished'];

  propertyView: IPropertyBase = {
    Id: 0,
    SellRent: 1,
    Name: '',
    PType: '',
    FType: '',
    Price: '',
    BHK: '',
    BuiltArea: 0,
    City: '',
    RTM: '',
    Image: ''
  };

  constructor(private fb: FormBuilder,
    private router: Router,
    private housingService: HousingService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.CreateAddPropertyForm();
  }

  CreateAddPropertyForm() {
    this.addPropertyForm = this.fb.group({
      BasicInfo: this.fb.group({
        SellRent: [null, Validators.required],
        BHK: [null, Validators.required],
        PType: [null, Validators.required],
        FType: [null, Validators.required],
        Name: [null, [Validators.required, Validators.minLength(5)]],
        City: [null, Validators.required]
      }),
      PriceInfo: this.fb.group({
        Price: [null, Validators.required],
        BuiltArea: [null, Validators.required],
        CarpetArea: [null],
        Security: [null],
        Maintenance: [null],
      }),

      AddressInfo: this.fb.group({
        FloorNo: [null],
        TotalFloor: [null],
        Address: [null, Validators.required],
        LandMark: [null],
      }),

      OtherInfo: this.fb.group({
        RTM: [null, Validators.required],
        PossessionOn: [null],
        AOP: [null],
        Gated: [null],
        MainEntrance: [null],
        Description: [null]
      })
    });
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.NextClicked = true;

    if (this.allTabsValid()) {
        this.mapProperty();

        // This will handle adding property correctly
        this.housingService.addProperty(this.property);

        console.log("Submit level");
        console.log(this.property);
        console.log("Submit level1");

        this.alertify.success('Congrats, your property is listed successfully!');

        if (this.SellRent.value === '2') {
            this.router.navigate(['/rent-property']);
        } else {
            this.router.navigate(['/']);
        }
    } else {
        this.alertify.error('Please review the form and provide all valid entries');
    }
}


  allTabsValid(): boolean {
    if (this.BasicInfo.invalid) {
      this.formTabs.tabs[0].active = true;
      return false;
    }

    if (this.PriceInfo.invalid) {
      this.formTabs.tabs[1].active = true;
      return false;
    }

    if (this.AddressInfo.invalid) {
      this.formTabs.tabs[2].active = true;
      return false;
    }

    if (this.OtherInfo.invalid) {
      this.formTabs.tabs[3].active = true;
      return false;
    }
    return true;
  }

  mapProperty(): void {
    const basicInfo = this.addPropertyForm.get('BasicInfo') as FormGroup;
    const priceInfo = this.addPropertyForm.get('PriceInfo') as FormGroup;
    const addressInfo = this.addPropertyForm.get('AddressInfo') as FormGroup;
    const otherInfo = this.addPropertyForm.get('OtherInfo') as FormGroup;
  
    this.property.Id = this.housingService.newPropID();
    this.property.SellRent = +(basicInfo.get('SellRent')?.value ?? 1); // Default to 1
    this.property.BHK = basicInfo.get('BHK')?.value ?? '';
    this.property.PType = basicInfo.get('PType')?.value ?? '';
    this.property.Name = basicInfo.get('Name')?.value ?? '';
    this.property.City = basicInfo.get('City')?.value ?? '';
    this.property.FType = basicInfo.get('FType')?.value ?? '';
  
    this.property.Price = priceInfo.get('Price')?.value ?? 0;
    this.property.BuiltArea = priceInfo.get('BuiltArea')?.value ?? 0;
    this.property.CarpetArea = priceInfo.get('CarpetArea')?.value ?? 0;
    this.property.Security = priceInfo.get('Security')?.value ?? 0;
    this.property.Maintenance = priceInfo.get('Maintenance')?.value ?? 0;
  
    this.property.FloorNo = addressInfo.get('FloorNo')?.value ?? 0;
    this.property.TotalFloor = addressInfo.get('TotalFloor')?.value ?? 0;
    this.property.Address = addressInfo.get('Address')?.value ?? '';
    this.property.Address2 = addressInfo.get('LandMark')?.value ?? '';
  
    this.property.RTM = otherInfo.get('RTM')?.value ?? '';
    this.property.AOP = otherInfo.get('AOP')?.value ?? '';
    this.property.Gated = otherInfo.get('Gated')?.value ?? '';
    this.property.MainEntrance = otherInfo.get('MainEntrance')?.value ?? '';
    this.property.Possession = otherInfo.get('PossessionOn')?.value ?? '';
    this.property.Description = otherInfo.get('Description')?.value ?? '';
  
    this.property.PostedOn = new Date().toISOString();
  }
  

  selectTab(NextTabId: number,IsCurrentTabValid: boolean) {
    this.NextClicked = true;
    if(IsCurrentTabValid){
      this.formTabs.tabs[NextTabId].active = true;
    }
  }

  get BasicInfo() {
    return this.addPropertyForm.controls['BasicInfo'] as FormGroup;
  }

  get PriceInfo() {
    return this.addPropertyForm.controls['PriceInfo'] as FormGroup;
  }

  get AddressInfo() {
    return this.addPropertyForm.controls['AddressInfo'] as FormGroup;
  }

  get OtherInfo() {
    return this.addPropertyForm.controls['OtherInfo'] as FormGroup;
  }
// #endregion

//#region <Form Controls>
  get SellRent() {
    return this.BasicInfo.controls['SellRent'] as FormControl;
  }

  get BHK() {
    return this.BasicInfo.controls['BHK'] as FormControl;
  }

  get PType() {
    return this.BasicInfo.controls['PType'] as FormControl;
  }

  get FType() {
    return this.BasicInfo.controls['FType'] as FormControl;
  }

  get Name() {
    return this.BasicInfo.controls['Name'] as FormControl;
  }

  get City() {
    return this.BasicInfo.controls['City'] as FormControl;
  }

  get Price() {
    return this.PriceInfo.controls['Price'] as FormControl;
  }

  get BuiltArea() {
    return this.PriceInfo.controls['BuiltArea'] as FormControl;
  }

  get CarpetArea() {
    return this.PriceInfo.controls['CarpetArea'] as FormControl;
  }

  get Security() {
    return this.PriceInfo.controls['Security'] as FormControl;
  }

  get Maintenance() {
    return this.PriceInfo.controls['Maintenance'] as FormControl;
  }

  get FloorNo() {
    return this.AddressInfo.controls['FloorNo'] as FormControl;
  }

  get TotalFloor() {
    return this.AddressInfo.controls['TotalFloor'] as FormControl;
  }

  get Address() {
    return this.AddressInfo.controls['Address'] as FormControl;
  }

  get LandMark() {
    return this.AddressInfo.controls['LandMark'] as FormControl;
  }

  get RTM() {
    return this.OtherInfo.controls['RTM'] as FormControl;
  }

  get PossessionOn() {
    return this.OtherInfo.controls['PossessionOn'] as FormControl;
  }

  get AOP() {
    return this.OtherInfo.controls['AOP'] as FormControl;
  }

  get Gated() {
    return this.OtherInfo.controls['Gated'] as FormControl;
  }

  get MainEntrance() {
    return this.OtherInfo.controls['MainEntrance'] as FormControl;
  }

  get Description() {
    return this.OtherInfo.controls['Description'] as FormControl;
  }

}
