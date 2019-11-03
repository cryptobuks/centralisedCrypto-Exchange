// requirments
const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const apiRequests = require('./apiRequests.js');
const functions = require('./functions');
global.sell_id=0; //for indexing
global.buy_id=0;
global.orderbookId=0;
var buyStatus = 0;
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
var urlencodedParser = bodyParser.urlencoded({extended:false});

//mysql connection
var mysqlConnection = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"washroom@49",
  database:"orders"
});
mysqlConnection.connect();

app.use(express.static('public'));
app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname,'public/main.html'));
});

//handling orders request
app.post('/',urlencodedParser,(req,res)=>{

  var name = req.body.name;
  var type = req.body.type;
  var asset1 = req.body.asset1;
  var asset2 = req.body.asset2;
  var asset1_amount = req.body.amount;
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;


  //if sell type order
  if(type=="sell")
  {

    sell_id++;
    //requesting api for current prices
    apiRequests.cryptoCompareApi.price(asset1,asset2).then(prices=>{

      var price = prices[asset2];
      var asset2_amount = price*asset1_amount;
      //mysql commmand
      var q = "INSERT INTO sellOrders VALUE("+sell_id+",'"+name+"',"+price+",'"+asset1+"','"+asset2+"','"+dateTime+"',"+asset1_amount+","+asset2_amount+",'LIVE')";
      //insert sell orders in sellOrders database;
      functions.insertSellOrder(mysqlConnection,q);
    }).catch(console.error);
  }

  if(type=="buy")
  {
    buy_id++;
    apiRequests.cryptoCompareApi.price(asset1,asset2).then(prices=>{
      var price = prices[asset2];
      var asset2_amount = price*asset1_amount;
      // console.log(price);
      var q = "INSERT INTO buyOrders VALUE("+buy_id+",'"+name+"',"+price+",'"+asset1+"','"+asset2+"','"+dateTime+"',"+asset1_amount+","+asset2_amount+",'LIVE')";
      // console.log(q);

      //adding buyorder to buyOrder database table
      functions.insertBuyOrder(mysqlConnection,q).then(()=>{
      orderbookId++;

      //matching buyordes with sell orders
      functions.sellOrdersMatching(asset1_amount,mysqlConnection,orderbookId).then(()=>{
        functions.tradedBuyIdUpdate(mysqlConnection,buy_id).then(()=>{
          functions.updateOrderbook(mysqlConnection,orderbookId,name,asset1,asset2);
          // console.log("UPDATE orderbook SET status='TRADED' WHERE id="+orderbookId);
        });





    });
  });



  });



  }

  res.sendFile(path.join(__dirname,'public/main.html'));

});


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log('server started'));
