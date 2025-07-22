export class WarehouseModel {
  constructor(
    private readonly warehouseId: number,
    private name: string,
    private location: string,
    private isActive: boolean,
    private readonly createdAt: Date,
    private updatedAt: Date
  ) {}

  getWarehouseId(): number {
    return this.warehouseId;
  }

  getName(): string {
    return this.name;
  }

  getLocation(): string {
    return this.location;
  }

  isActived(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
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

  private touch(): void {
    this.updatedAt = new Date();
  }
}
