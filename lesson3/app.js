var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");

var app = express();

//superagent是http 方面的库，可以发起 get 或 post 请求 
//cheerio 可以理解成一个 Node.js 版的 jquery，用来从网页中以 css selector 取数据，使用方式跟 jquery 一样一样的



app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      //each() 方法规定为每个匹配元素规定运行的函数。
      //index - 选择器的 index 位置
      //element - 当前的元素（也可使用 "this" 选择器）
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        });
      });

      //返回数组（为什么返回这一步数组在页面都是排列好的）   //前端助手这个
      res.send(items);
    });
});

app.listen(3000, function () {
  console.log('app is listening at port 3000');
});