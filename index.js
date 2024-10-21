const express = require('express');
const oracledb = require('oracledb');
const basicAuth = require('express-basic-auth');
const jwt = require('jsonwebtoken');


const config = {
    user: "dub02225",
    password: "dub02225",
    connectString: "10.0.18.2:1521/orcl"
}

const users = [
    {
        name: 'Trudy',
    },
    {
        name: 'Sam',
    }
]

const app = express();

app.use(express.json());


// Comment out the following when testing JWT
app.use(basicAuth({
   users: { 'admin': 'supersecret' }
}))




app.get('/courses', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM Courses');

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
//    "courseCode":"CSI323",
//    "description":"Algorithms",
//    "credits":3,
//    "semester":1,
//    "times":"Mon, Tue - 9:00 - 10:00",
//    "numStudents":75
// }

app.post('/courses', auth, async (req, res) => {

    // Validates course code (must be 3 letters and 3 numbers)
    // Ensures numbes of students is greater than zero

    var code = /^[a-zA-Z]{3}\d{3}$/;
    var info = /[a-zA-Z\s]+$/;
    let conn;

    if(code.test(req.body.courseCode) && req.body.numStudents>=0 && info.test(req.body.description)){

        try{
            conn = await oracledb.getConnection(config);
    
            const result = await conn.execute('INSERT INTO COURSES (COURSECODE, DESCRIPTION, CREDITS, SEMESTER, TIMES, NUMSTUDENTS) VALUES (:1, :2, :3, :4, :5, :6)', [req.body.courseCode, req.body.description, req.body.credits, req.body.semester, req.body.times, req.body.numStudents], { autoCommit: true });
    
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
        
        await jwt.verify(token, 'super-secret')

        req.token = token
        
        const decodedUser = jwt.decode(token, 'super-secret')
       
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
    
    if(name === 'Trudy' || name === 'Sam'){
       
        const token = jwt.sign({ name }, 'super-secret', { expiresIn: '60s'})
        res.send({ token })

    }else{
        res.send({ error: 'Create a new account by inserting a username' })
    }
})



app.listen(3000, () => console.log("Server running on port 3000"));

