import AppConfig from '../common/config';

class UserInfo {
  id?: string;
  username: string;
  password: string;
  email: string;
  avatar?: string;
  active?: number;
  birthDay?: number;
  gender?: number;
  isAdmin?: number;
  contact?: string;
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
  Trips?: number;

  constructor(args?: any) {
    if (!args) {
      args = {};
    }
    this.id = args?._id ?? args.id ?? undefined;
    this.username = args.username ?? '';
    this.password = args.password ?? '';
    this.email = args.email ?? '';
    this.avatar = args.avatar ?? '';
    this.active = args.active ?? 0;
    this.birthDay = args.birth_day ?? 0;
    this.gender = args.gender ?? 0;
    this.isAdmin = args.is_admin ?? 0;
    this.contact = args.contact ?? '';
    this.createdAt = args?.created_at ?? 0;
    this.updatedAt = args?.updated_at ?? 0;
    this.deletedAt = args?.deleted_at ?? 0;
  }
}

export { UserInfo };
