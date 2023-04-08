import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Device } from '../models/device';
import { HttpClient } from '@angular/common/http';
import { Map, LngLatLike } from 'maplibre-gl';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  map: Map;
  zoom: number = 9;

  center: LngLatLike = { lng: 7.11, lat: 50.11 }
  devices: Device[]
  devicesLastPositions: DevicePos[]
  
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
    return this.devices.find((device) => id === device.id).spurfarbe
  }

  searchDeviceName(id: number) {
    return this.devices.find((device) => id === device.id).name
  }

  centerMapTo(device: Device) {
    this.center = this._devicePosToLngLatLike(
        this.devicesLastPositions.find(dev => device.id === dev.iddevice)
    )
    this.zoom = 14;
  }

  _devicePosToLngLatLike(devicePos: DevicePos): LngLatLike {
    if (devicePos) {
      return { lng: devicePos.lng, lat: devicePos.lat }
    } else  {
      alert("The Device don't has a Last Tracked Position")
    }
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