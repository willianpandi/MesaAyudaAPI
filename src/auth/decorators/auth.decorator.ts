import { UseGuards, applyDecorators } from "@nestjs/common";
import { ROLES } from "../../constants/opcions";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";


export function Auth( ...rol:ROLES[]) {
    return applyDecorators(
        Roles(...rol),
        UseGuards( AuthGuard, RolesGuard )
    )
}