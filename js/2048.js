var game={
    RN:4,
    CN:4,
    data:null,
    score:0,
    state:1,
    GAMEOVER:0,
    RUNNING:1,
    //启动游戏
    start:function(){
        this.state=this.RUNNING;
        this.score=0;
        this.data=[];
        for(var r=0;r<this.RN;r++){
            this.data[r]=[];
            for(var c=0;
                c<this.CN;
                this.data[r][c]=0,c++);
        }
        this.randomNum();
        this.randomNum();
        this.updateView();
        //为页面绑定键盘按下事件
        document.onkeydown=function(e){
            switch(e.keyCode){
                case 37: this.moveLeft();break;
                case 38: this.moveUp();break;
                case 39: this.moveRight();break;
                case 40: this.moveDown();break;
            }
        }.bind(this);/*this是start方法的this*/
    },
    move:function(callback){
        var before=String(this.data);
        callback();//this->window
        var after=String(this.data);
        if(before!=after){
            this.randomNum();
            if(this.isGameOver()){
                this.state=this.GAMEOVER;
            }
            this.updateView();
        }
    },
    isGameOver:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                if(this.data[r][c]==0){return false;}
                else if(c<this.CN-1
                    &&this.data[r][c]==this.data[r][c+1]){
                    return false;
                }
                else if(r<this.RN-1
                    &&this.data[r][c]==this.data[r+1][c]){
                    return false;
                }
            }
        }
        return true;
    },
    moveLeft:function(){
        this.move(function(){
            for(var r=0;r<this.RN;r++){
                this.moveLeftInRow(r);
            }
        }.bind(this));/*this是moveLeft方法的this*/
    },
    moveLeftInRow:function(r){
        for(var c=0;c<this.CN-1;c++){
            var nextc=this.getNextInRow(r,c);
            if(nextc==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[r][nextc];
                    this.data[r][nextc]=0;
                    c--;
                }else if(this.data[r][c]
                    ==this.data[r][nextc]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[r][nextc]=0;
                }
            }
        }
    },
    getNextInRow:function(r,c){
        c++;
        for(;c<this.CN;c++){
            if(this.data[r][c]!=0){
                return c;
            }
        }
        return -1;
    },
    moveRight:function(){
        this.move(function(){
            for(var r=0;r<this.RN;r++){
                this.moveRightInRow(r);
            }
        }.bind(this));
    },
    moveRightInRow:function(r){
        for(var c=this.CN-1;c>0;c--){
            var prevc=this.getPrevInRow(r,c);
            if(prevc==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[r][prevc];
                    this.data[r][prevc]=0;
                    c++;
                }else if(this.data[r][c] ==this.data[r][prevc]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[r][prevc]=0;
                }
            }
        }
    },
    getPrevInRow:function(r,c){
        c--;
        for(;c>=0;c--){
            if(this.data[r][c]!=0){
                return c;
            }
        }
        return -1;
    },
    moveUp:function(){
        this.move(function(){
            for(var c=0;c<this.CN;c++){
                this.moveUpInCol(c);
            }
        }.bind(this));
    },
    moveUpInCol:function(c){
        for(var r=0;r<this.RN-1;r++){
            var nextr=this.getNextInCol(r,c);
            if(nextr==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[nextr][c];
                    this.data[nextr][c]=0;
                    r--;
                }else if(this.data[r][c]
                    ==this.data[nextr][c]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[nextr][c]=0;
                }
            }
        }
    },
    getNextInCol:function(r,c){
        r++;
        for(;r<this.RN;r++){
            if(this.data[r][c]!=0){
                return r;
            }
        }
        return -1;
    },
    moveDown:function(){
        this.move(function(){
            for(var c=0;c<this.CN;c++){
                this.moveDownInCol(c);
            }
        }.bind(this));
    },
    moveDownInCol:function(c){
        for(var r=this.RN-1;r>0;r--){
            var prevr=this.getPrevInCol(r,c);
            if(prevr==-1){break;}
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[prevr][c];
                    this.data[prevr][c]=0;
                    r++;
                }else if(this.data[r][c]
                    ==this.data[prevr][c]){
                    this.data[r][c]*=2;
                    this.score+=this.data[r][c];
                    this.data[prevr][c]=0;
                }
            }
        }
    },
    getPrevInCol:function(r,c){
        r--;
        for(;r>=0;r--){
            if(this.data[r][c]!=0)
                return r;
        }
        return -1;
    },
    //将数组中每个元素更新到页面的div中
    updateView:function(){
        for(var r=0;r<this.RN;r++){
            for(var c=0;c<this.CN;c++){
                var div= document.getElementById("c"+r+c);
                if(this.data[r][c]!=0){
                    div.innerHTML=this.data[r][c];
                    div.className="cell n"+this.data[r][c];
                }else{//否则
                    div.innerHTML="";
                    div.className="cell";
                }
            }
        }
        //找到id为score的元素，设置其内容为score属性
        document.getElementById("score")
            .innerHTML=this.score;
        //如果游戏状态为结束
        if(this.state==this.GAMEOVER){
            document.getElementById("gameover")
                .style.display="block";
            document.getElementById("final")
                .innerHTML=this.score;
        }else{
            document.getElementById("gameover").style.display="none";
        }
    },
    randomNum:function(){
        while(true){
            var r=Math.floor(Math.random()*(this.RN));
            var c=Math.floor(Math.random()*(this.CN));
            if(this.data[r][c]==0){
                this.data[r][c]=Math.random()<0.5?2:4;
                break;
            }
        }
    }
};
game.start();