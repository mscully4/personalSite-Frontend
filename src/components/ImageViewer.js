import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Viewer from 'react-viewer';

class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    var currentIndex = this.props.currentIndex >= this.props.views.length ? 0 : this.props.currentIndex
    return (
      <Viewer
      visible={true}
      activeIndex={currentIndex}
      onClose={() => { this.props.toggleViewer(false); } }
      images={this.props.views}
      downloadable={true}
      rotatable={false}
      drag={false}
      scalable={false}
      />
    )
  }
}

ImageViewer.propTypes = {
  views: PropTypes.array,
  currentIndex: PropTypes.number,
  toggleViewer: PropTypes.func,
  handleDeleteImage: PropTypes.func,
  toggleViewer: PropTypes.func,
  toggleGallery: PropTypes.func,
  owner: PropTypes.bool,
  isOpen: PropTypes.bool,
  requestPending: PropTypes.bool
}

export default ImageViewer;