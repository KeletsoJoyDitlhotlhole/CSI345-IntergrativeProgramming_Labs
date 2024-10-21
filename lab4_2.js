/**
 * Keletso Joy Ditlhotlhole,202002023
 * CSI345 LAB 2
 */

const express = require('express');
const oracledb = require('oracledb');

const app = express();

app.use(express.json());


//TASK 4
app.get('/records',async(req,res)=>
{  
  
    let connection;
 
    connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
    console.log("Successfully connected to Oracle Database");

    
    //SELECTING FROM COURSE
    result = await connection.execute( `select * from Course`, [], { resultSet: true, outFormat: oracledb.OUT_FORMAT_OBJECT });
    
       const query = 'SELECT * FROM Course'; //the sql query
      connection.execute(query, [],(error, result)=>{
      if(error){
          console.log(error.message);
          return;
        }
         console.log(result);
       // Send the result as JSON
      res.json(result.rows);
});

})


//TASK 5
app.post('/insert',async (req,res)=>
{
    async function runApp(){
          let connection;

            try{
               
                    connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
                    console.log("Successfully connected to Oracle Database");
        
                const result = await connection.execute('INSERT INTO COURSES (CourseID, CourseName, CourseCredits, TotalStudents) VALUES (:1, :2, :3, :4)', [req.body.CourseID, req.body.CourseName, req.body.CourseCredirs, req.body.TotalStudents], { autoCommit: true });
        
                console.log(result.rows);
        
            }catch(err){
                console.error(err);
                
            }
        }
            runApp();
    });


app.listen(3000,() =>
  console.log('Example app listening on port 3000!'),
);

