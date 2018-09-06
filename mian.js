
// 引入相关模块
const puppeteer = require('puppeteer');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

// 立即执行函数
(async () => {
    // 创建浏览器对象
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    //打开网页
    await page.goto('https://image.baidu.com/');
    console.log('进入到网页中！');

    //设置浏览器窗口大小
    await page.setViewport({
        width:1920,
        height:1080,
    });

    //模拟搜索功能
    await page.focus('#kw');
    await page.keyboard.sendCharacter('王鸥');
    await page.click('.s_search');

    console.log('搜索到了列表！');

    page.on('load',async ()=>{
        console.log('进入操作！');

        const srcs = await page.evaluate(()=>{
           const images = document.querySelectorAll('img.main_img');
           return Array.prototype.map.call(images,img => img.src);
        });


        srcs.forEach(async (src) => {
            saveImg(src,__dirname);
        });


        await browser.close();
    });

    // 定义一个保存图片的函数
    let saveImg = (url,dir) =>{
        const mod = /^https:/.test(url) ? https : http;
        const ext = path.extname(url);
        const file = path.join(dir,'/src/'+Date.now()+ Math.floor(Math.random()*1000) + ext );

        mod.get(url,(res)=>{
            res.pipe(fs.createWriteStream(file)).on('finish',()=>{
               console.log(file);
            });
        });
    }
})();