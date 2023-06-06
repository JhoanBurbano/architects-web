export interface IProperty{
    _id?:number,
    type: string,
    city: string,
    sector: string,
    attr: {
        levels: number,
        rooms: number,
        baths: number,
        garage: number,
    },
    assesor: {
        name: string,
        email: string,
    },
    favs: number,
    comments: string[],
    description:string,
    img:any,
    price:number,
    tags:string[],
    active: boolean
}

export interface ICreateProperty{
    type: string,
    city: string,
    sector: string,
    features: {
        levels: number,
        rooms: number,
        baths: number,
        garage: boolean,
    },
    description:string,
    images:string[],
    price:number,
    tags:string[],
    active: boolean
}