import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Device } from '../models/device';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Map, LngLatLike } from 'maplibre-gl';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import {CustomHttpParamEncoder} from "../helpers/custom-encoder";

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
  devicesLastPoints: any = []
  geometry: any
  
  private baseUrl: String = 'https://connect.paj-gps.de/api/';

  constructor(
    public loginService: LoginService, 
    private http: HttpClient)  {
    const user = { email: 'testkunde@paj-gps.de', password: 'app123#.'}
    loginService.login(user);
  }

  async ngOnInit() {
    this.devices = await this.getAllDevices();
    this.devicesLastPositions = await this.getAllLastPositions((this.devices).map(device => device.id))
    console.log("Devices:", this.devices)
    console.log("DevicesPos:", this.devicesLastPositions)
    for (const id of this.devices.map(value => value.id)) {
      this.devicesLastPoints.push({id: id, last_points: await this.getDeviceLastPoints(id)});
    }
    console.log("DevicesPoints:", this.devicesLastPoints)
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
    this._clearGeometry()
    this.center = this._devicePosToLngLatLike(
        this.devicesLastPositions.find(dev => device.id === dev.iddevice)
    )
    this.zoom = 14
    this._showLastPoints(device.id)
  }

  showLastPoints(deviceID: number) {
    this._clearGeometry()
    alert(this.searchDeviceName(deviceID))
    setTimeout(() => this.geometry = {
      type: 'LineString',
      coordinates: this.devicesLastPoints.find(value => value.id === deviceID).last_points
    }, 1000)

    console.log("geometry:", this.geometry.coordinates)
  }
  _showLastPoints(deviceID: number) {
    this._clearGeometry()
    setTimeout(() => this.geometry = {
      type: 'LineString',
      coordinates: this.devicesLastPoints.find(value => value.id === deviceID).last_points
    }, 1000)
  }

  _clearGeometry() {
    this.geometry = undefined
  }

  _devicePosToLngLatLike(devicePos: DevicePos): LngLatLike {
    if (devicePos) {
      return { lng: devicePos.lng, lat: devicePos.lat }
    } else  {
      alert("The Device don't has a Last Tracked Position")
    }
  }

  async getDeviceLastPoints(deviceID: number) {
    return firstValueFrom(this.http.get<any>(`${this.baseUrl}trackerdata/${deviceID}/last_points`,
        { params: new HttpParams({ encoder: new CustomHttpParamEncoder()})
              .append("lastPoints", 200)})
        .pipe(map(response =>  (response.success as DevicePos[])
            .map(devicePos => [devicePos.lng, devicePos.lat]))))
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