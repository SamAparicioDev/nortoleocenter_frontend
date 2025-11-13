import { Component, OnInit } from '@angular/core';
import {MenuVerticalComponent} from '../menu-vertical/menu-vertical.component';
import {NgClass} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  imports: [
    MenuVerticalComponent,
    NgClass,
    HeaderComponent,
    RouterOutlet
  ],
  styleUrls: ['./contenido.component.css']
})
export class ContenidoComponent{
  isCollapsed = false;

  constructor() {}


}
