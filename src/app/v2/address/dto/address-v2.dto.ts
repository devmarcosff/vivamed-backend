
export class AddressV2Dto {
    id: string;
    zipcode: string;
    street: string;
    number: number;
    neighborhood: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    complement: string;
    citizenId?: string;
    profileId?: string;
    firmId?: string;
}
