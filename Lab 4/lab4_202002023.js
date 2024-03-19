/*****
 * Name: Keletso Joy Ditlhotlhole
 * Description: CSI345 LAB 4
 */


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

app.use(keycloak.middleware()); //the middleware acts as security for the application

const protect = keycloak.protect();


/**
 * TO GET TO THE TOKEN
 * https://lemur-14.cloud-iam.com/auth/realms/csi345labs/protocol/openid-connect/token
 */

/**
 * username:keletsojoy
 * password:password
 * client_id:202002023
 * grant_type: client_credentials
 */


/**a. Secure the API endpoints from Lab 2. Use an external IAM platform.
    i. Integrate with an external IAM platform like Keycloak or any freely available IAM platform. (IAM – Identity and Access Management)*/
app.get('/records', protect, async (req, res) => {

    const config = {
        user: "dit02023",
        password: "dit02023",
        connectString: "10.0.18.2:1521/orcl"
    }
    
    let conn;
    
    //page
    const page = parseInt(req.query.page) || 1;
    //pageSize
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startRow = (page-1) * pageSize + 1
    const endRow = page*pageSize
    

    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM  (SELECT rownum as rn, cour.* FROM Course cour) WHERE rn BETWEEN :startRow AND :endRow', [startRow, endRow]);

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }
    

})




app.post('/courses', protect, async (req, res) => {

    const config = {
        user: "dit02023",
        password: "dit02023",
        connectString: "10.0.18.2:1521/orcl"
    }
    

        try{
            conn = await oracledb.getConnection(config);
    
            const result = await conn.execute('INSERT INTO COURSE (CourseID, CourseName, CourseCredits, TotalStudents) VALUES (:1, :2, :3, :4)', [req.body.CourseId, req.body.CourseName, req.body.CourseCredits, req.body.TotalStudents], { autoCommit: true });
    
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

