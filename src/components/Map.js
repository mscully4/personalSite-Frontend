import React, { Component } from "react";
import PropTypes from "prop-types";
import GoogleMapReact from "google-map-react";
import { GOOGLE_MAPS_API_KEY } from "../utils/Constants";

import Marker from "./Marker.js";

const styles = {
  map: {
    width: "100%",
    height: "70vh",
    margin: "auto",
  },
};

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bounds: {},
    };
  }

  onChange = ({ center, zoom, bounds }) => {
    this.props.changeGranularity(zoom);
    this.props.changeMapCenter({ latitude: center.lat, longitude: center.lng });
    this.props.setClosestCity(this.props.destinations, center.lat, center.lng);
    this.setState({
      bounds: bounds,
    });
  };

  createMapOptions = (maps) => {
    return {
      //this controls where and how the zoom control is rendered
      zoomControlOptions: {
        position: maps.ControlPosition.RIGHT_CENTER,
        style: maps.ZoomControlStyle.SMALL,
      },
      //this allows the user to change the type of map that is shown
      mapTypeControl: false,
      //this controls where and how different map options are rendered
      mapTypeControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT,
      },
      gestureHandling: "cooperative",
      keyboardShortcuts: false,
    };
  };

  createMarkers = (granularity) => {
    if (granularity && this.props.destinations) {
      return this.props.destinations.map((data) => (
        <Marker
          key={data.destination_id}
          lat={data.latitude}
          lng={data.longitude}
          data={data}
          changeHoverIndex={this.props.changeHoverIndex}
          hoverIndex={this.props.hoverIndex}
          markerClick={this.props.markerClick}
          zoom={this.props.zoom}
          granularity={this.props.granularity}
        />
      ));
    } else if (!granularity && this.props.places) {
      var closestCityPlaces = this.props.places[this.props.closestCity.place_id]
        ? this.props.places[this.props.closestCity.place_id]
        : [];
      return closestCityPlaces.map((data) => (
        <Marker
          key={data.place_id}
          lat={data.latitude}
          lng={data.longitude}
          data={data}
          changeHoverIndex={this.props.changeHoverIndex}
          hoverIndex={this.props.hoverIndex}
          markerClick={this.props.markerClick}
          zoom={this.props.zoom}
          granularity={this.props.granularity}
        />
      ));
    } else {
      return [];
    }
  };

  render() {
    const markers = this.createMarkers(this.props.granularity);
    return (
      <div style={styles.map}>
        <GoogleMapReact
          center={this.props.center}
          zoom={this.props.zoom}
          keyboardShortcuts={false}
          options={this.createMapOptions}
          onChange={this.onChange}
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
        >
          {markers}
        </GoogleMapReact>
      </div>
    );
  }
}

Map.propTypes = {
  center: PropTypes.object,
  zoom: PropTypes.number,
  places: PropTypes.array,
  destinations: PropTypes.array,
  hoverIndex: PropTypes.number,
  changeHoverIndex: PropTypes.func,
  setClosestCity: PropTypes.func,
  markerClick: PropTypes.func,
  granularity: PropTypes.number,
  changeMapCenter: PropTypes.func,
  changeGranularity: PropTypes.func,
};

export default Map;
