import React from "react";
import Gallery from "react-photo-gallery";
import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import RingLoader from "react-spinners/RingLoader";
import { PropTypes } from "prop-types";

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

import { DEFAULT_CENTER, GRANULARITY_CUTOFF } from "../utils/Constants";

const styles = (theme) => ({
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
});

const theme = {
  navBarBackgroundColor: OFF_BLACK_1,
  logoColor: ICE_BLUE,
  menuBackgroundColor: OFF_BLACK_2,
  cardBackgroundColor: ICE_BLUE,
  iconFillColor: OFF_BLACK_1,
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      destinations: [],
      places: {},
      albums: {},
      photos: {},
      ready: false,

      //General
      selectedCity: null,
      selectedPlace: null,
      hoverIndexCity: null,
      hoverIndexPlace: null,

      //view
      viewUser: "",
      viewCities: [],
      viewPlaces: [],

      //Map
      granularity: 1,
      mapZoom: 4,
      mapCenter: {
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng,
      },
      closestCity: null,

      //Gallery
      galleryOpen: false,
      preparedImages: [],

      //ImageViewer
      imageViewerOpen: false,
      currImg: null,
    };
  }

  componentDidMount() {
    //Retrieve Destinations
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

          this.setState({
            destinations: destinations,
            ready: true,
          });
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

          this.setState({
            places: result,
          });
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

          this.setState({
            photos: photoMapping,
          });
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

          this.setState({
            albums: albumMapping,
          });
        });
    });
  }

  changeHoverIndexCity = (index) => {
    this.setState({
      hoverIndexCity: index,
    });
  };

  changeHoverIndexPlace = (index) => {
    this.setState({
      hoverIndexPlace: index,
    });
  };

  setClosestCity = (destinations, centerLat, centerLong) => {
    var lowest = 99999999,
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
      ...destinations[lowestIndex],
      distanceFromMapCenter: lowest,
    };

    this.setState({
      closestCity: closestCity,
    });

    return closestCity;
  };

  //Map Functions
  changeGranularity = (zoom) => {
    this.setState({
      granularity: zoom > GRANULARITY_CUTOFF ? 0 : 1,
      mapZoom: zoom,
    });
  };

  changeMapCenter = (obj) => {
    this.setState({
      mapCenter: {
        lat: obj.latitude,
        lng: obj.longitude,
      },
    });
  };

  onMarkerClick = (obj) => {
    const photos = this.state.photos;
    if (this.state.granularity === 1) {
      this.changeMapCenter(obj);
      this.changeGranularity(GRANULARITY_CUTOFF + 1);
      this.changeHoverIndexCity(null);
      this.setState({
        selectedCity: obj,
      });
    } else if (this.state.granularity === 0) {
      this.setState({
        selectedPlace: obj,
        preparedImages: obj.place_id in photos ? photos[obj.place_id] : [],
        galleryOpen: true,
      });
    }
  };

  //Table Functions
  tableRowClick = (obj, e) => {
    const data = obj.rowData;
    const photos = this.state.photos;
    if (this.state.granularity === 1) {
      this.setState({
        selectedCity: obj.rowData,
        //The kill attribute make sure that an icon within the row isn't being clicked
        mapZoom:
          obj.event.target.getAttribute("value") !== "KILL"
            ? 12
            : this.state.mapZoom,
        granularity: 1,
        hoverIndexCity: null,
      });
    } else if (this.state.granularity === 0) {
      this.setState({
        selectedPlace: data,
        preparedImages: data.place_id in photos ? photos[data.place_id] : [],
        //The kill attribute make sure that an icon within the row isn't being clicked
        galleryOpen:
          obj.event.target.getAttribute("value") !== "KILL" ? true : false,
      });
    }
  };

  cityGallery = (obj) => {
    const places = this.state.places[obj.destination_id];
    var photos = [];
    if (places) {
      places.forEach((place) => {
        var tmp = this.state.photos[place.place_id]
          ? this.state.photos[place.place_id]
          : [];
        photos = photos.concat(tmp);
      });
    }

    this.setState({
      preparedImages: photos,
      galleryOpen: true,
    });
  };

  //Gallery Functions
  toggleGallery = (value) => {
    const boolean =
      typeof value === "boolean" ? value : !this.state.galleryOpen;
    this.setState({
      galleryOpen: boolean,
    });
  };

  galleryOnClick = (event, obj) => {
    this.setState({
      galleryOpen: false,
      currImg: obj.index,
      imageViewerOpen: true,
    });
  };

  //Image Viewer Functions
  toggleViewer = (value) => {
    const boolean =
      typeof value === "boolean" ? value : !this.state.imageViewerOpen;
    this.setState({
      imageViewerOpen: boolean,
      galleryOpen: boolean ? false : true,
    });
  };

  render() {
    const classes = this.props.classes;
    var destinations = this.state.destinations;
    var places = this.state.places;
    var albums = this.state.albums;
    const photos = this.state.photos;

    if (this.state.ready) {
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
                  [
                    ...new Set(
                      this.state.destinations.map((el) => el.country_code)
                    ),
                  ].length
                } Countries`}</p>
                <p className={clsx(classes.factLine)}>{`${
                  this.state.destinations.filter((el) => el.type === "C").length
                } Cities`}</p>
                <p className={clsx(classes.factLine)}>{`${
                  this.state.destinations.filter((el) => el.type === "NP")
                    .length
                } National Parks`}</p>
              </div>
            </div>

            <div className={clsx(classes.main)}>
              <Map
                center={this.state.mapCenter}
                zoom={this.state.mapZoom}
                destinations={destinations}
                places={places}
                hoverIndex={
                  this.state.granularity
                    ? this.state.hoverIndexCity
                    : this.state.hoverIndexPlace
                }
                changeHoverIndex={
                  this.state.granularity
                    ? this.changeHoverIndexCity
                    : this.changeHoverIndexPlace
                }
                closestCity={this.state.closestCity}
                setClosestCity={this.setClosestCity}
                markerClick={this.onMarkerClick}
                granularity={this.state.granularity}
                changeMapCenter={this.changeMapCenter}
                changeGranularity={this.changeGranularity}
              />

              <Table
                cities={destinations}
                places={places}
                albums={albums}
                photos={photos}
                hoverIndex={
                  this.state.granularity
                    ? this.state.hoverIndexCity
                    : this.state.hoverIndexPlace
                }
                changeHoverIndex={
                  this.state.granularity
                    ? this.changeHoverIndexCity
                    : this.changeHoverIndexPlace
                }
                tableRowClick={this.tableRowClick}
                granularity={this.state.granularity}
                selectedCity={this.state.selectedCity}
                closestCity={this.state.closestCity}
                mapCenter={this.state.mapCenter}
                changeMapCenter={this.changeMapCenter}
                onCityGalleryClick={this.cityGallery}
                place_colors={place_colors}
                city_colors={city_colors}
              />
            </div>

            <Modal
              open={this.state.galleryOpen}
              onClose={this.toggleGallery}
              className={classes.modal}
            >
              {this.state.preparedImages.length > 0 ? (
                <Gallery
                  photos={this.state.preparedImages}
                  onClick={this.galleryOnClick}
                />
              ) : (
                <div className={clsx(classes.noImages)}>No Images...</div>
              )}
            </Modal>

            {this.state.imageViewerOpen ? (
              <ImageViewer
                isOpen={this.state.imageViewerOpen}
                toggleViewer={this.toggleViewer}
                toggleGallery={this.toggleGallery}
                views={this.state.preparedImages}
                currentIndex={this.state.currImg}
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
}

Main.propTypes = {
  destinations: PropTypes.array,
  places: PropTypes.array,
  ready: PropTypes.bool,
};

export default withStyles(styles)(Main);
