var cursor=document.getElementById("cursor");
var run=document.getElementById("run");
var direct=document.getElementById("direct");
var result=document.getElementById("result");
//1上2右3下4左
var curDirection=1;

function move(direct){
	var ag=cursor.style.transform.match(/\d+/);
	var ag=parseInt(ag[0]);
	switch(direct){
		case "GO":
			if(go(curDirection)){
				result.innerHTML="指令执行成功";
			}else{
				result.innerHTML="出界了";
				console.log("出界信息left top:",cursor.offsetLeft,cursor.offsetTop,curDirection)
			}			
			break;
		case "TUN LEF":
			curDirection=curDirection-1>0?curDirection-1:4;
			ag=ag-90;
			cursor.style.transform="rotate("+ag+"deg)";
			result.innerHTML="指令执行成功";
			break;
		case "TUN RIG":
			ag=ag+90;
			curDirection=curDirection+1<5?curDirection+1:1;
			cursor.style.transform="rotate("+ag+"deg)";
			result.innerHTML="指令执行成功";
			break;
		case "TUN BAC":
			ag=ag+180;
			curDirection=curDirection+2<5?curDirection+2:curDirection-2;
			cursor.style.transform="rotate("+ag+"deg)";
			result.innerHTML="指令执行成功";
			break;
		default:
			result.innerHTML="指令执行失败";
	}
}
function go(dr) {
	var top=cursor.offsetTop;
	var left=cursor.offsetLeft;
	switch(dr){
		case 1:
			top=top-30;
			if(top>=0){
				cursor.style.top=top+"px";
			}else{
				return false;
			}
			break;
		case 2:
			left=left+30;
			if(left<=280){
				cursor.style.left=left+"px";
			}else{
				return false;
			}
			break;
		case 3:
			top=top+30;
			if(top<=270){
				cursor.style.top=top+"px";
			}else{
				return false;
			}
			break;
		case 4:
			left=left-30;
			if(left>=0){
				cursor.style.left=left+"px";
			}else{
				return false;
			}
			break;
		default:
			result.innerHTML="非法指令";	
	}
	return true;
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