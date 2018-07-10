var rst=Restaurant.getInstance()
var ob=Observer.getInstance()

ob.subscribe("cusCome",cusCome)
ob.subscribe("orderDish",orderDish)
ob.subscribe("orderRelease",orderRelease)
ob.subscribe("cookOrderRelease",cookOrderRelease)
ob.subscribe("cookFinished",cookFinished)
ob.subscribe("Eating",Eating)
ob.subscribe("payBill",payBill)
rstOpen()


setInterval(function () {
    if(getWaitCuNum()>5) return;
    getCus(randomNumber(1,5))
    renderCusToDOM(Restaurant.getInstance().cusWaitList)
},3000)

