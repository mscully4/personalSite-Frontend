import { useRef, SetStateAction, useEffect } from "react";
import { Map as MapboxMap, MapRef } from "react-map-gl";
import Marker from "./marker";
import { Marker as MapBoxMarker } from "react-map-gl";
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAPBOX_TOKEN } from "../utils/mapping";
import { GRANULARITIES, granularitySwitcher } from "../utils/granularity";
// import Destination from "../types/destination";
import Place from "../types/place";
import Destination from "../types/destination";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  destinations: Destination[];
  places: Record<string, Place[]>;
  renderablePlaces: Place[];
  hoverId: string | null;
  setHoverId: (value: string | null) => void;
  setMapRef: (value: SetStateAction<any>) => void;
  mapGranularity: GRANULARITIES;
  setMapGranularity: (zoom: number) => void;
  updateRenderablePlaces: () => void;
  colorMap: Record<string, string>;
  setPreparedImages: any;
  setGalleryOpen: any;
}

function Map(props: MapProps) {
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    props.setMapRef(mapRef.current);
  }, [mapRef.current]);

  const generateMarkers = (data: Destination[] | Place[]) => {
    return data.map((el: Destination | Place, i: number) => (
      <Marker
        key={i}
        mapRef={mapRef.current}
        color={props.colorMap[el.placeId]}
        data={el}
        hoverId={props.hoverId}
        setHoverId={props.setHoverId}
        mapGranularity={props.mapGranularity}
        setPreparedImages={props.setPreparedImages}
        setGalleryOpen={props.setGalleryOpen}
      />
    ));
  };

  const markers = generateMarkers(
    granularitySwitcher(
      props.mapGranularity,
      props.destinations,
      props.renderablePlaces
    )
  );
  return (
    <MapboxMap
      initialViewState={{
        latitude: DEFAULT_CENTER.lat,
        longitude: DEFAULT_CENTER.lng,
        zoom: DEFAULT_ZOOM,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
      ref={mapRef}
      onZoomEnd={(e) => props.setMapGranularity(e.viewState.zoom)}
      onMoveEnd={props.updateRenderablePlaces}
    >
      {markers}
    </MapboxMap>
  );
}

export default Map;
