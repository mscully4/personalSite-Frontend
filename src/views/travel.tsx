import React from "react";
import Gallery from "react-photo-gallery";
import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import RingLoader from "react-spinners/RingLoader";

import Navigation from "../components/Navigation";
import Map from "../components/Map.js";
import Table from "../components/Table.js";
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
import { getDistanceBetweenTwoPoints } from "../utils/Formulas";
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

const styles = makeStyles((theme: Theme) => ({
  page: {
    backgroundColor: OFF_BLACK_5,
    color: FONT_GREY,
    paddingBottom: "10vh",
  },
  main: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "3fr 2fr",
    width: "90vw",
    marginLeft: "7.5vw",
    boxShadow: `0 0 20px ${OFF_BLACK_1}`,
  },
  modalContent: {
    border: "none",
    height: "100%",
    backgroundColor: "transparent",
  },
  infoDiv: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "6fr 4fr",
    height: "20vh",
    alignItems: "center",
  },
  title: {
    color: ICE_BLUE,
    fontFamily: "aguafina-script",
    fontSize: "5vw",
    paddingLeft: "20%",
    margin: 0,
  },
  factDiv: {
    fontSize: "1.5vw",
    color: ICE_BLUE,
  },
  factLine: {
    textIndent: 20,
    margin: 0,
    textAlign: "left",
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
  const [places, setPlaces] = useState({});
  const [photos, setPhotos] = useState({});
  const [albums, setAlbums] = useState({});

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hoverIndexDestination, setHoverIndexDestination] =
    useState<Destination | null>(null);
  const [hoverIndexPlace, setHoverIndexPlace] = useState<Place | null>(null);

  const [granularity, setGranularity] = useState(1);
  const [mapZoom, setMapZoom] = useState(4);
  const [mapCenter, setMapCenter] = useState({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
  });
  const [closestCity, setClosestCity] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [preparedImages, setPreparedImages] = useState([]);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currImg, setCurrImg] = useState(null);

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
        .then((destinations) => {
          destinations.forEach((el, i) => {
            el.index = i;
            el.color =
              city_colors[Math.floor(Math.random() * city_colors.length)];
            el.latitude = parseFloat(el.latitude);
            el.longitude = parseFloat(el.longitude);
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
        .then((places) => {
          places.forEach((place, i) => {
            place.color =
              place_colors[Math.floor(Math.random() * place_colors.length)];
            place.latitude = parseFloat(place.latitude);
            place.longitude = parseFloat(place.longitude);
            place.index = i;
          });

          var result = places.reduce((map, place) => {
            var array = map[place.destination_id]
              ? map[place.destination_id]
              : [];
            array.push(place);
            map[place.destination_id] = array;
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
        .then((photos) => {
          photos.forEach((photo) => {
            photo.src = photo.url;
            photo.width = parseFloat(photo.width);
            photo.height = parseFloat(photo.height);
          });

          const photoMapping = photos.reduce((map, photo) => {
            map[photo.place_id] = [photo].concat(
              map[photo.place_id] ? map[photo.place_id] : []
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
        .then((albums) => {
          const albumMapping = albums.reduce((map, album) => {
            map[album.place_id] = [album].concat(
              map[album.place_id] ? map[album.place_id] : []
            );
            return map;
          }, {});

          console.log(albumMapping);
          setAlbums(albumMapping);
        });
    });
  }, []);

  const changeHoverIndexCity = (index) => {
    setHoverIndexDestination(index);
  };

  const changeHoverIndexPlace = (index) => {
    setHoverIndexPlace(index);
  };

  const setClosestDestination = (destinations, centerLat, centerLong) => {
    let lowest: number = 99999999,
      lowestIndex = null,
      distance;

    if (destinations.length > 0)
      destinations.forEach((obj, i) => {
        distance = getDistanceBetweenTwoPoints(
          centerLat,
          centerLong,
          obj.latitude,
          obj.longitude
        );
        if (distance < lowest) {
          lowest = distance;
          lowestIndex = i;
        }
      });

    const closestCity = {
      ...destinations[lowestIndex!],
      distanceFromMapCenter: lowest,
    };

    setClosestCity(closestCity);

    return closestCity;
  };

  // Map Functions
  const changeGranularity = (zoom) => {
    setGranularity(zoom > GRANULARITY_CUTOFF ? 0 : 1);
    setMapZoom(zoom);
  };

  const changeMapCenter = (obj) => {
    setMapCenter({
      lat: obj.latitude,
      lng: obj.longitude,
    });
  };

  const onMarkerClick = (obj) => {
    if (granularity === 1) {
      changeMapCenter(obj);
      changeGranularity(GRANULARITY_CUTOFF + 1);
      changeHoverIndexCity(null);
      setSelectedDestination(obj);
    } else if (granularity === 0) {
      setSelectedPlace(obj);
      setPreparedImages(obj.place_id in photos ? photos[obj.place_id] : []);
      setGalleryOpen(true);
    }
  };

  //Table Functions
  const tableRowClick = (obj, e) => {
    const data = obj.rowData;
    if (granularity === 1) {
      setSelectedDestination(obj.rowData);
      //The kill attribute make sure that an icon within the row isn't being clicked
      setMapZoom(
        obj.event.target.getAttribute("value") !== "KILL" ? 12 : mapZoom
      );
      setGranularity(1);
      setHoverIndexDestination(null);
    } else if (granularity === 0) {
      setSelectedPlace(data);
      setPreparedImages(data.place_id in photos ? photos[data.place_id] : []);
      //The kill attribute make sure that an icon within the row isn't being clicked
      setGalleryOpen(
        obj.event.target.getAttribute("value") !== "KILL" ? true : false
      );
    }
  };

  const cityGallery = (obj) => {
    const p = places[obj.destination_id];
    var photos = [];
    if (p) {
      p.forEach((place) => {
        var tmp = photos[place.place_id] ? photos[place.place_id] : [];
        photos = photos.concat(tmp);
      });
    }

    setPreparedImages(p);
    setGalleryOpen(true);
  };

  //Gallery Functions
  const toggleGallery = (value) => {
    const boolean = typeof value === "boolean" ? value : galleryOpen;
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

  if (ready) {
    return (
      <div className={clsx(classes.page)}>
        <Navigation theme={theme} />
        <div>
          <div className={clsx(classes.infoDiv)}>
            <p className={clsx(classes.title)}>My Travel Map</p>
            <div className={clsx(classes.factDiv)}>
              <p className={clsx(classes.factLine)} style={{ textIndent: 0 }}>
                {"I've Visited: "}
              </p>
              <p className={clsx(classes.factLine)}>{`${
                [...new Set(destinations.map((el) => el.countryCode))].length
              } Countries`}</p>
              <p className={clsx(classes.factLine)}>{`${
                destinations.filter((el) => el.type === "C").length
              } Cities`}</p>
              <p className={clsx(classes.factLine)}>{`${
                destinations.filter((el) => el.type === "NP").length
              } National Parks`}</p>
            </div>
          </div>

          <div className={clsx(classes.main)}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              destinations={destinations}
              places={places}
              hoverIndex={granularity ? hoverIndexDestination : hoverIndexPlace}
              changeHoverIndex={
                granularity ? changeHoverIndexCity : changeHoverIndexPlace
              }
              closestCity={closestCity}
              setClosestCity={setClosestCity}
              markerClick={onMarkerClick}
              granularity={granularity}
              changeMapCenter={changeMapCenter}
              changeGranularity={changeGranularity}
            />

            <Table
              cities={destinations}
              places={places}
              albums={albums}
              photos={photos}
              hoverIndex={granularity ? hoverIndexDestination : hoverIndexPlace}
              changeHoverIndex={
                granularity ? changeHoverIndexCity : changeHoverIndexPlace
              }
              tableRowClick={tableRowClick}
              granularity={granularity}
              selectedCity={selectedDestination}
              closestCity={closestCity}
              mapCenter={mapCenter}
              changeMapCenter={changeMapCenter}
              onCityGalleryClick={cityGallery}
              place_colors={place_colors}
              city_colors={city_colors}
            />
          </div>

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
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: "#000000",
        }}
      >
        <RingLoader
          color={ICE_BLUE}
          loading={true}
          css={`
            position: absolute;
            left: 0;
            right: 0;
            margin: auto;
            background-color: #000000;
            top: ${(window.innerHeight - 500) / 2.5}px;
          `}
          size={300}
        />
        <p
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            color: ICE_BLUE,
            textAlign: "center",
            fontSize: 50,
            bottom: window.innerHeight * 0.1,
          }}
        >
          Loading
        </p>
      </div>
    );
  }
}
