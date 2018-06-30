function Observer(data){
	this.data=data;
	this.walk(data);
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
	Object.defineProperty(this.data,key,{
		set:function(newVal){
			console.log("您设置了"+key+",新的值为"+newVal);
			if(val===newVal) return;
			val=newVal;
		},
		get:function(){
			console.log("您访问了"+key);
			return val;
		}
	})
}
var app1 = new Observer({
  name: 'youngwind',
  age: 25,
  others:{
		gender:"man",
		desc:"Now is good"
  }
});

var app2 = new Observer({
  university: 'bupt',
  major: 'computer'
});