const express = require("express"); // import module express
const app = express(); // untuk mempremudah penulisan, tidak wajib. untuk mengaktifkan/menjalankan fungsi
const fs = require("fs");
const { parse } = require("path");
const { off } = require("process");
const PORT = 2500;

// konfigurasi untuk dapat menerima data req.body dari user/client/front-end
app.use(express.json());

// untuk menerima req dari client
app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to API</h1>");
});

let data = JSON.parse(fs.readFileSync("./db.json"));
// req : untuk handle request dr client

app.get("/users/:idUser", (req, res) => {
  console.log("data dr reqQuery:", req.query);
  console.log("data dr body:", req.body);
  console.log("data dr params:", req.params);
  res.status(200).send({
    id: 1,
    username: "Nakajima",
  });
});

//GET
app.get("/users", (req, res) => {
  const filterData = data.users.filter((val) => {
    let valid = true;
    for (prop in req.query) {
      valid = valid && val[prop] == req.query[prop];
      console.log(valid);
    }
    return valid;
  });
  res.status(200).send(filterData);
});
app.get("/products", (req, res) => {
  const filterData = data.products.filter((val) => {
    let valid = true;
    for (prop in req.query) {
      valid = valid && val[prop] == req.query[prop];
      console.log(valid);
    }
    return valid;
  });
  res.status(200).send(filterData);
});

//POST
app.post("/users", (req, res) => {
  req.body.id = data.users[data.users.length - 1].id + 1;
  data.users.push(req.body);
  console.log(data.users);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).send(data);
});
app.post("/products", (req, res) => {
  req.body.id = data.products[data.products.length - 1].id + 1;
  data.products.push(req.body);
  console.log(data.products);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).send(data);
});

//PUT
app.put("/products/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    console.log(id)
    if(id){
        let idx = data.products.findIndex((val)=>id==val.id);
        req.body.id=parseInt(id)
        data.products[idx]=req.body;
        console.log(data.products)
        fs.writeFileSync('./db.json',JSON.stringify(data))
        res.status(200).send(data);
    }
})
app.put("/users/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    console.log(id)
    if(id){
        let idx = data.users.findIndex((val)=>id==val.id);
        req.body.id=parseInt(id)
        data.users[idx]=req.body;
        console.log(data.users)
        fs.writeFileSync('./db.json',JSON.stringify(data))
        res.status(200).send(data);
    }
})

//PATCH
app.patch("/products/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    if(id){
        let idx = data.products.findIndex(val => id == val.id);
        for(let prop in data.products[idx]){
            for(let reqProp in req.body){
                if(prop == reqProp){
                    data.products[idx][prop]=req.body[reqProp]
                }else{
                    data.products[idx][reqProp]= req.body[reqProp]
                }
            }
        }
        fs.writeFileSync('./db.json',JSON.stringify(data))
        res.status(200).send(data);
    }
})
app.patch("/users/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    if(id){
        let idx = data.users.findIndex(val => id == val.id);
        for(let prop in data.users[idx]){
            for(let reqProp in req.body){
                if(prop == reqProp){
                    data.users[idx][prop]=req.body[reqProp]
                }else{
                    data.users[idx][reqProp]= req.body[reqProp]
                }
            }
        }
        fs.writeFileSync('./db.json',JSON.stringify(data))
        res.status(200).send(data);
    }
})

//DELETE
app.delete("/products/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    let idx = data.products.findIndex(val=> id == val.id);
    if(id){
        data.products.splice(idx,1)
        fs.writeFileSync('./db.json',JSON.stringify(data))
        res.status(200).send(data);
    }
})
app.delete("/users/:id",(req,res)=>{
    let id = parseInt(req.params.id);
    let idx = data.users.findIndex(val=> id == val.id);
    if(id){
        data.users.splice(idx,1)
        fs.writeFileSync('./db.json',JSON.stringify(data))
        res.status(200).send(data);
    }
})




// untuk mengaktifkan koneksi express api untuk bisa menerima request
let url = ``;
for (let property in data) {
  url += `http://localhost:${PORT}/${property} \n`;
}
app.listen(PORT, () =>
  console.log(`
Express API RUNNING : ${PORT}
Home : 
http://localhost:${PORT}/
Resources:
${url}
`)
);
