const http = require("http");
let users = [
  { Id: "1", Name: "ahmed", age: 18, followers: 404 },
  { Id: "2", Name: "ahmed", age: 18, followers: 404 },
  { Id: "3", Name: "ahmed", age: 18, followers: 404 },
  { Id: "4", Name: "ahmed", age: 18, followers: 404 },
];
const Server = http.createServer((req, res) => {
  const sendResponse=(code,message)=>{
    res.statusCode = code;
    res.end(JSON.stringify(message));
  }
  if (req.url == "/users" && req.method == "GET") {
    sendResponse(200,users);
  } else if (req.url == "/addUser" && req.method == "POST") {
    req.on("data", (chunk) => {
      let user = JSON.parse(chunk);
      user.Id = users.length + 1;
      users.push(JSON.parse(user));
      sendResponse(201,res.end(JSON.stringify({"Message":"User added Sucssefuly"})));
    });
    res.end(JSON.stringify({ Message: "Success" }));
  } else if (req.url.startsWith("/updateUser/") && req.method == "PUT") {
    let UserId = Number(req.url.split("/")[2]);
    let index = users.findIndex((user) => user.Id == UserId);
    req.on("data", (chunk) => {
      if (index != -1) {
        sendResponse(201,res.end(JSON.stringify({"Message":"User Updated Sucssefuly"})));
        let user = JSON.stringify(chunk);
        users[index].Name = user.Name;
        users[index].age = user.age;
        users[index].followers = user.followers;
      } else if (index == -1) {
        sendResponse(404,res.end(JSON.stringify({"Message":"User Not Found"})));
      }
    });
  } else if (req.url.startsWith("/deleteUser/") && req.method == "DELETE") {
    let UserId = Number(req.url.split("/")[2]);
    let index = users.findIndex((user) => user.Id == UserId);
    if(index == -1){
      sendResponse(404,res.end(JSON.stringify({"Message":"User Not Found"})));
    }
    else {
      users.splice(index,1);
      sendResponse(200,res.end(JSON.stringify({"Message":"User Deleted Succefully"})));
    }
  }else {
    sendResponse(404,res.end(JSON.stringify({"Message":"User Not Found"})));
  }
});
Server.listen(3000, () => {
  console.log("Server Is Running");
});
