//获取元素
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var btn = document.querySelector('button');//按钮
var num = document.querySelector('.title span');//title球的数量
var numArr = ['Ten','Nine','Eight','Seven','Six','Five','Four','Three','Two','One'];//title显示球数量的数组
var number = 0;//title里球数组的小标
var count = -2;//进入下一关游戏title的球数量
var levelNum = 0;
var level = document.querySelector('.level span');//关卡
var best = document.querySelector('.best span');//最高成绩
var bestData = localStorage.getItem('best') ? localStorage.getItem('best') : localStorage.setItem('best',0);
var dropArr = [];//排放大球
var brokenArr = [];//存储小球函数

//随机颜色函数
function getRandomColor(){
    var r = parseInt(Math.random() * 256);
    var g = parseInt(Math.random() * 256);
    var b = parseInt(Math.random() * 256);
    return 'rgb('+ r +','+ g +','+ b +')';
}

//随机数
function getRandomNum(n1,n2){
    return parseInt(Math.random() * (n2 - n1 + 1) + n1);
}

//大球
function Drop(x,y){
    this.x = x;
    this.y = y;
    this.style = 1;//通过style判断什么形状的大水滴
    this.color = getRandomColor();//水滴随机色
    this.r1 = null;//横轴半径
    this.r2 = null;//纵轴半径
}

Drop.prototype = {
    draw:function(){
        switch(this.style){
            case 1:
                this.draw1();
                break;
            case 2:
                this.draw2();
                break;
            case 3:
                this.draw3();
                break;
            case 4:
                this.draw4();
                break;
            default:
                break;
        }
    },

    //绘制不同球的函数
    draw1:function(){
        this.style = 1;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(this.x,this.y,this.r1,this.r2,0,0,2 * Math.PI,true);
        ctx.fill();
        this.r1 = 15;
        this.r2 = 20;
    },
    draw2:function(){
        this.style = 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(this.x,this.y,this.r1,this.r2,0,0,2 * Math.PI,true);
        ctx.fill();
        this.r1 = 20;
        this.r2 = 20;
    },
    draw3:function(){
        this.style = 3;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(this.x,this.y,this.r1,this.r2,0,0,2 * Math.PI,true);
        ctx.fill();
        this.r1 = 40;
        this.r2 = 35;
    },
    draw4:function(){
        this.style = 4;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(this.x,this.y,this.r1,this.r2,0,0,2 * Math.PI);
        ctx.fill();
        this.r1 = 50;
        this.r2 = 50;
    }
};

//小球
function smallDrop(x,y,dir){
    this.x = x;
    this.y = y;
    this.color = getRandomColor();
    this.dir = dir;//小球的方向
}
smallDrop.prototype = {
    draw:function(){
        //通过小球的dir绘制小球的移动
        switch (this.dir){
            case 'left':
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.ellipse(this.x-=4,this.y,10,10,0,0,2 * Math.PI,true);
                ctx.fill();
                break;
            case 'right':
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.ellipse(this.x+=4,this.y,10,10,0,0,2 * Math.PI,true);
                ctx.fill();
                break;
            case 'up':
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.ellipse(this.x,this.y-=4,10,10,0,0,2 * Math.PI,true);
                ctx.fill();
                break;
            case 'down':
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.ellipse(this.x,this.y+=4,10,10,0,0,2 * Math.PI,true);
                ctx.fill();
                break;
            default:
                break;
        }

    }
};




function mapArange() {
    for (var i = 0; i < canvas.width / 100; i++) {
        for (var j = 0; j < canvas.height / 100; j++) {
            var x = (canvas.width / 7) * j + canvas.width / 7 / 2;
            var y = (canvas.height / 7) * i + canvas.height / 7 / 2;
            var drop = new Drop(x, y);
            drop.style = getRandomNum(1, 4);
            dropArr.push(drop);
        }
    }
}




//点击事件
canvas.onclick = function(e) {
    e = e || window.event;
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;

    for (var i = 0; i < dropArr.length; i++) {
        dropArr[i].draw();
        if (ctx.isPointInPath(x, y)) {
            if(dropArr[i].style >=5){
                dropArr[i].style = 5;
            }
            dropArr[i].style++;
            //当大球爆开后小球存储
            if(dropArr[i].style > 4){
                brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'left'));
                brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'right'));
                brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'up'));
                brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'down'));
                isOpen = true;
                dropArr.splice(i,1);
            }
        }
    }

    //title的数字变化
    number++;
    num.innerText = numArr[number];

};

//循环绘制
function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //绘制大球
    for (var m = 0; m < dropArr.length; m++) {
        dropArr[m].draw();
    }
    //绘制小球
    for(var n = 0;n < brokenArr.length;n++) {
        brokenArr[n].draw();
    }
    //碰撞检测
    for(var i = 0;i < dropArr.length;i++){
        for(var j = 0;j < brokenArr.length;j++){
            var result1 = brokenArr[j].x <= dropArr[i].x + dropArr[i].r1 && brokenArr[j].x >= dropArr[i].x - dropArr[i].r1;
            var result2 = brokenArr[j].y <= dropArr[i].y + dropArr[i].r2 && brokenArr[j].y >= dropArr[i].y - dropArr[i].r2;
            if(result1&&result2){
                dropArr[i].style += 1;
                brokenArr.splice(j,1);
                //当大球爆开后小球在该位置存储
                if(dropArr[i].style > 4){
                    brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'left'));
                    brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'right'));
                    brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'up'));
                    brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y,'down'));
                    dropArr.splice(i,1);
                    break;
                }
            }

        }
    }


    //下一关
    if(dropArr.length == 0){
        count += 2;
        levelNum += 1;
        mapArange();
        brokenArr = [];
        num.innerText = numArr[count];
        level.innerText = levelNum;
        number = numArr.indexOf(numArr[count]);//找到当前球在数组中的位置
        bestData = bestData > levelNum ? bestData : levelNum;
        window.localStorage.setItem('best',bestData);
    }
    best.innerText = bestData;


    //游戏结束
    if(number >= 10){
        ctx.beginPath();
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(0,0,700,700);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.font = '60px Mdt';
        ctx.fillText('GAME OVER',230,350);
        ctx.closePath();
        num.innerText = 'none';
    }

    window.requestAnimationFrame(animation);
}
animation();


//restart的按键
btn.onclick = function(){
    location.reload();
}



