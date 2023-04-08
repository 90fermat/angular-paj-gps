import { Component, Inject, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { Device } from '../models/device';
import { HttpClient } from '@angular/common/http';
import { Feature } from 'maplibre-gl';
import { map } from 'rxjs/operators';
import { async, interval, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  public devices: Device[]
  public devicesLastPositions: DevicePos[]
  
  private baseUrl: String = 'https://connect.paj-gps.de/api/';

  constructor(
    public loginService: LoginService, 
    private http: HttpClient)  {
    const user = { email: 'testkunde@paj-gps.de', password: 'app123#.'}
    loginService.login(user);

    //this.getAllLastPositions(this.devices.then(value => value.map(device => device.id)))

  }

  async ngOnInit() {
    this.devices = await this.getAllDevices();
    this.devicesLastPositions = await this.getAllLastPositions((this.devices).map(device => device.id))
    console.log("Devices:", this.devices)
    console.log("DevicesPos:", this.devicesLastPositions)

  }

  async getAllDevices() {
    if(this.loginService.isLogged) {
    /*return this.http.get<any>(this.baseUrl + 'device')
  .subscribe({
    next(response){
      this.devices = response.success
      console.log("Devices", this.devices)
    },
    error(error) {
      console.log(error.error)
    }
  })*/
      return firstValueFrom(this.http.get<any>(this.baseUrl + 'device')
          .pipe(map(response => response.success)))
    } else {
      return  Promise.all([]);
    }
  }

  async getAllLastPositions(deviceIDS: number[]) {
    return firstValueFrom(this.http.post<any>(`${this.baseUrl}trackerdata/getalllastpositions`,
        { "deviceIDs":  deviceIDS })
        .pipe(map(response => response.success)))
  }

  searchDeviceColor(id: number) {
    //return this.devices.then(value => value.find((device) => id === `${device.id}`).spurfarbe)
    return this.devices.find((device) => id === device.id).spurfarbe
  }

  searchDeviceName(id: number) {
    //return this.devices.then(value => value.find((device) => id === `${device.id}`).name)
    return this.devices.find((device) => id === device.id).name
  }

  alert(message) {
    alert(message)
  }
}

export interface DevicePos {
  id: string,
  lat: number,
  lng: number,
  iddevice: number
}