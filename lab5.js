/***
 * CSI345 LAB 5
 * By: Keletso Joy Ditlhotlhole,202002023
 */

 const express = require('express');
 const oracledb = require('oracledb');
 const app = express();
 app.use(express.json());

//FOR KEYCLOAK
const Keycloak = require('keycloak-connect');
const session = require('express-session');

// Initialize Keycloak
const keycloak = new Keycloak({
    store: new session.MemoryStore(),
  });


// Initialize Keycloak middleware
app.use(keycloak.middleware());
  

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialised: true
}));
 
const config = {
    user: "dit02023",
    password: "dit02023",
    connectString: "10.0.18.2:1521/orcl"
}

/**
 * FOR POSTMAN
 * username: keletsojoy
 * password:password
 * client_id: 202002023
 * client_secret:3ESsFXkFZPY983tkDcC7mEavyK0Qexbp
 * grant_type:client_credentials
 * /

/**
 * GET THE TOKEN AT THE TOKEN AND PASTE IT AS A BEARER TOKEN FOR AUTHORIZATION.
 * ALL ENDPOINTS USE A BEARER TOKEN
 */

/***
 * GET ENDPOINTS
 **/

//get /users-returns a list of all users
app.get('/users',  keycloak.protect('Administrator'),async (req, res) => {
    let conn;
    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM User_');

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }
})


//get /publications-returns a list of all publications
app.get('/publications', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM Publication');

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }
})


//get /reviewedPublications-returns a list of all reviewed publications
app.get('/reviewedPublications', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const reviewed = "Reviewed";
        let review = reviewed.toLowerCase();

        const result = await conn.execute(`SELECT P.pubid, P.title, P.status_, datereviewed FROM Publication P WHERE lower(P.datereviewed) LIKE '%' || :review || '%' `, [review]);

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }
})


//get /approvedPublications-returns a list of all approved publications
app.get('/approvedPublications', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const approved = "Approved";
        let approve = approved.toLowerCase();

        const result = await conn.execute(`SELECT P.pubid, P.title, P.status_, dateapproved FROM Publication P WHERE lower(P.dateapproved) LIKE '%' || :approve || '%' `, [approve]);

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }
})


//get /draftPublications-returns a list of all draft publications
app.get('/draftPublications', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const drafted = "Draft";
        let draft = drafted.toLowerCase();

        const result = await conn.execute(`SELECT P.pubid, P.title, P.status_, dateCreated FROM Publication P WHERE lower(P.dateCreated) LIKE '%' || :darft || '%' `, [draft]);

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }
})


//get /userAssignments-returns a list of publications,who is assigned that publication and who created it
app.get('/userAssignments', async (req, res) => {
    let conn;

    try{
        conn = await oracledb.getConnection(config);

        const result = await conn.execute('SELECT * FROM UserAssignment');

        res.send(result.rows);

    }catch(err){
        console.error(err);
    }finally{
        if(conn){
            await conn.close();
        }
    }
})




/***
 * POST endpoints
 */

