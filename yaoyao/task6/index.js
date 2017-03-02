var fixBtn=document.getElementById("fixed");
var main=document.getElementById("main");
var mask=document.getElementById("mask");
var alertW=document.getElementById("alertW");
var alertTitle=document.getElementById("alertTitle");
var zoom=document.getElementById("zoom");
var cancel=document.getElementById("cancel");
fixBtn.onclick=function(){
	mask.className="mask";
	alertW.className="alertW";
	alertW.style.display="block";
	mask.style.display="block";
}

//鼠标拖动窗口代码
alertTitle.onmousedown=function(){
	var mouseLeft=event.clientX-alertW.offsetLeft;
	var mouseTop=event.clientY-alertW.offsetTop;
	var width=alertW.offsetWidth;
	var height=alertW.offsetHeight;

	alertTitle.onmousemove=function(){
		var event=event || window.event;
		var screenX=mask.offsetWidth;
		var screenY=mask.offsetHeight;
		window.getSelection?window.getSelection().removeAllRanges(): document.selection.empty();
		if(screenX>=(event.clientX-mouseLeft+width) && event.clientX-mouseLeft>=0){
			alertW.style.left=event.clientX-mouseLeft+"px";
		}
		if(screenY>=(event.clientY-mouseTop+height) && event.clientY-mouseTop>=0){		
			alertW.style.top=event.clientY-mouseTop+"px";
		}
	}
}
alertTitle.onmouseup=document.body.onmouseup=function(){
	alertTitle.onmousemove=null;
}


mask.onclick=cancel.onclick=function(){
	mask.style.display="none";
	alertW.style.display="none";
}
