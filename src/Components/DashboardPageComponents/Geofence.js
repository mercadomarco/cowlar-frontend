import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Draw, Modify } from "ol/interaction";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { toLonLat, fromLonLat } from "ol/proj";
import LineString from "ol/geom/LineString";
import Feature from "ol/Feature";
import Modal from "./Modal";
import "ol/ol.css";
import useGeofence from "../../Hooks/Geofence/useGeofence"; // Import your custom hook

const Geofence = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorSource = useRef(new VectorSource());
  const lineSource = useRef(new VectorSource());
  const [features, setFeatures] = useState([]);
  const [highlightedFeature, setHighlightedFeature] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  const [popupCoords, setPopupCoords] = useState(null);
  const [draw, setDraw] = useState(null);

  // Access addGeofence from the custom hook
  const { addGeofence } = useGeofence();

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({
            source: vectorSource.current,
            style: (feature) => {
              const isHighlighted = feature.getId() === highlightedFeature;
              return new Style({
                image: new CircleStyle({
                  radius: isHighlighted ? 8 : 5,
                  fill: new Fill({ color: isHighlighted ? "red" : "blue" }),
                  stroke: new Stroke({ color: "white", width: 2 }),
                }),
              });
            },
          }),
          new VectorLayer({
            source: lineSource.current,
            style: new Style({
              stroke: new Stroke({
                color: "green",
                width: 2,
              }),
            }),
          }),
        ],
        view: new View({
          center: [13510780.61, 1603044.05],
          zoom: 5,
        }),
      });
    }
  }, [highlightedFeature]);

  const updateLineString = () => {
    const coords = features.map((feature) =>
      fromLonLat([feature.coords[0], feature.coords[1]])
    );
    if (coords.length === 10) {
      coords.push(coords[0]); // Close the loop
    }
    const lineString = new LineString(coords);
    const lineFeature = new Feature(lineString);
    lineSource.current.clear(); // Clear previous lines
    lineSource.current.addFeature(lineFeature);
  };

  useEffect(() => {
    const drawInteraction = new Draw({
      source: vectorSource.current,
      type: "Point",
    });

    drawInteraction.on("drawstart", () => {
      if (vectorSource.current.getFeatures().length >= 10) {
        setIsLimitModalOpen(true);
        drawInteraction.setActive(false);
        return;
      }
    });

    drawInteraction.on("drawend", (event) => {
      if (vectorSource.current.getFeatures().length < 10) {
        const newFeature = event.feature;
        const coords = toLonLat(newFeature.getGeometry().getCoordinates());
        const featureId = Date.now();
        newFeature.setId(featureId);
        setFeatures((prevFeatures) => [
          ...prevFeatures,
          { id: featureId, coords },
        ]);
        setHighlightedFeature(featureId);
      }
    });

    mapInstance.current.addInteraction(drawInteraction);
    setDraw(drawInteraction);

    return () => {
      mapInstance.current.removeInteraction(drawInteraction);
    };
  }, []);

  useEffect(() => {
    const modify = new Modify({ source: vectorSource.current });
    modify.on("modifyend", (event) => {
      const modifiedFeature = event.features.getArray()[0];
      const coords = toLonLat(modifiedFeature.getGeometry().getCoordinates());
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
          feature.id === modifiedFeature.getId()
            ? { ...feature, coords }
            : feature
        )
      );
    });

    mapInstance.current.addInteraction(modify);
    return () => mapInstance.current.removeInteraction(modify);
  }, []);

  useEffect(() => {
    const handleDoubleClick = (event) => {
      mapInstance.current.forEachFeatureAtPixel(event.pixel, (feature) => {
        const featureId = feature.getId();
        setHighlightedFeature(featureId);
        setFeatureToDelete(featureId);
        setIsDeleteModalOpen(true);
      });
    };

    if (mapInstance.current) {
      mapInstance.current.on("dblclick", handleDoubleClick);
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.un("dblclick", handleDoubleClick);
      }
    };
  }, []);

  const handleDeleteConfirmation = () => {
    if (featureToDelete) {
      const feature = vectorSource.current.getFeatureById(featureToDelete);
      if (feature) {
        vectorSource.current.removeFeature(feature);
        setFeatures((prevFeatures) =>
          prevFeatures.filter((f) => f.id !== featureToDelete)
        );
        setHighlightedFeature(null);
        if (vectorSource.current.getFeatures().length < 10) {
          draw.setActive(true);
        }
      }
    }
    setIsDeleteModalOpen(false);
  };

  const handleLimitModalClose = () => {
    setIsLimitModalOpen(false);
  };

  useEffect(() => {
    updateLineString(); // Update the LineString whenever features change
  }, [features]);

  useEffect(() => {
    const handleSingleClick = (event) => {
      mapInstance.current.forEachFeatureAtPixel(event.pixel, (feature) => {
        const featureId = feature.getId();
        setHighlightedFeature(featureId);
        const coords = toLonLat(feature.getGeometry().getCoordinates());
        setPopupCoords(coords);
      });
    };

    if (mapInstance.current) {
      mapInstance.current.on("singleclick", handleSingleClick);
    }
    return () => {
      if (mapInstance.current) {
        mapInstance.current.un("singleclick", handleSingleClick);
      }
    };
  }, []);

  // Call this function when you're ready to save the geofence data
  const handleSaveGeofence = async () => {
    // Ensure the features array has been populated correctly and boundaryCoordinates is assigned
    const boundaryCoordinates = features.map((feature) => ({
      latitude: feature.coords[1],
      longitude: feature.coords[0],
    }));
  
    // Log the boundaryCoordinates for debugging
    // console.log("Boundary Coordinates:", boundaryCoordinates);
  
    try {
  
      // Call the addGeofence function from the hook with correct payload
      await addGeofence(boundaryCoordinates);
  
      // Reset features after saving (optional)
      setFeatures([]);
    } catch (error) {
      console.error("Error saving geofence:", error);
    }
  };
  
  return (
    <Container>
      <Header>
        <Title>Geofence</Title>
      </Header>

      <InteractiveMap>
        <StyledMapContainer ref={mapRef} />
        {popupCoords && (
          <Popup
            style={{
              left: `${popupCoords[0]}px`,
              top: `${popupCoords[1]}px`,
            }}
          >
            Longitude: {popupCoords[0].toFixed(6)}, Latitude:{" "}
            {popupCoords[1].toFixed(6)}
          </Popup>
        )}
      </InteractiveMap>

      <PostList>
        <h2>Geofence Posts</h2>
        {features.map((feature, index) => (
          <p key={feature.id}>
            Post {index + 1}: Longitude: {feature.coords[0].toFixed(6)},
            Latitude: {feature.coords[1].toFixed(6)}
          </p>
        ))}
      </PostList>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmation}
      />

      <Modal
        isOpen={isLimitModalOpen}
        onClose={handleLimitModalClose}
        onConfirm={handleLimitModalClose}
      >
        <h2>Limit Reached</h2>
        <p>
          You can only add up to 10 posts. Please delete an existing post to
          create a new one.
        </p>
      </Modal>

      {/* Button to save geofence */}
      <SaveButton onClick={handleSaveGeofence}>Save Geofence</SaveButton>
    </Container>
  );
};

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const Popup = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  margin-top: 30px;
  overflow-y: auto;
  font-family: "Poppins", sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const InteractiveMap = styled.div`
  margin-top: 20px;
  position: relative;
`;

const StyledMapContainer = styled.div`
  width: 100%;
  height: 400px;
`;

const PostList = styled.div`
  margin-top: 20px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
`;

export default Geofence;
