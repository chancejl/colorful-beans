//获取canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

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

//水滴
function Water(x,y){
    this.x = x;
    this.y = y;
    this.color = getRandomColor();
    this.style = null;
    this.direction = null;
}

Water.prototype = {
    load:function(){
        this.draw();
    },
    draw:function(){
        switch (this.style){
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
            case 5:
                this.draw5();
                break;
            default:
                break;
        }
    },
    draw1:function(){
        ellipse(ctx,this.x,this.y,10,20,this.color);
    },
    draw2:function(){
        ellipse(ctx,this.x,this.y,25,25,this.color);
    },
    draw3:function(){
        ellipse(ctx,this.x,this.y,30,40,this.color);
    },
    draw4:function(){
        ellipse(ctx,this.x,this.y,50,50,this.color);
    },
    draw5:function(){
        if(this.direction == null){
            this.direction = 6;
            ellipse(ctx,this.x - 20,this.y,10,10,this.color);
            ellipse(ctx,this.x + 20,this.y,10,10,this.color);
            ellipse(ctx,this.x,this.y - 20,10,10,this.color);
            ellipse(ctx,this.x,this.y + 20,10,10,this.color);
        }else {
            ellipse(ctx, this.x, this.y, 10, 10, this.color);
            ellipse(ctx, this.x, this.y, 10, 10, this.color);
            ellipse(ctx, this.x, this.y, 10, 10, this.color);
            ellipse(ctx, this.x, this.y, 10, 10, this.color);
        }
        //左边
        var water_l = new Water();
        water_l.x = this.x - 20;
        water_l.y = this.y;
        water_l.direction = 'left';

        //右边
        var water_r = new Water();
        water_r.x = this.x + 20;
        water_r.y = this.y;
        water_r.direction = 'right';

        //上边
        var water_u = new Water();
        water_u.x = this.x;
        water_u.y = this.y - 20;
        water_u.direction = 'up';

        //下边
        var water_d = new Water();
        water_d.x = this.x;
        water_d.y = this.y + 20;
        water_d.direction = 'down';
    }
};



//绘制椭圆
function ellipse(ctx,x,y,a,b,color){
    ctx.save();
    ctx.fillStyle = color;
    var r = (a > b) ? a : b;
    var ratioX = a / r;
    var ratioY = b / r;
    ctx.scale(ratioX,ratioY);
    ctx.beginPath();
    ctx.moveTo((x + a) / ratioX,y /ratioY);
    ctx.arc(x / ratioX ,y / ratioY,r,0,2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
// ellipse(ctx,100,100,10,10,this.color);


//水滴的位置
function Map(){
    this.w = canvas.width;
    this.h = canvas.height;
    this.numX = 7;
    this.numY = 7;
    this.mapArr = [];
}

Map.prototype = {
    start:function(){
        for(var i = 0;i < this.numX;i++){
            for(var j = 0;j < this.numY;j++){
                var x = (this.w / this.numX) * j + (this.w / this.numX) / 2;
                var y = (this.h / this.numY) * i + (this.h / this.numY) / 2;
                var pos = {
                    x:x,
                    y:y
                };
                this.mapArr.push(pos);
            }
        }
    }
};

function WaterCollect(){
    this.waterArr = [];
    this.waterbrokenArr = [];
}

WaterCollect.prototype = {
    draw:function(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //遍历普通水滴并绘制
        for(var i = 0;i < this.waterArr.length;i++){
            if(this.waterArr.style == 6){
                continue;
            }
            this.waterArr.load();
        }
        //遍历爆了的水滴并绘制
        for(var j = 0;j < this.waterbrokenArr.length;j++){
            if(this.waterbrokenArr.style == 6){
                continue;
            }
            this.waterbrokenArr.load();
        }
    },
    add:function(water){
        this.waterArr.push(water);
    },
    remove:function(){
        for(var i = 0;i < this.waterArr.length;i++){
            if(this.waterArr[i].style >=6){
                this.waterArr.splice(i,1);
            }
        }
    },
    broken_add:function(water){
        this.waterbrokenArr.push(water);
    },
    remove_broken:function(){
        for(var i = 0;i < this.waterbrokenArr.length;i++){
            if(this.waterbrokenArr.style >=6 ){
                this.waterbrokenArr.splice(i,1);
            }
        }
    },
    move:function(){
        for(var i = 0;i < this.waterbrokenArr.length;i++) {
            if (this.waterbrokenArr[i].style == 6) {
                continue;
            }
            if (this.isJudge(this.waterbrokenArr[i].x, this.waterbrokenArr[i].y) || this.waterbrokenArr[i].x <= -5 || this.waterbrokenArr[i].x >= canvas.width + 5 || this.waterbrokenArr[i].y <= -5 || this.waterbrokenArr[i].y >= canvas.height + 5) {
                this.waterbrokenArr.splice(i, 1);
            }
            switch(this.waterbrokenArr.direction){
                case 'left':
                    this.waterbrokenArr[i].x--;
                    break;
                case 'right':
                    this.waterbrokenArr[i].x++;
                    break;
                case 'up':
                    this.waterbrokenArr[i].y--;
                    break;
                case 'down':
                    this.waterbrokenArr[i].y++;
                    break;
                default:
                    break;
            }
        }
    },
    isJudge:function(x,y){
        var map = game.map;
        var waterArr = game.waterCollection.waterArr;
        var smallwX = Math.floor(x / canvas.width / map.numX);
        var smallwY = Math.floor(y / canvas.height / map.numY);
        for(var i = 0;i < waterArr.length;i++){
            if(waterArr[i].x == (smallwX * canvas.width / map.numX + canvas.width / map.numX / 2)&&(waterArr[i].y == (smallwY * canvas.height / map.numY + canvas.height / map.numY / 2))&&(waterArr[i].style <=4)){
                waterArr[i].style++;
                if(waterArr[i].style >= 6){
                    waterArr[i].style = 6;
                }
                return true;
            }
            return false;
        }
    }
};





function Game(){
    this.map = null;
    this.waterCollection = null;
    this.isStart = false;
}

Game.prototype = {
//游戏初始化
    start:function(){
        var map = new Map();
        map.start();
        var waterCollection = new WaterCollect();
        for(var i = 0;i < map.mapArr.length;i++){
            var water = new Water();
            water.style = getRandomNum(1,4);
            water.x = map.mapArr[i].x;
            water.y = map.mapArr[i].y;
            waterCollection.add(water);
        }

    },
    //渲染
    apply:function(){
        this.waterCollection.fly();
        this.waterCollection.draw();
        this.apply();
    },
    //点击增加
    clickSelect:function(){
        var that = this;
        var map = this.map;
        canvas.onclick = function(e){
            e=e||window.event;
            if(that.gameOver()){
                alert('game over');
                return;
            }
            that.isStart = true;
            var x = e.clientX - canvas.
            var i = Math.floor()


        }




    }
    //游戏结束
    gameOver:function(){

    }
    //下一关
}


var game = new Game();
game.start();