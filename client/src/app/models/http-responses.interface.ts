import { IProperty } from "./properties";
import { UserI } from "./user";

export interface IUploadImageResponse {
    url: string;
}

export interface IUpdateProfileResponse {
    name: string,
    lastname: string,
}

export interface IGetFullProfileResponse {
    user: UserI,
    cards: IProperty
}