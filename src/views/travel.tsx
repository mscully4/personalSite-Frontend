import Gallery from "react-photo-gallery";
import Modal from "@material-ui/core/Modal";
import clsx from "clsx";
import RingLoader from "react-spinners/RingLoader";

import Map from "../components/map";
import VirtualTable from "../components/table";
import ImageViewer from "../components/ImageViewer";
import {
  place_colors,
  city_colors,
  FONT_GREY,
  ICE_BLUE,
  OFF_BLACK_1,
  OFF_BLACK_2,
  OFF_BLACK_3,
  OFF_BLACK_5,
} from "../utils/Colors";
import {
  API_TRAVEL_DESTINATIONS,
  API_TRAVEL_PLACES,
  API_TRAVEL_PHOTOS,
  API_TRAVEL_ALBUMS,
} from "../utils/Constants";
import { useState, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { objectKeysSnakeCasetoCamelCase } from "../utils/backend";
import { DEFAULT_CENTER, GRANULARITY_CUTOFF } from "../utils/Constants";
import Destination from "../types/destination";
import Place from "../types/place";
import Photo from "../types/photo";
import Album from "../types/album";
import { GRANULARITIES } from "../utils/granularity";
import { MapRef } from "react-map-gl";
import {
  DISTANCE_FROM_CITY,
  getDistanceBetweenTwoPoints,
} from "../utils/mapping";
import { Paper } from "@material-ui/core";

const styles = makeStyles((theme: Theme) => ({
  background: {
    backgroundColor: theme.palette.background.default,
  },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: "90%",
    marginBottom: 0,
    marginLeft: "5%",
    marginRight: "5%",
    height: "90%",
  },
  addIcon: {
    marginTop: "10%",
    width: "10% !important",
    height: "10% !important",
  },
  noImages: {
    color: FONT_GREY,
    fontSize: "80px",
    paddingTop: "20%",
    paddingBottom: "25%",
    textAlign: "center",
    backgroundColor: "rgba(40, 40, 40, .6)",
    marginTop: "5%",
    visibility: "visible",
  },
  modal: {
    width: "90%",
    margin: "5%",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}));

const theme = {
  navBarBackgroundColor: OFF_BLACK_1,
  logoColor: ICE_BLUE,
  menuBackgroundColor: OFF_BLACK_2,
  cardBackgroundColor: ICE_BLUE,
  iconFillColor: OFF_BLACK_1,
};

interface TravelProps {}

export default function Travel(props: TravelProps) {
  const classes = styles();

  const [ready, setReady] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [places, setPlaces] = useState<Record<string, Place[]>>({});
  const [photos, setPhotos] = useState<Record<string, Photo[]>>({});
  const [renderablePlaces, setRenderablePlaces] = useState<Place[]>([]);

  const [albums, setAlbums] = useState<Record<string, Album[]>>({});
  // const [selectedDestination, setSelectedDestination] =
  //   useState<Destination | null>(null);
  // const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  // const [hoverIndexDestination, setHoverIndexDestination] =
  //   useState<Destination | null>(null);
  // const [hoverIndexPlace, setHoverIndexPlace] = useState<Place | null>(null);

  // const [granularity, setGranularity] = useState(1);
  // const [mapZoom, setMapZoom] = useState(4);
  // const [mapCenter, setMapCenter] = useState({
  //   lat: DEFAULT_CENTER.lat,
  //   lng: DEFAULT_CENTER.lng,
  // });

  // const [closestCity, setClosestCity] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [preparedImages, _setPreparedImages] = useState<Photo[]>([]);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currImg, setCurrImg] = useState(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<MapRef>();
  const [mapGranularity, _setMapGranularity] = useState<GRANULARITIES>(
    GRANULARITIES.DESTINATIONS
  );
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  const [height, setHeight] = useState(window.innerHeight * 0.925);
  window.addEventListener("resize", () => {
    if (window.innerHeight !== height) setHeight(window.innerHeight * 0.925);
  });

  const setMapGranularity = (zoom: number) => {
    if (zoom > GRANULARITY_CUTOFF) {
      _setMapGranularity(GRANULARITIES.PLACES);
    } else {
      _setMapGranularity(GRANULARITIES.DESTINATIONS);
    }
  };

  const setPreparedImages = (place: Place) => {
    _setPreparedImages(place.placeId in photos ? photos[place.placeId] : []);
  };

  useEffect(() => {
    fetch(API_TRAVEL_DESTINATIONS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((entities) => {
          const destinations: Destination[] = entities.map((el, i) => {
            el.index = i;
            el.color =
              city_colors[Math.floor(Math.random() * city_colors.length)];
            el.latitude = parseFloat(el.latitude);
            el.longitude = parseFloat(el.longitude);
            return objectKeysSnakeCasetoCamelCase(el);
          });

          setDestinations(destinations);
          setReady(true);
        });
    });

    fetch(API_TRAVEL_PLACES, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((entities) => {
          const places: Place[] = entities.map((place, i) => {
            place.color =
              place_colors[Math.floor(Math.random() * place_colors.length)];
            place.latitude = parseFloat(place.latitude);
            place.longitude = parseFloat(place.longitude);
            place.index = i;
            return objectKeysSnakeCasetoCamelCase(place);
          });
          var result = places.reduce((map, place) => {
            var array = map[place.destinationId]
              ? map[place.destinationId]
              : [];
            array.push(place);
            map[place.destinationId] = array;
            return map;
          }, {});
          setPlaces(result);
        });
    });

    fetch(API_TRAVEL_PHOTOS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((entities) => {
          const photos: Photo[] = entities.map((entity) => {
            entity.src = entity.url;
            entity.width = parseFloat(entity.width);
            entity.height = parseFloat(entity.height);
            return objectKeysSnakeCasetoCamelCase(entity);
          });

          const photoMapping = photos.reduce((map, photo) => {
            map[photo.placeId] = [photo].concat(
              map[photo.placeId] ? map[photo.placeId] : []
            );
            return map;
          }, {});

          setPhotos(photoMapping);
        });
    });

    fetch(API_TRAVEL_ALBUMS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((resp) => {
      resp
        .json()
        .then((json) => json.map((el) => el.Entity))
        .then((entities) => {
          const albums = entities
            .map((entity) => objectKeysSnakeCasetoCamelCase(entity))
            .reduce((map, album) => {
              map[album.placeId] = [album].concat(
                map[album.placeId] ? map[album.placeId] : []
              );
              return map;
            }, {});

          setAlbums(albums);
        });
    });
  }, []);

  const updateRenderablePlaces = () => {
    const mapCenter = mapRef?.getCenter();
    if (!mapCenter) return;

    let closestDestination: Destination;
    let closestDestinationDistance: number = Infinity;
    destinations.forEach((obj) => {
      var distance = getDistanceBetweenTwoPoints(
        obj.latitude,
        obj.longitude,
        mapCenter.lat,
        mapCenter.lng
      );
      if (distance < closestDestinationDistance) {
        closestDestination = obj;
        closestDestinationDistance = distance;
      }
    });

    if (
      closestDestinationDistance <= DISTANCE_FROM_CITY &&
      places &&
      closestDestination!.placeId in places
    ) {
      setRenderablePlaces(places[closestDestination!.placeId]);
    } else {
      setRenderablePlaces([]);
    }
  };

  //Gallery Functions
  const toggleGallery = (value) => {
    console.log(value);
    const boolean = typeof value === "boolean" ? value : !galleryOpen;
    setGalleryOpen(boolean);
  };

  const galleryOnClick = (event, obj) => {
    setGalleryOpen(false);
    setCurrImg(obj.index);
    setImageViewerOpen(true);
  };

  //Image Viewer Functions
  const toggleViewer = (value) => {
    const boolean = typeof value === "boolean" ? value : imageViewerOpen;
    setImageViewerOpen(boolean);
    setGalleryOpen(boolean ? false : true);
  };

  return (
    <div style={{ height: height }} className={classes.background}>
      <div style={{ height: window.innerHeight / 20 }}></div>

      <Paper elevation={24} className={clsx(classes.main)}>
        <Map
          destinations={destinations}
          places={places}
          renderablePlaces={renderablePlaces}
          hoverId={hoverId}
          setHoverId={setHoverId}
          setMapRef={setMapRef}
          mapGranularity={mapGranularity}
          setMapGranularity={setMapGranularity}
          updateRenderablePlaces={updateRenderablePlaces}
          colorMap={colorMap}
          setPreparedImages={setPreparedImages}
          setGalleryOpen={setGalleryOpen}
        />
        <VirtualTable
          destinations={destinations}
          renderablePlaces={renderablePlaces}
          isLoadingUserData={false}
          hoverId={hoverId}
          setHoverId={setHoverId}
          mapRef={mapRef}
          mapGranularity={mapGranularity}
          setPreparedImages={setPreparedImages}
          setGalleryOpen={setGalleryOpen}
        />
      </Paper>

      <Modal
        open={galleryOpen}
        onClose={toggleGallery}
        className={classes.modal}
      >
        {preparedImages.length > 0 ? (
          <Gallery photos={preparedImages} onClick={galleryOnClick} />
        ) : (
          <div className={clsx(classes.noImages)}>No Images...</div>
        )}
      </Modal>

      {imageViewerOpen ? (
        <ImageViewer
          isOpen={imageViewerOpen}
          toggleViewer={toggleViewer}
          toggleGallery={toggleGallery}
          views={preparedImages}
          currentIndex={currImg}
        />
      ) : null}
    </div>
  );
}
