import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

// Button Component Reusable

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}{" "}
    </button>
  );
}

function App() {
  const [showAddFriend, setShowAddFreind] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFreind, setSelectedFreind] = useState(null);

  function handleToogle() {
    setShowAddFreind((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFreind(false);
  }

  function handleSelection(friend) {
    setSelectedFreind(friend);
    setSelectedFreind(selectedFreind?.id === friend.id ? null : friend);
    setShowAddFreind(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFreind={selectedFreind}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFreind onAddFreind={handleAddFriend} />}

        <Button onClick={handleToogle}>
          {showAddFriend ? "Close" : "Add Freind"}
        </Button>
      </div>
      {selectedFreind && <FormSplitBill selectedFreind={selectedFreind} />}
    </div>
  );
}

// Freind List parent

function FriendList({ friends, onSelection, selectedFreind }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFreind={selectedFreind}
        />
      ))}
    </ul>
  );
}

// Friend list

function Friend({ friend, onSelection, selectedFreind }) {
  const isSelected = selectedFreind?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

// Add Friend Form

function FormAddFreind({ onAddFreind }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !img) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name: name,
      image: `${img}?=${id}`,
      balance: 0,
      id: id,
    };

    onAddFreind(newFriend);

    setName("");
    setImg("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />

      <Button>Add</Button>
    </form>
  );
}

// Form Split bill

function FormSplitBill({ selectedFreind }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [WhoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend = bill ? bill - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFreind.name}</h2>

      <label>💸 Bill value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍 Your expense</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value),
          )
        }
      />

      <label>🧑‍🤝‍🧑 {selectedFreind.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>Who is paying the bill</label>
      <select
        value={WhoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFreind.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
