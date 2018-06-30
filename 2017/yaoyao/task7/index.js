var tb=document.getElementById("tb");
var grades=[
	["小明",78,52,68],
	["小红",18,92,60],
	["小黑",72,72,50],
	["小化",82,82,90]
]
for(var i=0;i<grades.length;i++){
	var sum=0;
	for(var j=1;j<grades[i].length;j++){
		sum+=grades[i][j];
	}
	grades[i][j]=sum;
}

function insertData(){
	var body=document.getElementsByTagName("tbody")[0];
	if(body){
		body.parentNode.removeChild(body)
		// console.log(body)
		// body.outerHTML="";
	}
	var tbody=tb.createTBody();
	for(var i=0;i<grades.length;i++){
		var column=tbody.insertRow(i);
		for(var j=0;j<grades[i].length;j++){
			column.insertCell(j).innerHTML=grades[i][j];
		}
	}
}
function orderGrade(index,order){
	grades=grades.sort(function(a,b){
		if(order==0){
			return a[index]-b[index];
		}
		return b[index]-a[index];
	})
}
var ups=document.getElementsByClassName("up");
var downs=document.getElementsByClassName("down");

bindEvent(ups,1);
bindEvent(downs,0);

function bindEvent(lists,order){
	for (var i = 0; i < lists.length; i++) {
		lists[i].index=i+1;
		lists[i].onclick=function(){
			orderGrade(this.index,order);
			tbody=[];
			insertData();
		}
	}
}
insertData();
