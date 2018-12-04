let express = require("express");
let bodyParser = require('body-parser');
let session = require('express-session');
let app = express();
app.use(bodyParser.json());
app.use(session({
    resave: true,//每次访问都重新保存session
    saveUninitialized: true,//保存未初始化的session
    secret: 'zfpx'//密钥
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    //允许的来源
    res.header('Access-Control-Allow-Origin', '*');
    //允许客户端请求的方法
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    //允许客户端发送的请求头
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //允许客户端发送Cookie
    res.header('Access-Control-Allow-Credentials', "true");
    //当客户端发向服务器发post跨域的时候，会先发送OPTIONS请求。如果服务器返回的响应头Access-Control-Allow-Methods里有POST的话，才会再次发送POST请求
    if (req.method == 'OPTIONS') {
        res.end();
    } else {
        next();
    }
});
//获取首页 列表 && 轮播图
let HList = require("./mock/HList");
// console.log(HList);
//获取星级食物列表
let food = require("./mock/food.json");
//获取搜索选项
let search = require("./mock/search.json");

let friend = require("./mock/friend.json");

//获取搜索列表
let foodList = require("./mock/foodList.json");

app.get("/", function (req, res) {
    console.log(req.headers);
    // console.log("===================================")
    // console.log(res.headers);
    res.json(HList);
});


app.post('/search', function (req, res) {
    let searchList = [];
    let find = req.body;
    let reg = new RegExp(find.searchFood, 'i');
    foodList.forEach(item => {
        searchList = [...searchList, ...item.data.find_recipe.filter(item => {
            return reg.test(item.recipe_name) || reg.test(item.recipe_info)
        })]
    });
    res.json({
        searchList: searchList.slice(0, find.limit),
        isLoading: false,
        limit: find.limit,
        keyword: find.searchFood
    });
});

app.post('/searchIndex', function (req, res) {
    let find = req.body;
    res.json(foodList[find.index]);
});

app.listen(3000, function () {
    console.log("localhost:3000")
});