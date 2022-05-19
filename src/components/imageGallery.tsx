import Modal from "@material-ui/core/Modal";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Photo from "../types/photo";

const styles = makeStyles((theme: Theme) => ({
  modal: {
    width: "90%",
    margin: "5%",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  imageListItem: {
    cursor: "pointer",
  },
}));

interface ImageGalleryProps {
  galleryOpen: boolean;
  preparedImages: Photo[];
  galleryOnClick: any;
  toggleGallery: any;
}

export default function ImageGallery(props: ImageGalleryProps) {
  const classes = styles();
  return (
    <Modal
      open={props.galleryOpen}
      onClose={props.toggleGallery}
      className={classes.modal}
      style={{
        zIndex: 99999999999,
      }}
    >
      <ImageList variant="masonry" cols={3}>
        {props.preparedImages.map((image, n) => (
          <ImageListItem
            key={image.hash}
            className={classes.imageListItem}
            onClick={(e) => props.galleryOnClick(e, n)}
          >
            <img src={image.src} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </Modal>
  );
}
