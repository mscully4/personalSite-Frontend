// API Constants
export const API_BASE = "https://api.michaeljscully.com";

export const API_TRAVEL_DESTINATIONS = `${API_BASE}/travel/destinations`;
export const API_TRAVEL_PLACES = `${API_BASE}/travel/places`;
export const API_TRAVEL_PHOTOS = `${API_BASE}/travel/photos`;
export const API_TRAVEL_ALBUMS = `${API_BASE}/travel/albums`;

export const API_HOME_PHOTOS = `${API_BASE}/home/photos`;

export const API_RESUME_JOBS = `${API_BASE}/resume/jobs`;
export const API_RESUME_SKILLS = `${API_BASE}/resume/skills`;
export const API_RESUME_EDUCATION = `${API_BASE}/resume/education`;

//Mapping Constants
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
export const DEFAULT_CENTER = { lat: 33.749, lng: -84.388 };
export const GRANULARITY_CUTOFF = 8;
export const DISTANCE_FROM_CITY = 200; /*miles*/

//Destination Type Mapping
export const DESTINATION_TYPE_MAPPING = {
  NP: "National Park",
  NM: "National Monument",
  C: "City",
};
