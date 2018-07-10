var timer={}

function cookOrderRelease(orderID) {
    // "用于定时更新菜单栏信息，而不让每个厨师自行更新以造成闪烁！，定期更新时间为500ms，知道菜全部被做完后，清除定时器"
    cookListUpdate(orderID)

    cookListDomUpdate()

    arrangeCook()
    var timerDisk=setInterval(cookListDomUpdate,500)
}

function cookListUpdate(orderID) {
    let dishs=Restaurant.getInstance().orders[orderID].dishs
    let cdishs
    let tmp
    let tmpIndex

    for(let dish of Object.values(dishs)){
        cdishs=Restaurant.getInstance().cookingList
        tmp=0
        for (let index in  cdishs){
            if(cdishs[index].id==dish.id && !cdishs[index].state){
                Restaurant.getInstance().cookingList[index].desks.push(Restaurant.getInstance().orders[orderID].desk)
                Restaurant.getInstance().cookingList[index].orderIDs.push(orderID)
                break
            }
            tmp+=1
        }
        if(tmp>=Object.values(cdishs).length){
            tmpIndex=Date.now()
            Restaurant.getInstance().cookingList[tmpIndex+"-"+dish.id+"-"+Object.values(cdishs).length]={
                id:dish.id,
                name:dish.name,
                state:false,
                desks:[Restaurant.getInstance().orders[orderID].desk],
                orderIDs:[orderID],
                time:tmpIndex
            }
        }
    }


}
function arrangeCook() {
    //找出厨师和尚未做菜的中，长度最小的一个，然后来安排工作
    let cookList=getRestCookList()
    let dishList=getUndoDiskList()
    let len=0;
    let index1;
    let index;

    if(dishList.length>=cookList.length){
        len=cookList.length
    }else {
        len=dishList.length
    }

    for (let i=0;i<len;i++){
        var time=Date.now()
        cIndex=cookList[i]
        dIndex=dishList[i]
        if(Restaurant.getInstance().staffs[cIndex].state || Restaurant.getInstance().cookingList[dIndex].state) continue;
        Restaurant.getInstance().staffs[cIndex].state=true
        Restaurant.getInstance().cookingList[dIndex].state=true
        cookProcess(Restaurant.getInstance().staffs[cIndex].id,dIndex)

    }

}
function cookProcess(cookID,dIndex) {
    let cook=Restaurant.getInstance().staffs[cookID];
    let dish=Restaurant.getInstance().cookingList[dIndex];

    dish.cook=cook.name

    new Promise(resolve =>{
        let dishID=Restaurant.getInstance().cookingList[dIndex].id
        let timeCount=Restaurant.getInstance().menu[dishID].time*10

        //更新厨师状态：
        $("#cook-"+cookID+" .state").html(Restaurant.getInstance().cookingList[dIndex].name)
        $("#cook-"+cookID+" .clock").html(""+timeCount/10+"s")

        var timer=setInterval(function () {
            timeCount-=1
            if(timeCount<=0){
                clearInterval(timer)
                $("#cook-"+cookID+" .clock").html("")
                return resolve()
            }
            $("#cook-"+cookID+" .clock").html(""+timeCount/10+"s")
        },100)
    }).then(function () {
        Observer.getInstance().publish("cookFinished",Restaurant.getInstance().cookingList[dIndex])
        $("#cook-"+cookID+" .state").html("空闲")
        Restaurant.getInstance().staffs[cookID].state=false
        delete  Restaurant.getInstance().cookingList[dIndex]
        arrangeCook()
    })
}

function getRestCookList() {
    let ls=Restaurant.getInstance().staffs;
    let temp=[]
    for(let staff of Object.values(ls)){
        if(!staff.state && staff.role=="cook") temp.push(staff.id)
    }
    return temp
}
function getUndoDiskList() {
    let ls=Restaurant.getInstance().cookingList
    let temp=[]
    for(let index in ls){
        if(!ls[index].state) temp.push(index)
    }
    return temp
}

function findCooktoWork(){
    //在三秒内获取一个空闲的初始，做对应的剩余的菜
    new Promise((resolve,reject) =>{
        getRestPersonIntime(Date.now(),3,resolve,reject,"cook")
    }).then(function (id) {
        let cook=Restaurant.getInstance().staffs[id]
        if(!cook.state){
            cook.state=true
            Restaurant.getInstance().orders[orderID].cook=cook.id
        }else{
            //进行报错处理
        }
    })
}
