var region = document.getElementById("region-chb")
var product = document.getElementById("product-chb")
var dashboard = document.getElementById("dashboard")
var title = document.getElementById("title")


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
        var temp = '<label for="' + key + '-全选"><input type="checkbox" checked id="' + key + '-全选" name="' + key + '" >全选</label>'
        for (var obj of data[key]) {
            temp += '<label for="' + obj + '"><input type="checkbox" checked id="' + obj + '" name="' + key + '" >' + obj + '</label>'
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
    var datas = dataGet()
    var showDatas = {}
    var chbsReg = document.getElementsByName("地区")
    var chbsPdt = document.getElementsByName("产品")

    datas["地区"] = chkGetCheckedIds("地区")
    datas["产品"] = chkGetCheckedIds("产品")

    for (obj of datas["地区"]) {
        showDatas[obj] = []
    }
    for (obj of sourceData) {
        if (datas["地区"].indexOf(obj.region) != -1 && datas["产品"].indexOf(obj.product) != -1) {
            var temp = {}
            temp[obj.product] = obj.sale
            showDatas[obj.region].push(temp)
        }
    }
    return showDatas
}

function tableRenderToHTML(showDatas) {
    var ts = ""
    for (obj in showDatas) { //地区		
        var reg = ""
        if (showDatas[obj].length > 1) {
            reg = '<td rowspan="' + showDatas[obj].length + '">' + obj + "</td>"
        } else {
            reg = '<td>' + obj + "</td>"
        }
        for (prods of showDatas[obj]) {            
            for (prod in prods) {
                var s = "<tr>" + reg
                reg = ""
                s += "<td>" + prod + "</td>"
                for (sale of prods[prod]) {
                    s += "<td>" + sale + "</td>"
                }
                ts += s + "</tr>"
            }

        }

    }
    dashboard.innerHTML = ts

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
    var datas = dataGet()
    var lis = genCkb(datas)
    chbRenderToHTML(lis)
    // tableRenderToHTML()
    //     var showDatas = fetchRenderData()
    //     tableRenderToHTML(showDatas)
}


window.onload = function () {    
    init()
    var data=fetchRenderData()
    tableRenderToHTML(data)
    drawBar(data)
    





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
            data=fetchRenderData()
            tableRenderToHTML(data)
            drawBar(data)
        }
    }

}

// region.onchange = function (event) {
//     var showDatas = fetchRenderData()
//     tableRenderToHTML(showDatas)

// }
// product.onchange = function (event) {
//     var showDatas = fetchRenderData()
//     tableRenderToHTML(showDatas)
// }