一.首先是页面的布局，在顶部是关卡数和剩余球数，中间是核心的canvas画布，底部是重新开始游戏的按钮。
二.canvas画布上逻辑的实现
1）首先个人觉得不要一下在就想着把所有球的排布一下子做好，第一步要先绘制出一个球，在这个球的基础上可以点击变大最后变成四个小球，并且四个小球可以上下左右匀速移动；

2）当一个球的动作都写好之后，需要考虑进行封装对象，由于在球碰撞之后需要有新的样式，所以后续有碰撞检测，需要知道每个球的坐标，并且小球是移动的，所以我建立了两个对象，一个存放大球 Drop，一个存放小球SmallDrop，具体球的方法上代码：

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

3）本游戏的核心：

（1）this.style进行球的变化，点击球球的样式会根据style来变化
（2）this.dir进行小球的变化，小球会根据dir来决定运动方向

（3）碰撞检测 
（4）本地存储

![image](https://github.com/chancejl/test/blob/master/color.png)
