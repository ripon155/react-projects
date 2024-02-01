import { useState } from 'react';

/* eslint-disable react/prop-types */
const initialItems = [
  { id: 1, description: 'Passports', quantity: 2, packed: false },
  { id: 2, description: 'Socks', quantity: 12, packed: false },
  { id: 3, description: 'Charger', quantity: 1, packed: true }
];

export default function App() {
  const [items, setItems] = useState(initialItems);

  const handleAddItems = (newItem) => {
    setItems([...items, newItem]);
  };

  const removeItem = (deleteItem) => {
    const updateItems = items.filter((item) => item.id !== deleteItem.id);
    setItems(updateItems);
  };

  const handleToggle = (toggleItem) => {
    const toggleItems = items.map((map) => {
      return map.id === toggleItem.id ? { ...toggleItem, packed: !map.packed } : map;
    });
    setItems(toggleItems);
  };

  return (
    <div className='app'>
      <Logo />
      <Form onSubmit={handleAddItems} />
      <PackingList items={items} onRemove={removeItem} onToggle={handleToggle} />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>Todo App</h1>;
}

function Form({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description) return;

    const newItem = { id: Date.now(), description, quantity, packed: false };
    onSubmit(newItem);

    setDescription('');
    setQuantity(1);
  };
  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do your need for your trip!</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type='text'
        placeholder='Item...'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ items, onRemove, onToggle }) {
  const [sortBy, setSortBy] = useState('input');

  let sortedItems;

  if (sortBy === 'input') sortedItems = items;

  if (sortBy === 'description') {
    sortedItems = items.slice().sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortBy === 'packed') {
    sortedItems = items.slice().sort((a, b) => Number(a.packed) - Number(b.packed));
  }

  const renderItem = sortedItems.map((item, index) => {
    return <Item key={index} item={item} onRemove={onRemove} onToggle={onToggle} />;
  });

  return (
    <div style={{ backgroundColor: '#5a3e2b' }}>
      <ul className='list'>{renderItem}</ul>

      <div
        className='actions'
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value='input'> Sort by input order</option>
          <option value='description'> Sort by description</option>
          <option value='packed'> Sort by packed status</option>
        </select>
      </div>
    </div>
  );
}

function Item({ item, onRemove, onToggle }) {
  return (
    <li>
      <input
        type='checkbox'
        checked={item.packed}
        value={item.packed}
        onChange={() => onToggle(item)}
      />
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button style={{ color: 'red' }} onClick={() => onRemove(item)}>
        X
      </button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length) {
    return (
      <footer className='stats'>
        <em>Start adding items to your packing list</em>
      </footer>
    );
  }

  const numPacked = items.filter((item) => item.packed).length;
  const percentages = Math.round((numPacked / items.length) * 100);

  return (
    <footer className='stats'>
      <em>
        {percentages === 100
          ? 'Wants more! lets go '
          : `  you have ${items.length} items on your list and you already packed ${numPacked} (${percentages}
        %)`}
      </em>
    </footer>
  );
}
