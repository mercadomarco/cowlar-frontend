import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Draw } from "ol/interaction";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { toLonLat, fromLonLat } from "ol/proj";
import LineString from "ol/geom/LineString";
import Feature from "ol/Feature";
import useGeofence from "../../Hooks/Geofence/useGeofence";
import "ol/ol.css";

const Geofence = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorSource = useRef(new VectorSource());
  const lineSource = useRef(new VectorSource());
  const [geofences, setGeofences] = useState([]);
  const [fetched, setFetched] = useState(false); // Track fetched state
  const { loading, error, addGeofence, updateGeofence, deleteGeofence, fetchGeofences } = useGeofence();

  // Fetch existing geofences on mount
  useEffect(() => {
    const fetchData = async () => {
      if (fetched) return;  // If already fetched, skip request

      try {
        const response = await fetchGeofences();
        if (response.geofences && response.geofences.length > 0) {
          setGeofences(response.geofences);
          setFetched(true);  // Mark as fetched
          displayGeofences(response.geofences);  // Display geofences on map
        }
      } catch (err) {
        console.error("Failed to fetch geofences:", err);
      }
    };
    fetchData();
  }, [fetched]);  // Effect depends on the fetched flag

  const displayGeofences = (geofences) => {
    geofences.forEach(geofence => {
      const coordinates = geofence.boundaryCoordinates.map(coord => fromLonLat([coord.longitude, coord.latitude]));
      const lineString = new LineString(coordinates);
      const lineFeature = new Feature(lineString);
      lineSource.current.addFeature(lineFeature);  // Add geofence to map
    });
  };

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({
            source: vectorSource.current,
            style: new Style({
              image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: "blue" }),
                stroke: new Stroke({ color: "white", width: 2 }),
              }),
            }),
          }),
          new VectorLayer({
            source: lineSource.current,
            style: new Style({
              stroke: new Stroke({ color: "green", width: 2 }),
            }),
          }),
        ],
        view: new View({
          center: [13510780.61, 1603044.05],
          zoom: 5,
        }),
      });
    }
  }, []);

  const handleDrawEnd = async (event) => {
    const coordinates = toLonLat(event.feature.getGeometry().getCoordinates());
    if (coordinates.length < 10) {
      alert("A geofence must have at least 10 points.");
      return;
    }
    const farmerId = "exampleFarmerId"; // You can replace this with actual farmerId
    try {
      const response = await addGeofence({ farmerId, boundaryCoordinates: coordinates });
      setGeofences((prev) => [
        ...prev,
        { geofenceId: response.geofenceId, farmerId, boundaryCoordinates: coordinates },
      ]);
    } catch (err) {
      console.error("Failed to add geofence:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGeofence(id);
      setGeofences((prev) => prev.filter((geo) => geo.geofenceId !== id));
    } catch (err) {
      console.error("Failed to delete geofence:", err);
    }
  };

  const handleUpdate = async (geofenceId, updatedCoordinates) => {
    try {
      await updateGeofence({ geofenceId, boundaryCoordinates: updatedCoordinates });
      setGeofences((prev) =>
        prev.map((geo) =>
          geo.geofenceId === geofenceId ? { ...geo, boundaryCoordinates: updatedCoordinates } : geo
        )
      );
    } catch (err) {
      console.error("Failed to update geofence:", err);
    }
  };

  useEffect(() => {
    const drawInteraction = new Draw({
      source: vectorSource.current,
      type: "Point",
    });

    drawInteraction.on("drawend", handleDrawEnd);

    mapInstance.current.addInteraction(drawInteraction);

    return () => mapInstance.current.removeInteraction(drawInteraction);
  }, []);

  return (
    <Container>
      <Header>
        <Title>Geofence Management</Title>
      </Header>
      <InteractiveMap>
        <StyledMapContainer ref={mapRef} />
      </InteractiveMap>
      <GeofenceList>
        <h2>Geofences</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {geofences.length === 0 && <p>No geofences added yet.</p>}
        {geofences.map((geo, index) => (
          <GeofenceItem key={geo.geofenceId}>
            <p>
              Geofence {index + 1}: Latitude and Longitude:{" "}
              {geo.boundaryCoordinates.map((coord, i) => (
                <span key={i}>
                  ({coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}){", "}
                </span>
              ))}
            </p>
            <UpdateButton onClick={() => handleUpdate(geo.geofenceId, geo.boundaryCoordinates)}>
              Update
            </UpdateButton>
            <DeleteButton onClick={() => handleDelete(geo.geofenceId)}>Delete</DeleteButton>
          </GeofenceItem>
        ))}
      </GeofenceList>
    </Container>
  );
};

export default Geofence;

// Styled Components

const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const InteractiveMap = styled.div`
  width: 100%;
  height: 500px;
  margin-bottom: 20px;
`;

const StyledMapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const GeofenceList = styled.div`
  margin-top: 20px;
`;

const GeofenceItem = styled.div`
  margin-bottom: 10px;
`;

const UpdateButton = styled.button`
  background-color: yellow;
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: red;
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  cursor: pointer;
`;
