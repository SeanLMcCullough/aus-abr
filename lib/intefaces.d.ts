export interface ILocation {
    state: string;
    postcode: number;
}
export interface ISearchItem {
    abn: string;
    location: ILocation;
    type: string;
    from: string;
}
export interface IBusinessName {
    businessName: string;
    from: string;
    searchId: String;
    searchIdType: String;
}
export interface IStatus {
    from: string;
    to: string;
    value: string;
}
export interface IABNDetail {
    abn: string;
    entityType: string;
    abnStatus: IStatus;
    gtsStatus: IStatus;
    businessLocation: ILocation;
}
export interface ILookupResult {
    details: IABNDetail;
    businessNames: IBusinessName[];
    trandingNames: IBusinessName;
}
