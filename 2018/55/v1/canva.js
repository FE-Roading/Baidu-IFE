var canvas=document.getElementById("canvas")
var ctx=canvas.getContext('2d')
var height=canvas.height
var width=canvas.width
var origin={
    x:0,
    y:width
}


function drawBar(data){
    var max=getMaxData(data)
    var perY=(height-50)/max.max 
    var perX=(450-10)/max.groupN/13
    var groupX=perX
    var startX=25+perX
    var startY=400-(20+perY)
    var colors=["#DAA520","#D6D6D6","#D2691E","#D02090","#CDCD00","#CDC673","#CDBE70","#CDAA7D","#CD950C","#CD8500","#CD6889","#CD4F39"]

    canvas.height=400

    //画坐标系       
    ctx.fillStyle="#FF0000"; 
    ctx.moveTo(25,380)
    ctx.lineTo(395,380)
    ctx.moveTo(25,380)
    ctx.lineTo(25,20)
    for(var i=0;i<11;i++){
        var tempY=380-35*i
        console.log(tempY)
        ctx.moveTo(startX,tempY)
        ctx.lineTo(475,tempY)
        ctx.strokeText((max.max/10)*i,5,tempY,20)
    }
    ctx.stroke()

    for(var area in data){        
        for(var con of data[area]){
           for(var pdc in con){
               for(var sale in con[pdc]){
                   ctx.fillStyle=colors[sale]
                   ctx.fillRect(startX,380-(perY*con[pdc][sale]),perX,perY*con[pdc][sale])
                    startX+=perX
                    
               } 
            startX+=perX    
        
           }
        }
    } 
    ctx.stroke()
}



function getMaxData(datas){
    var em=[]
    var groupN=0
    var max=0

    for(var area in datas){        
       for(var con of datas[area]){
          for(var sale in con){
             groupN+=1
              em=em.concat(con[sale])

          }
       }
    }
    max=Math.max(...em)
    return {
        max:max,
        groupN:groupN,
    }
}

