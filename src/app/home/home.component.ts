import { Component, Inject, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { Device } from '../models/device';
import { HttpClient } from '@angular/common/http';
import { Feature } from 'maplibre-gl';
import { map } from 'rxjs/operators';
import { async } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public devices: Device[];
  public devicesLastPositions: DevicePos[] | any
  
  private baseUrl: String = 'https://connect.paj-gps.de/api/';

  constructor(
    public loginService: LoginService, 
    private http: HttpClient) { 
    const user = { email: 'testkunde@paj-gps.de', password: 'app123#.'};
    loginService.login(user);
    this.getAllDevices();
  }

  ngOnInit() {
    this.getAllLastPositions;
  }

  getAllDevices() {
    if(this.loginService.isLogged) {
      return this.http.get<any>(this.baseUrl + 'device')
    .subscribe({
      next(response){
        this.devices = response.success
      },
      error(error) {
        console.log(error.error)
      }
    })
    } else {
      this.devices = []
    }
  }

  getAllLastPositions(devicesIDS: number[]) {
    let deviceIDs = { devicesIDS:  devicesIDS }
    this.http.post<any>(`${this.baseUrl}trackerdata/getalllastpositions`,
    { devicesIDS:  devicesIDS })
    .pipe(map(response => response.success))
    .subscribe({
      next(val) {
        this.devicesLastPositions = val;
      },
      error(error) {
        console.log(error.error)
      }
    })
  }

  searchDeviceColor(id: string) {
    return this.devices.find((device) => id === `${device.id}`).spurfarbe
  }

  searchDeviceName(id: string) {
    return this.devices.find((device) => id === `${device.id}`).name
  }

  alert(message) {
    alert(message);
  }
}

export interface DevicePos {
    id: string,
    lat: number,
    lgn: number;
}