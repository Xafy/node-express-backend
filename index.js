var Express = require("express")
var bodyParser = require("body-parser") 


var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var fileUpload = require('express-fileupload')
var fs = require('fs');
app.use(fileUpload())
app.use('/pics', Express.static(__dirname+'/pics'))

var cors = require('cors')
app.use(cors())

var MongoClient = require("mongodb").MongoClient;
var CONNECTION_STRING = "mongodb+srv://Xafy:1234@cluster0.qu4biuq.mongodb.net/?retryWrites=true&w=majority"

var DATABASE = "testdb";
var database;

app.listen(49146,()=>{
    MongoClient.connect(CONNECTION_STRING, {useNewUrlParser:true}, (error, client)=>{
        database = client.db(DATABASE);
        console.log("MongoDB is connected successfully")
    })
});

app.get('/', (request, response)=>{
    response.json('Hello World')
})

app.get('/api/department', (request, response)=>{
    database.collection("Department").find({}).toArray((error, result)=>{
        if(error){
            console.log(error);
        }
        response.json(result);
        console.log(result);
    })
})

app.post('/api/department', (request, response)=>{
    database.collection("Department").count({}, function(error, numOfDepartments){
        if(error){
            console.log("There is an error :", error)
        }
        database.collection("Department").insertOne({
            DepartmentId : numOfDepartments + 1,
            DepartmentName : request.body['DepartmentName']
        })
        response.json("Added successfully");
    })
})

app.put('/api/department', (request, response)=>{
    database.collection("Department").updateOne(
        // Filter criteria
        {
            "DepartmentId" : request.body["DepartmentId"]
        },
        // Update
        {$set:
            {
                "DepartmentName" : request.body["DepartmentName"]
            }
            
        }
    )
    response.json("Updated successfully");
})

app.delete('/api/department/:id', (request, response)=>{
    database.collection("Department").deleteOne({
        DepartmentId : parseInt(request.params.id)
    })
    response.json("Deleted successfully")
})



// Employee

app.get('/api/employee', (request, response)=>{
    database.collection("Employee").find({}).toArray((error, result)=>{
        if(error){
            console.log(error);
        }
        response.json(result);
        console.log(result);
    })
})

app.post('/api/employee', (request, response)=>{
    database.collection("Employee").count({}, function(error, numOfEmployees){
        if(error){
            console.log("There is an error :", error)
        }
        database.collection("Department").insertOne({
            EmployeeId : numOfEmployees + 1,
            EmployeeName : request.body['EmployeeName'],
            Deparment : request.body['Department'],
            DateOfJoining : request.body['DateOfJoining'],
            picPath : request.body['picPath']
        })
        response.json("Added successfully");
    })
})

app.put('/api/employee', (request, response)=>{
    database.collection("Employee").updateOne(
        // Filter criteria
        {
            EmployeeId : request.body['EmployeeId']
        },
        // Update
        {$set:
            {
                EmployeeName : request.body['EmployeeName'],
                Deparment : request.body['Department'],
                DateOfJoining : request.body['DateOfJoining'],
                picPath : request.body['picPath']
            }
            
        }
    )
    response.json("Updated successfully");
})

app.delete('/api/employee/:id', (request, response)=>{
    database.collection("Employee").deleteOne({
        EmployeeId : parseInt(request.params.id)
    })
    response.json("Deleted successfully")
})


app.post('/api/employee/savepic',(request, response)=>{
    fs.writeFile("./pics/"+request.files.file.name, request.files.file.data, function(error){
        if(error){
            console.log(error)
        }
        response.json(request.files.file.name)
    })
})