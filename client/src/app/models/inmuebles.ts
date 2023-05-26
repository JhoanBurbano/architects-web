export interface inmuebleI{
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