//post /addpublications-adds new publications
app.post('/addpublications', async (req, res) => {
    let conn;
    try {
        conn = await oracledb.getConnection(config);

        const newpubid = req.body.newpubid;
        const newtitle = req.body.newtitle;
        const newstatus = req.body.newstatus;
        const newdatecreated = req.body.newdatecreated;
        const newdatereviewed = req.body.newdatereviewed;
        const newdateapproved = req.body.newdateapproved;

        const sqlQuery = "INSERT INTO UserAssignment(pubid, title, status_, datecreated, datereviewed, dateapproved) VALUES (:newpubid, :newtitle, :newstatus, :newdatecreated, :newdatereviewed, :newdateapproved)";

        const result = await conn.execute(sqlQuery, [newpubid, newtitle, newstatus, newdatecreated, newdatereviewed, newdateapproved], { autoCommit: true });

        console.log(result);

        res.send("Publication added successfully!\n" + result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: Unable to add publication.");
    } finally {
        if (conn) {
            await conn.close();
        }
    }
});



//post /assignuser-assigns a publication to a user
app.post('/assignuser', async (req, res) => {
    let conn;
    try {
        conn = await oracledb.getConnection(config);

        const newUserid = req.body.newUserid;
        const newpubid = req.body.newpubid;
        const newcreatedby = req.body.newcreatedby;

        const sqlQuery = "INSERT INTO UserAssignment (userid, pubid, createdby) VALUES (:newUserid, :newpubid, :newcreatedby)";

        const result = await conn.execute(sqlQuery, [newUserid, newpubid, newcreatedby], { autoCommit: true });

        console.log(result);

        res.send("Publication assigned a User successfully!\n" + result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: Unable to assign user to publication.");
    } finally {
        if (conn) {
            await conn.close();
        }
    }
});



//post /adduser-adds a new user
app.post('/adduser',keycloak.protect('Administrator'), async (req, res) => {
    let conn;
    try {
        conn = await oracledb.getConnection(config);

        const newUserid = req.body.newUserid;
        const newfirstname = req.body.newfirstname;
        const newsurname = req.body.newsurname;

        const sqlQuery = "INSERT INTO User_(userid, firstname, surname) VALUES (:newUserid, :newfirstname, :newsurname)";

        const result = await conn.execute(sqlQuery, [newUserid, newfirstname, newsurname], { autoCommit: true });

        console.log(result);

        res.send("User successfully added!\n" + result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error: Unable to add user.");
    } finally {
        if (conn) {
            await conn.close();
        }
    }
});


/**
 * PUT endpoints
 */

//put /changeStatus-edits the status of the publication
app.put('/changeStatus',keycloak.protect('Administrator'),async(req,res)=>{

    try{
        conn= await oracledb.getConnection(config);

        const pubid = req.body.pubid;

            const newstatus = req.body.newstatus;

            const sqlQuery = "UPDATE Publication SET status_=:newstatus WHERE pubid=:pubid";
            const result = await conn.execute(sqlQuery, [newstatus, pubid], {autoCommit: true});
            res.send(result.rows + "\n Status changed successfully!");
    

    }catch(err){
        console.error(err);
        
    }finally{
        if(conn){
            await conn.close();
        }
    }

})


//put /editApprovedPublications-edits approved publications


//put /editUser-can edit the profile of the user e.g. correcting names
 app.put('/editUser',keycloak.protect('Administrator'), async(req,res)=>{ //NEEDS ATTENTION

    try{
        conn= await oracledb.getConnection(config);

        const choice = req.body.choice;
        const userid = req.body.userid;

        if(choice == 1){
            const newfirstname = req.body.newfirstname;
            const sqlQuery = "UPDATE User_ SET firstname=:newfirstame WHERE userid=:userid";
            const result = await conn.execute(sqlQuery, [newfirstname, userid], {autoCommit: true});
            res.send(result.rows + "\n First Name changed successfully!");
        } else if(choice == 2){
            const surname = req.body.surname;
            const sqlQuery = "UPDATE User_ SET surname=:surname WHERE userid=:userid";
            const result = await conn.execute(sqlQuery, [surname, userid], {autoCommit: true});
            res.send(result.rows + "\n Surname successfully changed!");
        }
    }catch(err){
        console.error(err);
        
    }finally{
        if(conn){
            await conn.close();
        }
    }

})


//put /editUserAssignment-can change who was assigned a publication
app.put('/editUserAssignment', keycloak.protect('Administrator'),async(req,res)=>{

    try{
        conn= await oracledb.getConnection(config);

        const pubid = req.body.pubid;

            const newUserid = req.body.newUserid;

            const sqlQuery = "UPDATE UserAssignment SET userid=:newUserid WHERE pubid=:pubid";
            const result = await conn.execute(sqlQuery, [newUserid, pubid], {autoCommit: true});
            res.send(result.rows + "\n User changed successfully!");
    

    }catch(err){
        console.error(err);
        
    }finally{
        if(conn){
            await conn.close();
        }
    }

})


app.listen(3000, () => console.log("Server running on port 3000"));
