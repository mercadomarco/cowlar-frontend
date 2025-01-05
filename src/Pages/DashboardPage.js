import React, { useState } from "react";
import Sidebar from "../Components/DashboardPageComponents/Sidebar";
import styled from "styled-components";
import BirdSpecies from "../Components/DashboardPageComponents/BirdSpecies";
import CommunityChat from "../Components/DashboardPageComponents/CommunityChat";
import ProfileNavbar from "../Components/DashboardPageComponents/profileNavbar";
import UserProfile from "../Components/ProfileComponents/UserProfile";
import EditProfile from "../Components/ProfileComponents/EditProfile"; // Include EditProfile component
import Geofence from "../Components/DashboardPageComponents/Geofence";
import Cows from "../Components/DashboardPageComponents/Cows";
import CowsLocation from "../Components/DashboardPageComponents/CowsLocation";
import History from "../Components/DashboardPageComponents/History";

const Dashboard = () => {
  const [selectedContent, setSelectedContent] = useState("Geofence");

  const renderContent = () => {
    switch (selectedContent) {
      case "Geofence":
        return <Geofence />;
      case "Cows":
        return <Cows />;
      case "CowsLocation":
        return <CowsLocation />;
        case "History":
          return <History />;
      // case "BirdSpecies":
      //   return <BirdSpecies />;
      // case "CommunityChat":
      //   return <CommunityChat />;
      case "UserProfile":
        return <UserProfile onSelectContent={setSelectedContent} />;
      case "EditProfile": // Render EditProfile component here
        return <EditProfile />;
      default:
        return <Geofence />;
    }
  };

  return (
    <DashboardContainer>
      <Sidebar onSelect={setSelectedContent} />
      <Content>
        <ProfileNavbar onSelectContent={setSelectedContent} />
        {renderContent()}
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const Content = styled.div`
  flex-grow: 1;
  margin-left: 240px;
  height: 100vh;
  background-color: #f4f7f9;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;
