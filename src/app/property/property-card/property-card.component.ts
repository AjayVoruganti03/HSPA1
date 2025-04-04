import {Component, Input, input} from '@angular/core';
import { IPropertyBase } from '../../model/ipropertybase';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-property-card',
    standalone: true,  
    imports: [RouterModule,CommonModule],
    templateUrl: './property-card.component.html',
    styleUrls: ['./property-card.component.css'],
})

export class PropertyCardComponent{
@Input() property!: IPropertyBase;
@Input() hideIcons: boolean = false;
}