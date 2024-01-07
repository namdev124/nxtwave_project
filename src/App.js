import React, { useState, useEffect } from 'react';
import LoadingView from './components/LoadingView';
import FailureView from './components/FailureView';
import ListCreationView from './components/ListCreationView';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [lists, setLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState([]);
  const [selectAllList1, setSelectAllList1] = useState(false);
  const [selectAllList2, setSelectAllList2] = useState(false);
  const [creatingList, setCreatingList] = useState(false);
  const [newListNumber, setNewListNumber] = useState(null);
  const [selectedNewList, setSelectedNewList] = useState([]);

  const fetchLists = async () => {
    try {
      const response = await fetch('https://apis.ccbp.in/list-creation/lists');
      const data = await response.json();
      setLists(data.lists);
      setLoading(false);
    } catch (error) {
      setErrorState('Failed to fetch lists. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateNewList = (listNumber) => {
    if (
      (selectedLists.length !== 2 && !selectAllList1 && !selectAllList2) ||
      (selectAllList1 && selectAllList2)
    ) {
      setErrorState(
        'You should select exactly 2 individual lists to create a new list'
      );
    } else {
      setCreatingList(true);
      setNewListNumber(listNumber);
      setSelectedNewList([]);
    }
  };

  const handleCancelCreation = () => {
    setCreatingList(false);
    setSelectedLists([]);
    setSelectAllList1(false);
    setSelectAllList2(false);
    setSelectedNewList([]);
    setErrorState(null);
    setNewListNumber(null);
  };

  const handleUpdateLists = (updatedLists) => {
    setLists(updatedLists);
    setCreatingList(false);
    setSelectedLists([]);
    setSelectAllList1(false);
    setSelectAllList2(false);
    setSelectedNewList([]);
    setErrorState(null);
    setNewListNumber(null);
  };

  const handleListSelection = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists((prevSelectedLists) =>
        prevSelectedLists.filter((id) => id !== listId)
      );
    } else {
      setSelectedLists((prevSelectedLists) => [...prevSelectedLists, listId]);
    }
  };

  const handleSelectAllList1 = () => {
    setSelectAllList1(!selectAllList1);
    setSelectedLists([]);
  };

  const handleSelectAllList2 = () => {
    setSelectAllList2(!selectAllList2);
    setSelectedLists([]);
  };

  const handleMoveItemRight = (list) => {
    const updatedLists = lists.map((l) => {
      if (l.id === list.id) {
        const updatedItems = l.items ? [...l.items, list.name] : [list.name];
        return { ...l, list_number: newListNumber, items: updatedItems };
      }
      return l;
    });
    setLists(updatedLists);
  };
  
  const handleMoveItemLeft = (list) => {
    const updatedLists = lists.map((l) => {
      if (l.id === list.id) {
        const updatedItems = l.items ? [...l.items, list.name] : [list.name];
        return { ...l, list_number: newListNumber, items: updatedItems };
      }
      return l;
    });
    setLists(updatedLists);
  };
  
  
  

  if (loading) {
    return <LoadingView />;
  }

  if (errorState) {
    return <FailureView error={errorState} onTryAgain={fetchLists} />;
  }

  if (creatingList) {
    return (
      <ListCreationView
        selectedLists={selectedLists}
        selectedNewList={selectedNewList}
        lists={lists}
        onCancel={handleCancelCreation}
        onUpdate={handleUpdateLists}
        newListNumber={newListNumber}
      />
    );
  }

  const list1Items = lists.filter((list) => list.list_number === 1);
  const list2Items = lists.filter((list) => list.list_number === 2);

  return (
    <div className="main-app-view">
      <div className="lists-container">
        <div className="list-column">
          <h2>
            <input
              type="checkbox"
              checked={selectAllList1}
              onChange={handleSelectAllList1}
            />
            {' '}List 1
          </h2>
          <ul>
            {list1Items.map((list) => (
              <li
                key={list.id}
                onClick={() => handleListSelection(list.id)}
                className={selectedLists.includes(list.id) ? 'selected' : ''}
              >
                {list.name}{' '}
                <span onClick={() => handleMoveItemRight(list)}>{'>'}</span>
              </li>
            ))}
          </ul>
          <p>Total Items: {list1Items.length}</p>
        </div>

        <div className="list-column">
          <h2>
            <input
              type="checkbox"
              checked={selectAllList2}
              onChange={handleSelectAllList2}
            />
            {' '}List 2
          </h2>
          <ul>
            {list2Items.map((list) => (
              <li
                key={list.id}
                onClick={() => handleListSelection(list.id)}
                className={selectedLists.includes(list.id) ? 'selected' : ''}
              >
                <span onClick={() => handleMoveItemLeft(list)}>{'<'}</span>{' '}
                {list.name}
              </li>
            ))}
          </ul>
          <p>Total Items: {list2Items.length}</p>
        </div>
      </div>

      {selectedLists.length === 2 && (
        <div className="new-list-buttons">
          <button
            type="button"
            onClick={() => handleCreateNewList(3)}
            disabled={selectedLists.length !== 2}
          >
            Create List 3
          </button>
          <button
            type="button"
            onClick={() => handleCreateNewList(4)}
            disabled={selectedLists.length !== 2}
          >
            Create List 4
          </button>
          <button
            type="button"
            onClick={() => handleCreateNewList(0)} // You can choose any number for a new list
            disabled={selectedLists.length !== 2}
          >
            New List
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
