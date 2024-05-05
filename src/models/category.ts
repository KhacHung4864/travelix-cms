
class Category {
  id?: string | undefined;
  name: string;
  description: string;
  icon: string;
  created_at: number;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args?.id ?? undefined;
    this.name = args?.name ?? '';
    this.icon = args?.icon ?? '';
    this.description = args?.description ?? '';
    this.created_at = args?.created_at ?? 0;
  }
}

export { Category };

