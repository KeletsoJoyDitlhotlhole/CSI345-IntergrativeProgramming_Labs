const express=require('express');

const app=express();

const Bookingstable=[{FacilityID:"F00007",Customer:"C00001",StartDate:"4/10/2023",EndDate:"6/10/2023",Paid:"True",Amount:3000},
              {FacilityID:"F00004",Customer:"C00001",StartDate:"4/12/2023",EndDate:"4/12/2023",Paid:"False",Amount:0},
              {FacilityID:"F00001",Customer:"C00007",StartDate:"5/11/2023",EndDate:"5/11/2023",Paid:"True",Amount:2000},
              {FacilityID:"F00007",Customer:"C00009",StartDate:"9/12/2023",EndDate:"9/12/2023",Paid:"True",Amount:1000},
              {FacilityID:"F00004",Customer:"C00008",StartDate:"10/11/2023",EndDate:"11/11/2023",Paid:"True",Amount:3000},
              {FacilityID:"F00001",Customer:"C00002",StartDate:"6/9/2023",EndDate:"6/9/2023",Paid:"True",Amount:1000}];


///hello – just returns the string helloworld. 
app.get('/hello',(req,res)=>
{
    res.send('Hello World!');
});


///stats – returns number of bookings, total amount for the bookings, as well as how many are paid.
app.get('/stats',(req,res)=>
{

  amountOfB=0;
  for(let i=0;i<Bookingstable.length;i++)
  {
    amountOfB+=i<Bookingstable[i].Amount;
  }

  paidBookings=0;
  for(let i=0;i<Bookingstable.length;i++)
  {
    if(Bookingstable[i].Paid)
    {
      paidBookings++;
    }
  }

  const stats={
      
        NumberOfBookings:Bookingstable.length,
        TotalNumberOfBookings: amountOfB,
        paidBookings: paidBookings
  }
  

  res.send(stats);
});



/**ranking – returns a ranking of the facilities based on total amount the facility
            has made. Those facilities that have made more money are ranked higher. Your
            output should be as shown below. [15 marks]
            F00007: 4000
            F00001: 3000
            F00004: 2000*/

app.get('/ranking',(res,req)=>
{
   Bookingstable.sort((b,a)=>
   {
      tempa =a.FacilityID,
      tempb=b.FacilityID;

      if(tempa < tempb)
      {
        return -1;
      }

      if(tempa>tempb)
      {
        return 1;
      }
      return 0;
   });

   sum=0;
   facID=Bookingstable[0].FacilityID;
  
   rank=[];
   dt={};

   Bookingstable.forEach((e)=>
   {
      if(e.FacilityID==facID)
      {
        sum=sum+e.Amount;
      }
      else{
        dt=
        {
          "FacilityID": facID,
          "totalSum":sum
        }

        myRanking.push(dt);
        sum=e.Amount;
        fid=e.FacilityID
      }

   });
   
   dt={
        "FacilityID":fid,
        "totalSum":sum
   };

   myRanking.push(dt);

  //sorting the rankings
   myRanking.sort((b,a)=>a.totalSum-b.totalSum);
   response.send(myRanking);

});



//For the bookings, use a nested array, you will use a database in Lab 2
app.get('/bookings',(req,res)=>
{
   res.send([
    ["FacilityID","CustomerID","StartDate","EndDate","Paid","AmountPaid"],
    ["F00007","C00001","4/10/2023","6/10/2023","True",3000],
    ["F00004","C00001","4/12/2023","4/12/2023","False",0],
    ["F00001","C00007","4/11/2023","5/11/2023","True",2000],
    ["F00007","C00009","9/12/2023","9/12/2023","True",1000],
    ["F00004","C00008","10/11/2023","11/11/2023","True",3000],
    ["F00001","C00002","6/9/2023","6/9/2023","True",1000]
  ]);

});


app.listen(3000,() =>
  console.log('Example app listening on port 3000!'),
);