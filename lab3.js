const express = require('express');
const oracledb = require('oracledb');
const basicAuth = require('express-basic-auth');
const jwt = require('jsonwebtoken');


const config = {
    user: "dit02023",
    password: "dit02023",
    connectString: "10.0.18.2:1521/orcl"
}

const users = [
    {
        name: 'Keletso',
    },
    {
        name: 'Joy',
    }
]

const app = express();

app.use(express.json());


// Comment out the following when testing JWT
//app.use(basicAuth({
 //  users: { 'admin': 'lab3password' }
//}))



app.get('/records', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM Course');

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }

})


// Add a course to database

// Use Postman -> POST -> Body -> raw -> and set Text to JSON to produce an output
// Example row insertion on Postman given below

// {
//    "CourseID":"CSI323",
//    "CourseName":"Algorithms",
//    "CourseCredits":3,
//    "TotalStudents":22
// }

app.post('/insert', auth, async (req, res) => {

    // Validates course code (must be 3 letters and 3 numbers)
    // Ensures numbes of students is greater than zero

    var code = /^[a-zA-Z]{3}\d{3}$/;
    let conn;

    if(code.test(req.body.CourseID) && req.body.TotalStudents>=0){

        try{
            conn = await oracledb.getConnection(config);
    
            const result = await conn.execute('INSERT INTO COURSE (CourseID, CourseName, CourseCredits, TotalStudents) VALUES (:1, :2, :3, :4)', [req.body.CourseID, req.body.CourseName, req.body.CourseCredits, req.body.TotalStudents], { autoCommit: true });
    
            console.log(result.rows);
    
        }catch(err){
            console.error(err);
            
        }finally{
            if(conn){
                await conn.close();
            }
        }
        res.sendStatus(201);
    }else{

        res.status(400).json({
            message: "Error"
        });
    }
})

// Authentication for JWT
async function auth(req, res, next){
    try{
        const token = req.headers.authorization.replace('Bearer ', '')
        
        await jwt.verify(token, 'lab3password')

        req.token = token
        
        const decodedUser = jwt.decode(token, 'lab3password')
       
        const user = users.filter(user => user.name === decodedUser.name)
        
        req.user = user[0]
        next()
        
    }catch(err){
        res.status(401).send({error: 'Not authorised!'})
    }
}


//JWT implemetation
//The following must be included in body to ensure user is already created {"name":"Jon"}
app.post('/login', (req, res) => {
    const name = req.body.name
    
    if(name === 'Keletso' || name === 'Joy'){
       
        const token = jwt.sign({ name }, 'lab3password', { expiresIn: '60s'})
        res.send({ token })

    }else{
        res.send({ error: 'Create a new account by inserting a username' })
    }
})



app.listen(3000, () => console.log("Server running on port 3000"));

