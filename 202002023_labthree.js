/**
 * Keletso Joy Ditlhotlhole,202002023
 * CSI345 LAB 2
 */

const { application } = require('express');
const express = require('express');
const oracledb = require('oracledb');

const path=require('path') //this path will be used for basic authentification

const app = express();

 //BASIC AUTHENTIFICATION
 function authentication(req, res, next) {
  const authheader = req.headers.authorization;
  console.log(req.headers);

  if (!authheader) {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err)
  }

  const auth = new Buffer.from(authheader.split(' ')[1],
      'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  if (user == 'dit02023' && pass == 'dit02023') {

    let connection;
        connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
        console.log("Successfully connected to Oracle Database");
      next();

      
  } else {
      let err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
  }

}

//authentication of the client
app.use(authentication)
app.use(express.static(path.join(__dirname, 'public')));



app.get('/records',(req,res)=>
{
  async function runApp()
  {
    let connection;
  
      connection = await oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
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
  
  
  }
});



//TASK 5
app.post('/insert',(req,res)=>
{
       
          let connection;
            connection = oracledb.getConnection({ user: "dit02023", password: "dit02023", connectionString: "10.0.18.2:1521/orcl" });
            console.log("Successfully connected to Oracle Database");
          
         
          
           // Insering into Course
            const sql = `insert into COURSE (CourseID,CourseName,CourseCredits,TotalStudents) values(:1,:2,:3,:4)`;
        const rows = [ [CourseID= "CSI247", CourseName="DataStructures",CourseCredits=3 ,TotalStudents=22]];
        
       //Input Validation 
      if(CourseID==String && CourseName==String && CourseCredits==Integer && TotalStudents<200)
      {
            
            res.send(rows);
      }
      else{
            throw "wrongInput"
      }

    });

app.listen(3000,() =>
  console.log('Example app listening on port 3000!'),
);

