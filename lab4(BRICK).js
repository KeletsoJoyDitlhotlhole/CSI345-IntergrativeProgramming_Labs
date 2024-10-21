const express = require('express');
const oracledb = require('oracledb');
const app = express();
app.use(express.json());

const Keycloak = require('keycloak-connect');
const session = require('express-session');

const keycloak = new Keycloak({});

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialised: true
}));

app.use(keycloak.middleware());

const protect = keycloak.protect();


const config = {
    user: "dub02225",
    password: "dub02225",
    connectString: "10.0.18.2:1521/orcl"
}

// For pagination URL '/courses?page=<page number>&pageSize=<page size>'
// Example: '/courses?page=1&pageSize=10' returns the first 10 courses

app.get('/courses', protect, async (req, res) => {
    let conn;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const startRow = (page-1) * pageSize + 1
    const endRow = page*pageSize
    

    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM  (SELECT rownum as rn, c.* FROM Courses c) WHERE rn BETWEEN :startRow AND :endRow', [startRow, endRow]);

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }

})




app.post('/courses', protect, async (req, res) => {

    let conn;


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

})

app.listen(3000, () => console.log("Server running on port 3000!"));

