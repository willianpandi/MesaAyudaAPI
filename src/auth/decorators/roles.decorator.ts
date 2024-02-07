import { SetMetadata } from "@nestjs/common";
import { ROLES } from "../../constants/opcions";

export const ROLES_KEY = 'roles'

export const Roles = (...rol:ROLES[]) =>{ return SetMetadata(ROLES_KEY, rol)};