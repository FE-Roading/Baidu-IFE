var schOption={
	bj:[["bj-bj","背景大学"],["bj-qh","清华大学"],["bj-bjjm","北京经贸大学"]],
	cd:[["cd-bj","成都大学"],["cd-dzkj","电子科技大学"],["cd-cdjm","成都经贸大学"]],
	cq:[["cq-cq","重庆大学"],["cq-cqkj","重庆科技大学"],["cq-cqjm","重庆经贸大学"]]
}

var wkInfo=document.getElementById("wkinfo");
var stuInfo=document.getElementById("stuinfo");
var btn=document.getElementById("btn");
var stuSelect=document.getElementById("stuselect");
var schSelect=document.getElementById("schselect");

var radios=document.querySelectorAll(".role input");
for(var i=0;i<radios.length;i++){
	radios[i].onchange=function(event){
		var event=event || window.event;
		if(event.target.value==="student"){
			stuInfo.style.display="block";
			wkInfo.style.display="none";
		}else{
			stuInfo.style.display="none";
			wkInfo.style.display="block";
		}
	}
}
btn.onclick=function(event){
	var event=event || window.event;
	if(event.preventDefault){
		event.preventDefault();
	}else{
		event.returnValue=false;
	}
}

stuSelect.onchange=function(event){
	var event=event || window.event;
	var options=schOption[event.target.value];
	schSelect.innerHTML="";
	for (var i = 0; i < options.length; i++) {
		var op=new Option(options[i][1],options[i][0])
		schSelect.add(op,undefined);
	}
}

