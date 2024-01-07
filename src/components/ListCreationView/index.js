import React, { useState } from 'react';

const ListItem = ({ item, onMoveLeft, onMoveRight }) => {
  return (
    <div className="list-item">
      <span>{item}</span>
      <div className="list-item-actions">
        <button onClick={onMoveLeft}>{'<'}</button>
        <button onClick={onMoveRight}>{'>'}</button>
      </div>
    </div>
  );
};

const ListCreationView = ({ selectedLists, lists, onCancel, onUpdate, newListNumber }) => {
  const [newList, setNewList] = useState([]);

  const handleMoveItemLeft = (item) => {
    // Move the item from new list to List 1
    setNewList((prevNewList) => prevNewList.filter((newItem) => newItem !== item));
  };

  const handleMoveItemRight = (item) => {
    // Move the item from List 1 or List 2 to new list
    const sourceList = lists.find((list) => list.items.includes(item));

    // Check if the item is from List 1 or List 2
    if (sourceList.list_number === newListNumber) {
      // Move the item from the new list to List 1
      setNewList((prevNewList) => prevNewList.filter((newItem) => newItem !== item));
    } else {
      // Move the item from List 1 or List 2 to the new list
      setNewList((prevNewList) => [...prevNewList, item]);
    }
  };

  const handleCancel = () => {
    setNewList([]);
    onCancel();
  };

  const handleUpdate = () => {
    const updatedLists = [
      ...lists,
      { id: Date.now(), list_number: newListNumber, name: 'New List', items: newList },
    ];
    onUpdate(updatedLists);
  };

  // Filter items based on list_number
  const listItems = lists.filter((list) => list.list_number === newListNumber);

  return (
    <div className="list-creation-container">
      <h2>List Creation</h2>
      <div className="lists-container">
        {newListNumber && (
          <div className="list">
            <h3>New List ({listItems.length} items)</h3>
            {listItems.map((list) => (
              <ListItem
                key={list.id}
                item={list.name}
                onMoveRight={() => handleMoveItemRight(list)}
                onMoveLeft={() => handleMoveItemLeft(list)}
              />
            ))}
          </div>
        )}
        <div className="arrow">{'>>'}</div>
        <div className="new-list">
          {newList.map((item, index) => (
            <ListItem
              key={index}
              item={item}
              onMoveLeft={() => handleMoveItemLeft(item)}
            />
          ))}
        </div>
        <div className="arrow">{'<<'}</div>
      </div>
      <div className="buttons">
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default ListCreationView;
