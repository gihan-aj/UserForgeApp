import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DEVICE_IDENTIFIER } from '../constants/device-identifier';

@Injectable({
  providedIn: 'root',
})
export class DeviceIdentifierService {
  constructor() {}

  /**
   * Retrieves the existing device identifier or generates a new one if not present.
   * @returns The unique device identifier.
   */
  getOrCreateDeviceIdentifier(): string {
    let deviceId = localStorage.getItem(DEVICE_IDENTIFIER);
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(DEVICE_IDENTIFIER, deviceId);
    }

    return deviceId;
    // return '1d17e6cc-3814-4d3d-a94f-917010425';
  }

  /**
   * Clears the device identifier from localStorage. Use with caution.
   */
  clearDeviceIdentifier(): void {
    localStorage.removeItem(DEVICE_IDENTIFIER);
  }
}
