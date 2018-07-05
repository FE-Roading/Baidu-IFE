function CanvasDrawing(config){
    this.canvas=document.getElementById(config.id)
    this.ctx=this.canvas.getContext("2d")
    this.data={}
    this.colors=config.colors?config.colors:["#DAA520","#D6D6D6","#D2691E","#D02090","#CDCD00","#CDC673","#CDBE70","#CDAA7D","#CD950C","#CD8500","#CD6889","#CD4F39"]
    this.x=config.x?config.x:25;  //设置原点坐标
    this.y=config.y?config.y:360-20;  //设置原点坐标
    this.groupSpaceX=0;  //待子类初始化实现

}

CanvasDrawing.prototype={
    getDataRange:function(){
        var em=[]
        var max=0
        var min=0
        var itemNum=0
        var groupNum=0

        for(var item in this.data){
            if(!isNaN(item)){
                em=em.concat(this.data[item].sale)
                itemNum+=this.data[item].sale.length
            }            
        }
        groupNum=this.data.length
        max=Math.max(...em)
        min=Math.min(...em)
        return {
            max:max,
            min:min,
            groupNum:groupNum,            
            itemNum:itemNum
        }
    },
    coordDrawing:function(){
        var ex=this.canvas.width-2*this.x
        var ey=this.canvas.height-this.y
        var dataInfo=this.getDataRange()
        var yStep=0
        var temp=0
        var textwidth=20
        var yMeter=0
        var ytemp=0

        this.canvas.height=360  //清空画布

        ytemp=30-dataInfo.max%10
        this.xStep=(ex-this.x)/13
        this.groupSpaceX=this.xStep/12
        this.perY=(this.y-ey)/(dataInfo.max+ytemp)  //设置y轴的单位长度
        yMeter=(dataInfo.max+ytemp)/10
        yStep=(this.y-ey)/10       
  
        //画出坐标线
        this.ctx.strokeStyle="#000"
        this.ctx.moveTo(this.x,this.y)
        this.ctx.lineTo(ex,this.y)
        this.ctx.moveTo(this.x,this.y)
        this.ctx.lineTo(this.x,ey)

        //画出坐标文字
        temp=this.groupSpaceX-textwidth/2+this.xStep/2
        for(var i=1;i<13;i++){            
            this.ctx.strokeText(i+"月",this.x+temp,this.y+10,textwidth)
            temp+=this.xStep+this.groupSpaceX
        }
        temp=yStep
        for(var i=1;i<11;i++){
            this.ctx.strokeText(yMeter*i,this.x-textwidth-2,this.y-temp,textwidth)
            this.ctx.moveTo(this.x,this.y-temp)
            this.ctx.lineTo(ex,this.y-temp)
            temp+=yStep
        }
        this.ctx.stroke()
    },
    aBandonBarDrawing:function(data){
        var data=data?data:this.data
        var width=this.xStep/data.length
        var tempX=this.x+this.groupSpaceX
        
        this.coordDrawing()

        for(var i in data){
            if(!isNaN(i)){                
                for(var index in data[i].sale){
                    this.ctx.fillStyle=this.colors[index]
                    this.ctx.fillRect(tempX,this.y-this.perY*data[i].sale[index],width,this.perY*data[i].sale[index])
                    tempX+=width
                }
                tempX+=this.groupSpaceX
            }
        }
        this. tuliDrawing(data)

    },
    barDrawing:function(data){
        var data=data?data:this.data
        var width=this.xStep/data.length   
        this.data=data

        this.coordDrawing()
    
        for(var i in data){
            if(!isNaN(i)){
                this.ctx.fillStyle=this.colors[i]
                var tempX=this.x+this.groupSpaceX+i*width
                for(var index in data[i].sale){                                        
                    this.ctx.fillRect(tempX,this.y-this.perY*data[i].sale[index],width,this.perY*data[i].sale[index])
                    tempX=tempX+this.xStep+this.groupSpaceX
                }
            }
        }
        this.ctx.moveTo(this.x,this.y)

    },
    singleBarDrawing:function(data){
        this.data=[data]
        var tempX=this.x+this.groupSpaceX

        this.coordDrawing()
        this.ctx.fillStyle="green"

        for(var i in data.sale){
            this.ctx.fillRect(tempX,this.y-this.perY*data.sale[i],this.xStep,this.perY*data.sale[i])
            tempX+=this.groupSpaceX+this.xStep
        } 


    },
    lineDrawing:function(data){
        var data=data?data:this.data
        this.data=data
        
        this.coordDrawing()
        
        for(var i in data){
            if(!isNaN(i)){
                this.ctx.beginPath()
                this.ctx.strokeStyle=this.colors[i]
                var tempX=this.x+this.groupSpaceX+this.xStep/2
                var tempY;
                for(var index in data[i].sale){
                    tempY=this.y-this.perY*data[i].sale[index]
                    if (index==0){
                        this.ctx.moveTo(tempX,tempY)
                    }else{
                        this.ctx.lineTo(tempX,tempY)
                    }
                    tempX=tempX+this.xStep+this.groupSpaceX
                }  
                this.ctx.stroke()                 
            }        
        }
        this. tuliDrawing(data)      
    },
    tuliDrawing:function(data){
        var data=data?data:this.data
        var tempY

        for(var i in data){
            if(!isNaN(i)){
                this.ctx.strokeStyle=this.colors[i]
                tempY=50+i*20
                this.ctx.beginPath()
                this.ctx.moveTo(this.canvas.width-this.x-20,tempY)
                this.ctx.lineTo(this.canvas.width-20,tempY)
                this.ctx.closePath()   
                this.ctx.stroke()
                this.ctx.strokeText(data[i].region+"-"+data[i].product,this.canvas.width-this.x-20,tempY+10,40) 
                           
            }        
        }
    }


}