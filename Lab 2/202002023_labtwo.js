/**
 * Keletso Joy Ditlhotlhole,202002023
 * CSI345 LAB 2
 */

const { application } = require('express');
const express = require('express');
const oracledb = require('oracledb');

const app = express();


//TASK 4
app.get('/records',(req,res)=>
{
  let connection;
    connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
    console.log("Successfully connected to Oracle Database");
  
    

    //SELECTING FROM COURSE
   const query = 'SELECT * FROM Course';
    connection.execute(query, [],(error, result)=>{
      if(error){
        console.log(error.message);
        return;
      }
    console.log(result);
    // Send the result as JSON
    res.json(result.rows);
    });
    console.log("Query was successful");
  
});



//TASK 5
app.get('/insert',(req,res)=>
{
       
          let connection;
            connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
            console.log("Successfully connected to Oracle Database");

          
           // Insering into Course
            const sql = `insert into Course(CourseID,CourseName,CourseCredits,TotalStudents) values(:1,:2,:3,:4)`;
            const rows = [ ["CSI247", "DataStructures",3 ,22]];
            res.send(rows);
});


app.listen(3000,() =>
  console.log('Example app listening on port 3000!'),
);

