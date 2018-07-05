var region = document.getElementById("region-chb")
var product = document.getElementById("product-chb")
var dashboard = document.getElementById("dashboard")
var title = document.getElementById("title")
var saleCeils=document.getElementsByClassName("sale-data")
var ceilPreviousValue;
var currentCeil;
var data
var appName="Just-Test-Demo"
var linCan=new CanvasDrawing({id:"canvas-line"})
var barCan=new CanvasDrawing({id:"canvas-bar"})
var sigCan=new CanvasDrawing({id:"canvas-signal"})
var sigCanCon=document.getElementById("signal-canvas-container")

function dataGet() {
    //获取需要展示的商品名和销售地区，并去除重复项次
    var regions = []
    var products = []
    for (var i = 0; i < sourceData.length; i++) {
        if (regions.indexOf(sourceData[i].region) == -1) {
            regions.push(sourceData[i].region)
        }
        if (products.indexOf(sourceData[i].product) == -1) {
            products.push(sourceData[i].product)
        }
    }
    return {
        "地区": regions,
        "产品": products
    }
}

function genCkb(data) {
    var lis = []
    for (var key in data) {
        var temp = '<label for="' + key + '-全选"><input type="checkbox" id="' + key + '-全选" name="' + key + '" >全选</label>'
        for (var obj of data[key]) {
            temp += '<label for="' + obj + '"><input type="checkbox" id="' + obj + '" name="' + key + '" >' + obj + '</label>'
        }
        lis.push(temp)
    }
    return lis
}

function chbRenderToHTML(lis) {
    region.innerHTML = lis[0]
    product.innerHTML = lis[1]
}

function fetchRenderData() {
    var showDatas = []
    var datas=[]

    datas["地区"] = chkGetCheckedIds("地区")
    datas["产品"] = chkGetCheckedIds("产品")

    for(var i in sourceData){
        if(datas["地区"].indexOf(sourceData[i].region) != -1 && datas["产品"].indexOf(sourceData[i].product) != -1){
            sourceData[i].index=i
            showDatas.push(sourceData[i])
        }
    }

    return showDatas
}
function updateHash(){
    var datas=[]

    datas["地区"] = chkGetCheckedIds("地区")
    datas["产品"] = chkGetCheckedIds("产品")

    window.location.hash="#region="+datas["地区"].join("-")+"&producti="+datas["产品"].join("-")
}


function showDataOrderByRegion(showDatas,regions) {
    var data=[]
    regions.forEach(function(item){
        var count=0
        showDatas.forEach(function(sitem){
            if(sitem.region==item){
                data.push(sitem)
                count+=1
            }
        })
        data[item]=count
    })
    return data

}


function tableRenderToHTML(showDatas) {
    var html = ""
    var regions=dataGet()["地区"]
    var orderData=showDataOrderByRegion(showDatas,regions)
    var previousRegion=""
    /* 正常的for..of循环即可遍历数据，渲染出需要的表格。但为了单元格编辑，需添加data-id属性以用于定位保存，因此采用for...in循环
    for(var data of orderData){
        var temp;
        if(previousRegion!=data.region){
            temp= '<td rowspan="' + orderData[data.region] + '">' + data.region+ "</td>"+"<td>"+data.product+"</td>"
        }else{
            temp='<tr><td>'+data.product+'</td>'
        }
        for(var sale of data.sale){
            temp+='<td class="sale-data">'+sale+'</td>'
        }
        html+=temp+"</tr>"
        previousRegion=data.region
    }
    */
    for(var data in orderData){
        if(isNaN(data)){  //for...in会遍历到后面的自定义属性，因此需要进行判断
            break
        }
        var temp;
        if(previousRegion!=orderData[data].region){
            temp= '<tr><td rowspan="' + orderData[orderData[data].region] + '">' + orderData[data].region+ '</td><td class="product" data-no="'+data+'">'+orderData[data].product+"</td>"
        }else{
            temp='<tr><td class="product" data-no="'+data+'">'+orderData[data].product+'</td>'
        }
        for(var sale in orderData[data].sale){
            temp+='<td contenteditable="true" class="sale-data" data-id="'+orderData[data].index+"-"+sale+'">'+orderData[data].sale[sale]+'</td>'
        }
        html+=temp+"</tr>"
        previousRegion=orderData[data].region
    }
    dashboard.innerHTML = html   

    ceilEventBind()    
    linCan.lineDrawing(showDatas)
    barCan.barDrawing(showDatas)
}

