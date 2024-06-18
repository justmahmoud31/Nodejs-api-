const http = require("http");
const fs = require('fs');
let users = JSON.parse(fs.readFileSync('./users.json'));
const Server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json');
  const sendResponse = (code, message) => {
    res.statusCode = code;
    res.end(JSON.stringify(message));
  }
  if (req.url === "/users" && req.method === "GET") {
    sendResponse(200, users);
  } else if (req.url === "/addUser" && req.method === "POST") {
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      user.Id = users.length + 1;
      users.push(user);
      fs.writeFile('./users.json', JSON.stringify(users, null, 2), 'utf-8', (err) => {
        if (err) {
          sendResponse(500, { Message: "Error adding user" });
        } else {
          sendResponse(201, { Message: "User added successfully" });
        }
      });
    });
  } else if (req.url.startsWith("/updateUser/") && req.method === "PUT") {
    let userId = Number(req.url.split("/")[2]);
    let index = users.findIndex((user) => user.Id === userId);
    req.on("data", (chunk) => {
      if (index !== -1) {
        let updatedUser = JSON.parse(chunk);
        users[index] = updatedUser;
        fs.writeFile('./users.json', JSON.stringify(users, null, 2), 'utf-8', (err) => {
          if (err) {
            sendResponse(500, { Message: "Error updating user" });
          } else {
            sendResponse(200, { Message: "User updated successfully" });
          }
        });
      } else {
        sendResponse(404, { Message: "User not found" });
      }
    });
  } else if (req.url.startsWith("/deleteUser/") && req.method === "DELETE") {
    let userId = Number(req.url.split("/")[2]);
    let index = users.findIndex((user) => user.Id === userId);

    if (index === -1) {
      sendResponse(404, { Message: "User not found" });
    } else {
      users.splice(index, 1);
      fs.writeFile('./users.json', JSON.stringify(users, null, 2), 'utf-8', (err) => {
        if (err) {
          sendResponse(500, { Message: "Error deleting user" });
        } else {
          sendResponse(200, { Message: "User deleted successfully" });
        }
      });
    }
  } else {
    sendResponse(404, { Message: "Not found" });
  }
});
Server.listen(3000, () => {
  console.log("Server is running");
});

