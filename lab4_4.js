/**
 * Keletso Joy Ditlhotlhole,202002023
 * CSI345 LAB 4
 */

const express = require('express');
const oracledb = require('oracledb');

const app = express();

app.use(express.json());

//TASK 2(LAB 4):
/**a. Secure the API endpoints from Lab 2. Use an external IAM platform.
    i. Integrate with an external IAM platform like Keycloak or any freely available IAM platform. (IAM – Identity and Access Management)*/
const Keycloak = require('keycloak-connect');
const session = require('express-session');

const keycloak = new Keycloak({});

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialised: true
}));

app.use(keycloak.middleware());  //the middleware acts as security for the application

const protect = keycloak.protect();  

//TASK 4(LAB 2)
app.get('/records',protect, (req,res)=>
{  
    
    /** TASK 1(LAB 4)
    b. For the endpoints from Lab 2, Implement API pagination.**/
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const startRow = (page-1) * pageSize + 1
    const endRow = page*pageSize
    

    let connection;
   
    //connection to the database
    connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
    console.log("Successfully connected to Oracle Database");


    connection.query('SELECT * FROM (SELECT rownum as rownumber, cour.* FROM Course cour) WHERE rownumber BETWEEN :startRow AND :endRow',[startRow, endRow], function(err, result, fields){
    if(err){
        console.log(err)
    }

    res.send(rows);
    console.log("Query successful")    
})

});

//TASK 5(LAB 4)
app.post('/insert', protect, async (req,res)=>
{
         
          let connection;

            try{
                   
                    //connection to the database
                    connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
                    console.log("Successfully connected to Oracle Database");
        
                const result = await conn.execute('INSERT INTO COURSES (CourseID, CourseName, CourseCredits, TotalStudents) VALUES (:1, :2, :3, :4)', [req.body.CourseID, req.body.CourseName, req.body.CourseCredirs, req.body.TotalStudents], { autoCommit: true });
        
                console.log(result.rows);
        
            }catch(err){
                console.error(err);
                
            }finally{
                if(connection){
                    await connection.close();
                }
            }
    });


app.listen(3000,() =>
  console.log('Example app listening on port 3000!'),
);

