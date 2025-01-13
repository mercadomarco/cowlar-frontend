// ...other imports
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Circles } from "react-loader-spinner";
import useCows from "../../Hooks/Cows/useCows";
import useCollars from "../../Hooks/Collars/useCollars";

const Cows = () => {
  const { cows, unassociatedCows, loading, error, addCow } = useCows();
  const { addCollar } = useCollars();
  const [isAddCowModalOpen, setIsAddCowModalOpen] = useState(false);
  const [isCollarModalOpen, setIsCollarModalOpen] = useState(false);
  const [newCow, setNewCow] = useState({
    name: "",
    breed: "",
    age: "",
    birthday: "",
  });
  const [collarData, setCollarData] = useState({
    cowId: "",
    collarId: "",
  });
  const [addError, setAddError] = useState(null);
  const [collarError, setCollarError] = useState(null);

  // Fetch cows for the dropdown
  useEffect(() => {
    if (!loading) {
      setCollarData((prev) => ({
        ...prev,
        cowId: cows.length > 0 ? cows[0].cow_id : "",
      }));
    }
  }, [cows, loading]);

  if (loading) {
    return (
      <LoaderContainer>
        <Circles
          height="40"
          width="40"
          color="#121481"
          ariaLabel="circles-loading"
          visible={true}
        />
      </LoaderContainer>
    );
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  const handleAddCow = async (e) => {
    e.preventDefault();
    setAddError(null);

    // Input validation
    if (!newCow.name || !newCow.breed || !newCow.age || !newCow.birthday) {
      setAddError("All fields are required.");
      return;
    }

    try {
      await addCow(newCow.name, newCow.breed, newCow.age, newCow.birthday);
      setNewCow({ name: "", breed: "", age: "", birthday: "" });
      setIsAddCowModalOpen(false);
    } catch (err) {
      setAddError(err.message);
    }
  };

  const handleAddCollar = async (e) => {
    e.preventDefault();

    // Call the addCollar function with cowId and collarId
    try {
      await addCollar(collarData.cowId, collarData.collarId);
      setCollarData({ cowId: "", collarId: "" }); // Reset the form
    } catch (err) {
      // Handle any error
      setCollarError("Error adding collar: " + err.message);
    }
  };

  return (
    <Container>
      <Header>
        <Title>My Cows</Title>
        <ButtonGroup>
          <AddCowButton onClick={() => setIsAddCowModalOpen(true)}>
            Add Cow
          </AddCowButton>
          <AddCollarButton
            onClick={() => setIsCollarModalOpen(true)}
            disabled={unassociatedCows.length === 0} // Disable button if no unassociated cows
          >
            Link Collar
          </AddCollarButton>
        </ButtonGroup>
      </Header>

      {/* Show message if no unassociated cows */}
      {unassociatedCows.length === 0 && (
        <NoCowsMessage>No unassociated cows available to link a collar.</NoCowsMessage>
      )}

      {/* Modal for adding a new cow */}
      {isAddCowModalOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Add Cow</ModalTitle>
              <CloseButton onClick={() => setIsAddCowModalOpen(false)}>
                X
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <AddCowForm onSubmit={handleAddCow}>
                <Input
                  type="text"
                  placeholder="Name"
                  value={newCow.name}
                  onChange={(e) =>
                    setNewCow({ ...newCow, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="text"
                  placeholder="Breed"
                  value={newCow.breed}
                  onChange={(e) =>
                    setNewCow({ ...newCow, breed: e.target.value })
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Age"
                  value={newCow.age}
                  onChange={(e) =>
                    setNewCow({ ...newCow, age: e.target.value })
                  }
                  required
                />
                <Input
                  type="date"
                  placeholder="Birthday"
                  value={newCow.birthday}
                  onChange={(e) =>
                    setNewCow({ ...newCow, birthday: e.target.value })
                  }
                  required
                />
                <SubmitButton type="submit">Add Cow</SubmitButton>
                {addError && <ErrorMessage>Error: {addError}</ErrorMessage>}
              </AddCowForm>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {/* Modal for adding a collar */}
      {isCollarModalOpen && (
        <ModalOverlay>
          <Modal>
            <ModalHeader>
              <ModalTitle>Add Collar to Cow</ModalTitle>
              <CloseButton onClick={() => setIsCollarModalOpen(false)}>
                X
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <AddCollarForm onSubmit={handleAddCollar}>
                <label htmlFor="cowId">Cow:</label>
                <Select
                  id="cowId"
                  onChange={(e) => {
                    const selectedCowId = e.target.value; // This gets the selected cow's ID
                    console.log("Selected Cow ID:", selectedCowId); // Log the selected cow ID for verification
                    setCollarData({
                      ...collarData,
                      cowId: selectedCowId, // Update the state with the selected cow's ID
                    });
                  }}
                >
                  <option value="" disabled>
                    Select a cow
                  </option>
                  {unassociatedCows.map((cow) => (
                    <option key={cow.cowId} value={cow.cowId}>
                      {cow.name}{" "}
                      {/* Display cow's name, and value is the cow_id */}
                    </option>
                  ))}
                </Select>

                <label htmlFor="collarId">Collar ID:</label>
                <Input
                  id="collarId"
                  type="text"
                  placeholder="Enter collar Id"
                  value={collarData.collarId} // This is where you manage collarId in the state
                  onChange={(e) =>
                    setCollarData({
                      ...collarData,
                      collarId: e.target.value, // Update collarId from the input field
                    })
                  }
                  required
                />

                <SubmitButton type="submit">Add Collar</SubmitButton>

                {collarError && (
                  <ErrorMessage>Error: {collarError}</ErrorMessage>
                )}
              </AddCollarForm>
            </ModalBody>
          </Modal>
        </ModalOverlay>
      )}

      {/* Display cows or no cows message */}
      {cows.length === 0 ? (
        <NoCowsMessage>No cows available</NoCowsMessage>
      ) : (
        <CowsList>
          {cows.map((cow) => (
            <CowItem key={cow.cow_id}>
              <p>Name: {cow.name}</p>
              <p>Breed: {cow.breed}</p>
              <p>Age: {cow.age}</p>
              <p>Birthday: {cow.birthday}</p>
              <p>Associated: {cow.associated}</p>
            </CowItem>
          ))}
        </CowsList>
      )}
    </Container>
  );
};


export default Cows;

// Styled components for the layout and design
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const AddCowButton = styled.button`
  background-color: #121481;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0f1a6d;
  }
`;

const AddCollarButton = styled.button`
  background-color: #121481;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0f1a6d;
  }

  &:disabled {
    background-color: #d3d3d3; /* Gray color when disabled */
    cursor: not-allowed; /* Change cursor when disabled */
  }
`;



const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin-top: 10px;
`;

const AddCowForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const AddCollarForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  background-color: #121481;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0f1a6d;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const NoCowsMessage = styled.div`
  text-align: center;
  font-size: 1.5em;
  color: #777;
`;

const CowsList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const CowItem = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 96%; /* Ensures full width */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;
