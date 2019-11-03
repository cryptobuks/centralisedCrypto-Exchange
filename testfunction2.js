var mysql = require('mysql');


var mysqlConnection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'washroom@49',
  database:'orders'
});

mysqlConnection.connect((error)=>{
  if(error) console.log('Error Connecting database');
})




async function update(){
  var q = "INSERT INTO buyOrders VALUE(1,'pradee',9,'BTC','ETH','1221',22,23,'LIVE')";
  // console.log(q);
  //mysql inserting data in data base
  mysqlConnection.query(q,(err,res)=>{
    if(err) console.log(err);
    if(res) console.log('sellOrders database updated');
  });


}


update().then(()=>{
  var q = "UPDATE buyOrders SET status='TRADED' WHERE id=1";
  mysqlConnection.query(q,(err,res)=>{

    if(err) console.log(err);
    if(res) console.log('buyOrders Updated');
  });
});
