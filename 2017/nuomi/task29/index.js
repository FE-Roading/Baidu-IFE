var mobReg={
	"移动号段":/^1(34|35|36|37|38|39|47|50|51|52|57|58|59|78|82|83|84|87|88)\d{8}/,
	"联通号段":/^1(30|31|32|45|55|56|71|75|76|85|86)\d{8}/,
	"电信号段":/^1(33|49|53|73|77|80|81|89)\d{8}/,
	"虚拟运营商":/^170\d{8}/
}
function mobVerify(){
	var mobText=mob.value.trim();
	if(mobText!="" && mobText.length==11){
		var mobResult=false;
		for(var i in mobReg){
			if(mobText.search(mobReg[i])!=-1){
				mobResult=true;
				break;
			}
		}
		if(mobResult){
			mobinfo.innerHTML="yes,"+i;			
		}else{			
			mobinfo.innerHTML="no,您输入的不是有效号码";
		}
	}else{
		mobinfo.innerHTML="no,请您输入待匹配的号码";
	}
}
function strVerify(){
	var strReg=/\b([a-zA-Z]+)\s\1\b/g;
	var strText=str.value.trim();
	if(strText.search(strReg)!=-1){
		strinfo.innerHTML="yes,有相邻重复单词";
	}else{
		strinfo.innerHTML="no,没有相邻重复单词";
	}
}
function eventBind(elb,eli,func){
	elb.onclick=func;
	eli.onkeypress=function(event){
		var event=event || window.event;
		if(event.charCode==13){
			func()
		}
	}
}
var mobvf=document.getElementById("mobvf");
var mob=document.getElementById("mob");
var mobinfo=document.getElementById("mobinfo");
var strvf=document.getElementById("strvf");
var str=document.getElementById("str");
var strinfo=document.getElementById("strinfo");

eventBind(mobvf,mob,mobVerify);
eventBind(strvf,str,strVerify);
