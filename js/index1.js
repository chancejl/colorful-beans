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

function Drop(x,y){
    this.x = x;
    this.y = y;
    this.style = 1;
    this.color = 'red';
    // this.arr = [[15,20],[20,20],[30,35],[50,50]];
    this.r1 = null;
    this.r2 = null;

    // this.step = 0;
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
            // case 5:
            //     this.draw5();
            //     break;
            default:
                break;
        }
    },

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

function smallDrop(x,y){
    this.x = x;
    this.y = y;
    this.color = 'red';
    this.step = 0;
    this.left = {};
    this.right = {};
    this.up = {};
    this.down = {};
    this.style = 1;
}
smallDrop.prototype = {
    draw0:function(ele){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.ellipse(ele.x,ele.y,10,10,0,0,2 * Math.PI,true);
        ctx.fill();
    },
    drawSmall:function() {
        switch (this.style) {
            case 1:
                this.draw1();
                break;
            default:
                break;
        }
    },
    draw1:function(){
        this.step++;
        //左边
        this.left = new smallDrop(this.x - this.step,this.y);
        this.left.draw0(this.left);

        //右边
        this.right = new smallDrop(this.x + this.step,this.y);
        this.right.draw0(this.right);

        //上边
        this.up = new smallDrop(this.x,this.y - this.step);
        // drop_u.direction = 'up';
        this.up.draw0(this.up);

        //下边
        this.down = new smallDrop(this.x,this.y + this.step);
        // drop_d.direction = 'down';
        this.down.draw0(this.down);

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


var dropArr = [];
for(var i = 0;i < canvas.width / 100;i++){
    for(var j = 0;j < canvas.height / 100;j++){
        var x = (canvas.width / 7) * j + canvas.width / 7 / 2;
        var y = (canvas.height / 7) * i + canvas.height / 7 / 2;
        var drop = new Drop(x,y);
        drop.style = getRandomNum(1,4);
        dropArr.push(drop);
    }
}


var isOpen = false;
var brokenArr = [];
canvas.onclick = function(e) {
    e = e || window.event;
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;

    for (var i = 0; i < dropArr.length; i++) {
        dropArr[i].draw();
        if (ctx.isPointInPath(x, y)) {
            if(dropArr[i].style >=6){
                dropArr[i].style = 6;
            }
            dropArr[i].style++;
            if(dropArr[i].style > 4){
                brokenArr.push(new smallDrop(dropArr[i].x,dropArr[i].y));
                isOpen = true;
                dropArr.splice(i,1);
            }
        }
    }

};


function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var m = 0; m < dropArr.length; m++) {
        dropArr[m].draw();
    }
    var b1 = [];
    for(var n = 0;n < brokenArr.length;n++){
        // if(isOpen) {
            brokenArr[n].drawSmall();
            b1.push(brokenArr[n].left);
            b1.push(brokenArr[n].right);
            b1.push(brokenArr[n].up);
            b1.push(brokenArr[n].down);
            // console.log(brokenArr[n].left);
            // isOpen = false;
        // }
    }
    // for(var i = 0;i < b1.length;i++){
    //     b1[i].drawSmall();
    //     console.log(b1[i].left);
    //
    // }


    for(var i = 0;i < dropArr.length;i++){
        for(var j = 0;j < b1.length;j++){

           var result1 = b1[j].x <= dropArr[i].x + dropArr[i].r1 && b1[j].x >= dropArr[i].x - dropArr[i].r1;
           var result2 = b1[j].y <= dropArr[i].y + dropArr[i].r2 && b1[j].y >= dropArr[i].y - dropArr[i].r2;
            if(result1&&result2){
                // if(dropArr[j].style > 4){
                //     dropArr[j].style = 5;
                // }
                //
                var p = dropArr[i].style;
                dropArr[i].style += 1;
                var q = dropArr[i].style;
                b1.splice(j,1);


            }

        }
    }



    window.requestAnimationFrame(animation);
}
animation();


// //碰撞
// function isJudge(x,y){
//     var i = Math.floor(x / 100);
//     var j = Math.floor(y / 100);
//     for(var )
// }