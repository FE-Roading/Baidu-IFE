var username=document.getElementById("username");
var pw1=document.getElementById("passwd1");
var pw2=document.getElementById("passwd2");
var mail=document.getElementById("mail");
var mobile=document.getElementById("mobile");
var btn=document.getElementById("btn");
function focusEvent(tips){
	return function(event){
		var event=event || window.event;
		var id=event.target.id;
		var p=document.getElementsByClassName(id)[0];
		p.innerHTML=tips;
	}
}
function blurEvent(func){
	return function(event){
		var event=event || window.event;
		var id=event.target.id;
		var p=document.getElementsByClassName(id)[0];
		var rel=func();
		if(rel.result){
			p.className=id+" tright";
			event.target.className="iright";
		}else{
			p.className=id+" twrong";
			event.target.className="iwrong";
		}
		p.innerHTML=rel.reason;
	}
}
function vName(){
	var len=username.value.trim()
	len=len.length;
	var rl=true;
	var rn="用户名正确";
	if(len==0){
		rl=false;
		rn="用户名不能为空";
	}else if(len<3){
		rl=false;
		rn="用户名长度不够";
	}else if(len>16){
		rl=false;
		rn="用户名长度过长";
	}
	return {result:rl,reason:rn};
}
function vPw1(){
	var len=pw1.value.trim()
	len=len.length;
	var rl=true;
	var rn="密码输入正确";
	if(len==0){
		rl=false;
		rn="密码不能为空";
	}else if(len<6){
		rl=false;
		rn="密码长度不够";
	}
	return {result:rl,reason:rn};
}
function vPw2(){
	var len=pw2.value.trim()
	len=len.length;
	var rl=true;
	var rn="密码输入正确";
	if(len==0){
		rl=false;
		rn="密码不能为空";
	}else if(len<6){
		rl=false;
		rn="密码长度不够";
	}else if(pw2.value!=pw1.value){
		rl=false;
		rn="两次输入密码不匹配";
	}
	return {result:rl,reason:rn};
}
function vMail(){
	var rl=true;
	var rn="邮箱输入正确";
	if(mail.value==""){
		rl=false;
		rn="邮箱不能为空";
	}else if(!(/^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/.test(mail.value))){
		rl=false;
		rn="邮箱格式不正确";
	}
	return {result:rl,reason:rn};
}
function vMob(){
	var rl=true;
	var rn="手机号码输入正确";
	if(mobile.value==""){
		rl=false;
		rn="手机号码不能为空";
	}else if(!(/(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.test(mobile.value))){
		rl=false;
		rn="手机号码格式不正确";
	}
	return {result:rl,reason:rn};
}


username.onfocus=focusEvent("用户名的字符长度为3-16个字符");
username.onblur=blurEvent(vName);
pw1.onfocus=focusEvent("密码长度为5个字符以上");
pw1.onblur=blurEvent(vPw1);
pw2.onfocus=focusEvent("请再次输入密码");
pw2.onblur=blurEvent(vPw2);
mail.onfocus=focusEvent("请输入邮箱地址");
mail.onblur=blurEvent(vMail);
mobile.onfocus=focusEvent("请输入11位的手机号码");
mobile.onblur=blurEvent(vMob);
btn.onclick=function(event){
  var rel=document.getElementsByClassName("twrong");
  if(rel.length==0){
  	alert("提交成功")
  }else{
  	alert("提交失败")
  }
  var event=event || window.event;
  event.preventDefault();
}