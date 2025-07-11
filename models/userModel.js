// Fake data to simulate DB
const users = [
    { id: 1, name: "Alice", age: 30, address: "123 Main St", phone: "123-456-7890" },
    { id: 2, name: "Bob", age: 25, address: "456 Elm St", phone: "987-654-3210" },
    { id: 3, name: "Charlie", age: 35, address: "789 Oak St", phone: "555-555-5555" },
    { id: 4, name: "David", age: 28, address: "321 Pine St", phone: "444-444-4444" },
    { id: 5, name: "Eve", age: 22, address: "654 Maple St", phone: "333-333-3333" }
  ];
  
  exports.getAllUsers = () => {
    return users;
  };

exports.getUserById = (id) => {
    return users.find(user => user.id === id);
}
  