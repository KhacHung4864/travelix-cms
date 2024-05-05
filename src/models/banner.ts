
class Banner {
  id?: string | undefined;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.name = args?.name ?? '';
    this.image = args?.image ?? '';
    this.created_at = args?.created_at ?? '';
    this.updated_at = args?.updated_at ?? '';
  }
}

export { Banner };

