export class WarehouseModel {
  constructor(
    private readonly warehouseId: number,
    private name: string,
    private location: string,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  getWarehouseId() {
    return this.warehouseId;
  }

  getName() {
    return this.name;
  }

  getLocation() {
    return this.location;
  }

  isActived() {
    return this.isActive;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  changeLocation(newLocation: string): void {
    if (!newLocation || newLocation.trim() === '') throw new Error('Location cannot be empty');
    this.location = newLocation;
    this.touch();
  }

  activate(): void {
    if (this.isActive) throw new Error('Warehouse is already activated');
    this.isActive = true;
    this.touch();
  }

  deactivate(): void {
    if (!this.isActive) throw new Error('Warehouse is already deactivated');
    this.isActive = false;
    this.touch();
  }

  changeName(newName: string): void {
    if (!newName || newName.trim() === '') throw new Error('Name cannot be empty');
    this.name = newName;
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }
}
