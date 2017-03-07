function Events(){
	this.eventLists={};
}

Events.prototype.on=function(key,func){
	if(!(key in this.eventLists)){
		this.eventLists[key]=[];
	}
	this.eventLists[key].push(func);
}
Events.prototype.emit=function(key,func){
    if(key in this.eventLists){
    	var args = Array.prototype.slice.call(arguments,1);
	    for(var i = 0; i < this.eventLists[key].length; i++) {
	          this.eventLists[key][i].apply(this,args);
	    }
    }
}


function Observer(data){
	this.data=data;
	this.walk(data);
	this.events=new Events();
}
var p=Observer.prototype;

p.walk=function(data){
	let val;
	for(let key in data){
		if(data.hasOwnProperty(key)){
			val=data[key];
			if(typeof val == "object"){			
				new Observer(val);
			}
			this.convert(key,val);
		}
	}
}
p.convert=function(key,val){
	let that=this;
	Object.defineProperty(this.data,key,{
		set:function(newVal){
			console.log("您设置了"+key+",新的值为"+newVal);
			that.events.emit(key,val,newVal);
			if(typeof newVal ==="object"){
				new Observer(newVal);
			}
			if(val===newVal) return;
			val=newVal;
		},
		get:function(){
			console.log("您访问了"+key);
			return val;
		}
	})
}
p.$watch=function(key,func){
	this.events.on(key,func);
}

let app1 = new Observer({
    name: 'youngwind',
    age: 25
 });