window.onhashchange=function(event){
    
    var hash=decodeURI(window.location.hash)
    hash=hash.replace(/[\#\w\=]/g,"").replace(/\&/g,"-")
    hash=hash.split("-")
    for(var i in hash){
        chkCheckOneByID(hash[i])
    }
    this.console.log("hash changed")
    stateChanged()

}


function chkGetCheckedIds(name, check = true) {
    var nodeList = document.getElementsByName(name)
    var ids = []
    for (var node of nodeList) {
        if (node.checked == check && node.id.indexOf("全选") == -1) {
            ids.push(node.id)
        }
    }
    return ids
}

function chkCheckAll(name, check = true) {
    var nodeList = document.getElementsByName(name)
    for (var node of nodeList) {
        node.checked = check
    }
}

function chkCheckOneByID(id, check = true) {
    var node = document.getElementById(id)
    node.checked = check
}

function allChecked(name) {
    var nodeList = document.getElementsByName(name)
    var num = chkCheckNum(name)
    return num == nodeList.length - 1

}

function chkCheckNum(name) {
    var nodeList = document.getElementsByName(name)
    var num = 0
    for (var node of nodeList) {
        if (node.checked && node.id.indexOf("全选") == -1) {
            num += 1
        }
    }
    return num
}


function init() {
    var temp=readFromLocalStorage()
    if(temp){
        sourceData=temp
        console.log("data read from the localstorage!")
    }

    var datas = dataGet()
    var lis = genCkb(datas)
    chbRenderToHTML(lis)
}
function  checkboxEventBind() {
    /*选择框的事件处理*/
    var chbs = document.getElementsByTagName("input")
    for (var chb of chbs) {
        chb.onchange = function (event) {
            if (event.target.checked) {
                if (event.target.id.indexOf("全选") != -1) {
                    chkCheckAll(event.target.name)
                } else {
                    if (allChecked(event.target.name)) {
                        chkCheckAll(event.target.name)
                    }
                }
            } else {
                if (allChecked(event.target.name)){
                    chkCheckAll(event.target.name)
                }else{
                    chkCheckOneByID(event.target.name+"-全选", check = false)
                }
                if(chkCheckNum(event.target.name)==0){ //如果只有最后一个被选中，则禁止取消
                    event.target.checked=true
                }
            }
            // updateHash() 已有hashchanged替代
            updateHash() 
        }
    }
}

function stateChanged(){

    data=fetchRenderData()
    tableRenderToHTML(data)   

}


function ceilEventBind() {
    for(var i in saleCeils){
        saleCeils[i].onblur=function(ev){
            var validate=ceilValidate(ev.target.innerHTML)
            if(validate.code==-1){
                ev.target.innerHTML=ceilPreviousValue
            }else if(validate.code==1){
                var coor=ev.target.dataset.id.split("-")
                sourceDataUpadate(parseInt(coor[0]),parseInt(coor[1]),parseInt(ev.target.innerHTML))
                saveToLocalStorage()
            }
            showResult(validate)
        }
        saleCeils[i].onkeypress=function (ev) {
            currentCeil=this.target
            switch(ev.code){
                case "Escape":
                    this.target.innerHTML=ceilPreviousValue
                    break
                case "NumpadEnter":
                case "Enter":
                    var validate=ceilValidate(ev.target.innerHTML)
                    if(validate.code==-1){
                        ev.target.innerHTML=ceilPreviousValue
                    }else if(validate.code==1){
                        var coor=ev.target.dataset.id.split("-")
                        sourceDataUpadate(parseInt(coor[0]),parseInt(coor[1]),parseInt(ev.target.innerHTML))
                        ceilPreviousValue=ev.target.innerHTML
                        saveToLocalStorage()
                    }
                    showResult(validate)
                    break
            }
            if(isNaN(ev.key)){
                return false
            }

        }
        saleCeils[i].onfocus=function (ev) {
            ceilPreviousValue=ev.target.innerHTML
            currentCeil=this.target
        }
    }

    var productCeils=document.getElementsByClassName("product")
    for(var ceil of productCeils){
          ceil.addEventListener("mouseenter",function(event){

            sigCan.singleBarDrawing(sourceData[event.target.dataset.no])
            sigCanCon.style.display="block"
            sigCanCon.style.left=event.clientX+"px"
            sigCanCon.style.top=event.clientY-80+"px"
          })
          ceil.addEventListener("mouseout",function(event){
            sigCanCon.style.display="none"
          })


    }
        
    

}
function ceilValidate(value,desc="修改成功"){
    var msg={"code":1,"desc":desc}
    if(value==ceilPreviousValue){
        msg={"code":0,"desc":"没有做出任何修改"}
    }
    if(isNaN(value)){
        msg.code=-1
        msg.desc="请输入数字"
    }else{
        var value=parseInt(value)
        if(value<0){
            msg.code=-1
            msg.desc="请输入输入整数"
        }else if(value>1000){
            msg.code=-1
            msg.desc="销售数量不能≥1000"
        }
    }

    return msg
}

function showResult(msg){
    var infoMsg=document.getElementById("info-msg")
    var info=document.getElementById("info")
    if(msg.code==0){
        return
    }
    if(msg.code==-1){
        info.className="warning"
        infoMsg.innerHTML=msg.desc
    }else{
        info.className="success"
        infoMsg.innerHTML=msg.desc
    }
    setTimeout(function (info,infoMsg) {
        info.className=""
        infoMsg.innerHTML=""
    },3000,info,infoMsg)
}

function sourceDataUpadate(x,y,value){
    sourceData[x].sale[y]=value
}

function saveToLocalStorage() {
    var temp=JSON.stringify(sourceData)
    console.log(localStorage.setItem(appName,temp))
}
function readFromLocalStorage() {
    var temp=localStorage.getItem(appName)
    if(temp){
        temp=JSON.parse(temp)
    }
    return temp
}


window.onload = function () {    
    init()    
    data=fetchRenderData()
    tableRenderToHTML(data)

    var hashEvent=new HashChangeEvent({})
    window.dispatchEvent(hashEvent)

    linCan.lineDrawing(data)
    barCan.barDrawing(data)

    checkboxEventBind()   
    


}
