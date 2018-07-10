function goToDesk(sourceID,destID,time=null) {
    let sE=$("#waiter-"+sourceID)
    let dE=$("#desk-"+destID)
    let dF=getFirstDeskEl()  //从餐桌中间的过道传菜，因此[横坐标]只需要获取第一列的坐标即可
    let sP=getPosition(sE)
    let dP=getPosition(dE)
    let dFP=getPosition(dF)

    sE=$("#waiter-"+sourceID)
    dE=$("#desk-"+destID)
    let pos="translateX("+(dFP.left-sP.left+dE.outerWidth()-10)+"px) translateY("+(dP.top-sP.top-sE.outerHeight()/2+dE.outerHeight()/2)+"px) scale(0.7)"
    sE[0].style.transform=pos
    $("#waiter-"+sourceID+" .state").html(destID+"号桌")
}
function goToKitchen(wId) {
    let kE=$("#kitchen")
    let wE=$("#waiter-"+wId)
    let kP=getPosition(kE)
    let wP=getPosition(wE)

    wE=$("#waiter-"+wId)
    kE=$("#kitchen")
    let tmp="translate("+(kP.left-wP.left+kE.outerWidth()/2)+"px,"+(kP.top+kE.outerHeight()+50-wP.top)+"px)"
    wE[0].style.transform=tmp
    $("#waiter-"+wId+" .state").html("传菜")
}

function renderCusToDOM(cus,id="#reception") {
    let tmp=""
    for(let c of Object.values(cus)){
        if(c.status==0){
            tmp+='<li data-id="'+c.id+'" id="cus-'+c.id+'">'+c.name+'</li>'
        }
    }
    $(id).append(tmp)
}
function cusRemove(cID) {
    $("#reception #cus-"+cID).remove()
}

function addDeskToDom(desk) {
    let tempStr=`<li id="desk-${desk.id}" class="desk${desk.seats>2?4:4} data-deskid="${desk.id}">`;
    for(var i=0;i<desk.seats;i++){
        tempStr+=`<div class="chair chair${i+1}"></div>`
    }
    tempStr+=` <div class="desk">
            <ul class="dish-container" id="dish-container-${desk.id}">
            </ul>
        </div>
    </li>
    `
    $("#dining-area").append(tempStr)
}

function  addCookToDom(cook) {
    addPersonToDom("#kitchen","cook",cook)
}
function  addWaiterToDom(waiter) {
    addPersonToDom("#waiter-area","waiter",waiter)
}
function  addPersonToDom(id,role,person) {
    let tempStr=`
    <li class="person ${role}" id="${role}-${person.id}">
        <div>名:
            <span>${person.name}</span>
        </div>
        <div>号:
            <span>${person.id}</span> <span class="clock"></span>
        </div>
        <div>状:
            <span class="state">空闲</span>
        </div>
        <div>改:
            <span class="op person-fire">解雇</span>
        </div>
    </li>
    `

    $(id).append(tempStr)
}
function  getPosition(obj) {//获取某元素以浏览器左上角为原点的坐标
    if(obj.length<=0){
        return
    }
    let t = obj[0].offsetTop;
    let l = obj[0].offsetLeft;
    while (obj[0] = obj[0].offsetParent) {
        t += obj[0].offsetTop;
        l += obj[0].offsetLeft;
    }
    return {
        left:l,
        top:t
    }
}
function waiterRest(wID) {
    Restaurant.getInstance().staffs[wID].state=false
    $("#waiter-"+wID)[0].style.transform=""
    $("#waiter-"+wID+" .state").html("空闲")
}
function getFirstDeskEl() {
    let dom=$("#dining-area > li").first()
    return dom
}
function cookListDomUpdate() {
    let clist=Restaurant.getInstance().cookingList;
    let tmp='';
    let index=0
    $("#cooking-list").empty()
    for(let cl in clist){
        index++
        tmp=`
        <tr>
            <td>${index}</td>
            <td data-id="${clist[cl].id}">${clist[cl].name}</td>
            <td>${clist[cl].desks.join(',')}</td>
            <td class="state">${clist[cl].state?clist[cl].cook:"待分配"}</td>
        </tr>
        `
        $("#cooking-list").append(tmp)
    }
}
function renderDishToTable(deskID,dishs){
    let tmp=""

    for(let dish of Object.values(dishs)){
        tmp+='<li class="dish-'+dish.id+'" title="'+dish.name+'"></li>'
    }
    $("#dish-container-"+deskID).empty()
    $("#dish-container-"+deskID).append(tmp)


}