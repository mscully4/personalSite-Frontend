export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const DEFAULT_CENTER = { lat: 40.7506, lng: -73.9935 }; // NYC!
export const DEFAULT_ZOOM = 10;
export const DEFAULT_PLACE_ZOOM = 12;
export const GRANULARITY_CUTOFF = 11;

export const MILES_FROM_CITY = 200; /*miles*/

export enum GRANULARITIES {
  PLACES = "places",
  DESTINATIONS = "destinations",
}

export function granularitySwitcher<T, V>(
  granularity: GRANULARITIES,
  dest: T,
  place: V
) {
  switch (granularity) {
    case GRANULARITIES.DESTINATIONS:
      return dest;
    case GRANULARITIES.PLACES:
      return place;
  }
}

export const metersToMiles = (meters: number) => {
  return meters * 0.000621371;
};

export const milesToMeters = (miles: number) => {
  return miles * 1609.34;
};

export const getDistanceBetweenTwoPoints = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
) => {
  const rad = (x: number) => {
    return (x * Math.PI) / 180;
  };

  const R = 6378137; // Earth’s mean radius in meter
  const dLat = rad(lat2 - lat1);
  const dLong = rad(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return metersToMiles(d); // convert from meters to miles
};
