export type OpenStreetMapGeolocationResponse = {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
  };
};

export type IpInfoGeolocationResponse = {
  city: string;
  loc: string;
};

export type OpenMeteoGeolocationResponse = {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
};
