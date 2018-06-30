var cursor=document.getElementById("cursor");
var run=document.getElementById("run");
var direct=document.getElementById("direct");
var result=document.getElementById("result");
//1上2右3下4左
var curDirection=1;
var timerRotate=true;//动画定时器当前状态,防止同个动画运行
var timerMove=true;

function move(direct){
	var ag=cursor.style.transform.match(/\d+/);
	var ag=parseInt(ag[0]);
	switch(direct){
		case "GO":
			go(curDirection);	
			break;
		case "TUN LEF":
			curDirection=curDirection-1>0?curDirection-1:4;
			animateRotate(ag,ag-90);
			result.innerHTML="指令执行成功";
			break;
		case "TUN RIG":
			curDirection=curDirection+1<5?curDirection+1:1;
			animateRotate(ag,ag+90);
			result.innerHTML="指令执行成功";
			break;
		case "TUN BAC":
			curDirection=curDirection+2<5?curDirection+2:curDirection-2;
			animateRotate(ag,ag+180);
			result.innerHTML="指令执行成功";
			break;
		case "TRA LEF":
			go(4);
			break;
		case "TRA TOP":
			go(1);	
			break;
		case "TRA RIG":
			go(2);	
			break;
		case "TRA BOT":
			go(3);	
			break;
		case "MOV TOP":
			if(curDirection!=1){
				animateRotate((curDirection-1)*90,0);
				curDirection=1;
			}			
			go(1);	
			break;
		case "MOV RIG":
			if(curDirection!=2){
				animateRotate((curDirection-1)*90,90);
				curDirection=2;
			}			
			go(2);	
			break;
		case "MOV BOT":
			if(curDirection!=3){
					animateRotate((curDirection-1)*90,180);
					curDirection=3;
			}	
			go(3);	
			break;
		case "MOV LEF":
			if(curDirection!=3){
					animateRotate((curDirection-1)*90,270);
					curDirection=3;
				}	
			go(4);	
			break;
		default:
			result.innerHTML="指令执行失败";
	}
}
function go(dr) {
	var top=cursor.offsetTop;
	var left=cursor.offsetLeft;
	var ok=false;
	switch(dr){
		case 1:
			if(top-30>=0){
				animateMove("top",top,-1);
				ok=true;
			}
			break;
		case 2:
			if(left+30<=270){
				animateMove("left",left,1);
				ok=true;
			}
			break;
		case 3:
			if(top+30<=270){
				animateMove("top",top,1);
				ok=true;
			}
			break;
		case 4:
			if(left-30>=0){
				animateMove("left",left,-1);
				ok=true;
			}
			break;
		default:
			result.innerHTML="非法指令";	
	}
	if(ok){
		result.innerHTML="指令执行成功";
	}else{
		result.innerHTML="出界了";
		console.log("出界信息left top:",cursor.offsetLeft,cursor.offsetTop,curDirection)
	}
}

function animateRotate(start,end){
	if(timerRotate){
		var i=1;
		timerRotate=false;
		var step=(end-start)/30;
		var time1=setInterval(function(){
			if(i++==30){
				clearInterval(time1);
				timerRotate=true;
			}else{
				cursor.style.transform="rotate("+(start+step*i)+"deg)";
			}
		})
	}
}
function animateMove(dest,start,step){
	if(timerMove){
		var i=1;
		timerMove=false;
		var timer2=setInterval(function(){
			if(i++==30){
				clearInterval(timer2);
				timerMove=true;
			}else{
				cursor.style[dest]=(start+step*i)+"px";
			}
		})
	}
}


(function init(){
	var top=Math.floor(Math.random()*10)*30;
	var left=Math.floor(Math.random()*10)*30;
	cursor.style.left=left+"px";
	cursor.style.top=top+"px";
})()
run.onclick=function(){
	if(direct.value!=""){
		move(direct.value.trim());
	}
}
direct.onkeypress=function(event){
	var event=event|| window.event;
	if(event.keyCode==13){
		move(direct.value.trim());
	}
}