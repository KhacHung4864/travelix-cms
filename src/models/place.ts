
class Place {
  id?: string | undefined;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  images: string[];
  price: number;
  rate: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.name = args?.name ?? '';
    this.address = args?.address ?? '';
    this.latitude = args?.latitude ?? 0;
    this.longitude = args?.longitude ?? 0;
    this.description = args?.description ?? '';
    this.images = args?.images ?? [];
    this.price = args?.price ?? 0;
    this.rate = args?.rate ?? 5;
    this.created_at = args?.created_at ?? '';
    this.updated_at = args?.updated_at ?? '';
    this.deleted_at = args?.deleted_at ?? '';
  }
}

export { Place };

