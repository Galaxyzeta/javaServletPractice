"use strict";

/**
 * Game.js
 * Contain all javaScripts that do game logic.
 * Annotations virtually used in the comments:
 * @Unstable : the function has to be changed if we add any additional stats in the game.
 * @FrequentlyUsed : the function is always used at the end of other functions (logic ensure)
 * @Important : formulas or data is stored in the following function
 * @WIP : needs to update
 * **/

let controller = {
    interval : null,
    isEnemy : false,
    enemyRate : 5,
    battlePhase : 'none',
    msgNumber : 0,
    tier : 1,
    itemTableOffset : 0,
    itemTableLimit : 10
};
let player = {
    name : "老年程序员",
    money: 100,
    lv : 1,
    hp : 150,
    maxhp : 150,
    atk : 35,
    def : 35,
    spd : 20,
    next : 40,
    step : 0,
    nextStep : 500,
    items : [],
    equipments : {
        wpn : null,
        body : null,
        foot : null,
    },
    additionalStats : {
        atk : 0,
        def : 0,
        spd : 0
    }
};
let enemy = null;
let shop = null;

/*
* SYSTEM
* */

//this will be called in game.jsp
//use this to set interval and read data from server
function init(playerName) {
    //controller
    controller.interval = setInterval(stepIncrement, 500);
    $("#enemyLife").animate({width: "0%"});
    //interface
    interfaceUpdate();
    //item data read and update
    getPlayerItemTable(playerName);
    getShopTable();
}

function saveGame() {
    console.log(JSON.stringify(player));
    let xhr = new XMLHttpRequest();
    xhr.open("POST","game?service=saveGame&name="+player.name);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    xhr.send("json="+JSON.stringify(player));
}

function xhrVisit(method, url, async) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, async);
    xhr.send();
    return xhr;
}

function pauseGame() {
    console.log("pause");
    window.clearInterval(controller.interval);
    document.getElementById("pauseGame").onclick=unpauseGame;
}

function unpauseGame() {
    console.log("unpause");
    if(controller.isEnemy === true) {
        controller.interval = window.setInterval(function() {battleEnemy(enemy);}, 1000);
    } else {
        controller.interval = window.setInterval(stepIncrement, 500);
    }
    document.getElementById("pauseGame").onclick=pauseGame;
}

function stepIncrement(){
    if (controller.isEnemy === false){
        //increase step
        player.step += 1;
        if (player.step === player.nextStep){
            player.step = 0;
            player.nextStep += 500;
            controller.tier += 1;
        }
        //update interface
        interfaceUpdate(null);
        //encounter enemy?
        let rand = Math.random()*100;
        if(rand < controller.enemyRate) {
            controller.isEnemy = true;
            randomEnemy();
        }
    }
}

function randomEnemy(){
    let xhr = xhrVisit("GET","game?service=getRandomEnemy&tier=1",true);
    enemy = null;
    xhr.onreadystatechange = function () {
        if(xhr.status===200 && xhr.readyState===4){
            enemy = JSON.parse(xhr.responseText);
            enemy.lv = enemy.tier * 5 - Math.floor(Math.random()*5);
            enemy.maxhp = enemy.hp;
            console.log(enemy);
            $("#enemy").show();
            interfaceUpdate(enemy);
            //interval management
            window.clearInterval(controller.interval);
            controller.interval = window.setInterval(function(){battleEnemy(enemy);}, 1000)
        }
    }
}

//@FrequentlyUsed   @Unstable
function interfaceUpdate(enemy=null) {
    let ratio;
    //--Player--
    $("#hp").text(player.hp+"/"+player.maxhp);
    $("#name").text(player.name);
    $("#lv").text(player.lv);
    $("#atk").text(player.atk+"("+player.additionalStats.atk+")");
    $("#def").text(player.def+"("+player.additionalStats.def+")");
    $("#spd").text(player.spd+"("+player.additionalStats.spd+")");
    $("#step").text(player.step+"/"+player.nextStep);
    $("#next").text(player.next);
    $("#money").text(player.money);
    //animation
    ratio = 100*player.hp/player.maxhp;
    $("#playerLife").animate({width: ""+ratio+"%"});
    ratio = 100 * (player.step / player.nextStep);
    $("#playerStep").animate({width: ""+ratio+"%"});
    if(enemy !== null){
        //--Enemy--
        $("#e_hp").text(enemy.hp+"/"+enemy.maxhp);
        $("#e_lv").text(enemy.tier);
        $("#e_name").text(enemy.name);
        $("#e_atk").text(enemy.atk);
        $("#e_def").text(enemy.def);
        $("#e_spd").text(enemy.spd);
        //animation
        ratio = 100*enemy.hp/enemy.maxhp;
        $("#enemyLife").animate({width: ""+ratio+"%"});
    }
}

//@FrequentlyUsed
function consoleUpdate(content) {
    let obj = document.getElementById("msgbox");
    obj.innerHTML += content;
    obj.innerHTML += '\n';
}

function consoleClear(){
    document.getElementById("msgbox").innerHTML = "";
}

/*
* BATTLE:
* */

function battleEnemy(enemy){
    if(controller.battlePhase === 'none'){
        if(enemy.spd > player.spd) {
            controller.battlephase = 'enemy';
        } else {
            controller.battlephase = 'player';
        }
    }
    if (controller.battlePhase === 'player') {
        playerAttack(enemy);
    } else {
        enemyAttack(enemy);
    }
    interfaceUpdate(enemy);
}

function playerAttack(enemy) {
    //dmg calc
    let dmg = Math.floor((player.atk+player.additionalStats.atk) * (1-enemy.def/1000) *(0.99+Math.random()*0.02));
    dmg = dmg > 0? dmg: 1;
    enemy.hp -= dmg;
    //updateInformation
    interfaceUpdate(enemy);
    consoleUpdate("["+player.name+"]攻击，对["+enemy.name+"]造成"+dmg+"点伤害");
    controller.battlePhase = 'enemy';
    isEnemyDefeated(enemy);
}

function enemyAttack(enemy){
    //dmg calc
    let dmg = Math.floor(enemy.atk * (1-player.def/1000) *(0.99+Math.random()*0.02));
    dmg = dmg > 0? dmg: 1;
    player.hp -= dmg;
    //updateInformation
    interfaceUpdate(enemy);
    consoleUpdate("["+enemy.name+"]攻击，对["+player.name+"]造成"+dmg+"点伤害");
    //stateChange
    controller.battlePhase = 'player';
    isPlayerDefeated();
}

function isEnemyDefeated(enemy) {
    if(enemy.hp <= 0) {
        //hide enemy panel
        $("#enemy").hide();
        //prevent bug animation
        $("#enemyLife").animate({width: "0%"});
        //exp gain, level up, get money
        player.next -= enemy.exp;
        isLevelUp();
        player.money += Math.floor(enemy.tier * 50 * (0.8+Math.random()*0.4));
        //state change
        controller.isEnemy = false;
        controller.battlePhase = 'none';
        consoleUpdate("敌人["+enemy.name+"]被打败了，获得"+enemy.exp+"点经验值");
        //interval management
        clearInterval(controller.interval);
        controller.interval = setInterval(stepIncrement, 500);
    }
}

//@Important
function isLevelUp() {
    $("#next").text(player.next);
    //animation
    let ratio;
    ratio = 100 * (1-player.next / (player.lv * player.lv * 40));
    ratio = ratio > 100 ? 100 : ratio;
    $("#playerNext").animate({width: ""+ratio+"%"});
    while(player.next < 0) {
        player.lv += 1;
        player.next = player.next + player.lv * player.lv * 40;
        player.maxhp += (player.lv/100)*500;
        player.atk += Math.ceil(player.lv/5)+5;
        player.def += Math.ceil(player.lv/5)+5;
        ratio = 100 * (1-player.next / (player.lv * player.lv * 40));
        $("#playerNext").animate({width: ""+ratio+"%"});
        consoleUpdate("玩家升到了"+player.lv+"级!")
    }
}

function isPlayerDefeated() {
    if(player.hp <= 0) {
        battleFinish(true);
        consoleUpdate("你被打败了，被传送到"+Math.floor(player.step/2)+"步之前的地方！");
    }
}

function hpRecovery(recover) {
    player.hp += recover;
    statOverflowHandle();
}

//This method deals with Hp overflow detection and handle.
function statOverflowHandle() {
    if(player.hp > player.maxhp) {
        player.hp = player.maxhp;
    }
}

function manualRecover() {
    $("#manualRecover").attr("disabled", true);
    hpRecovery(Math.floor(player.maxhp/20));
    setTimeout(function(){$("#manualRecover").attr("disabled", false)},1000)
}

function battleFinish(isRevive=false) {
    console.log("battleFinish");
    if(isRevive === true) {
        player.step = Math.floor(player.step/2);
        player.hp = player.maxhp;
    }
    controller.battlephase = 'none';
    controller.isEnemy = false;
    $("#enemy").hide();
    window.clearInterval(controller.interval);
    controller.interval = setInterval(stepIncrement, 500);
    interfaceUpdate(null);
}

/*
* ITEM FUNCTIONS:
* */

//This method will be called in init();
function getPlayerItemTable(playerName=player.name) {
    let xhr = xhrVisit("POST","game?service=getPlayerItem&playerName="+playerName, true);
    console.log(player.items);
    xhr.onreadystatechange = function () {
        if(xhr.status === 200 && xhr.readyState === 4) {
            console.log("READ");
            let json = JSON.parse(xhr.responseText);
            if (json === null){console.log("New Player Detected");player.name=playerName;}
            else {
                player = json;
                if(json.items === null){player.items = [];}
            }
            console.log(player.items);
            itemSort();
            /*
            let str = "";
            for(let x=0; x < player.items.length; x++) {
                str += (player.items[x].name + ",");
            }
            str.substring(0,str.length-1);
            getDetailedItem(str);*/

            rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
        }
    }
}

//This method should not be used. Because it is automatically called in the previous method.
function getDetailedItem(itemNameArr) {
    let xhr = xhrVisit("POST", "game?service=getItemBase&itemArray="+itemNameArr, true);
    xhr.onreadystatechange = function () {
        if(xhr.status === 200 && xhr.readyState === 4) {
            let srcArr = eval(xhr.responseText);
            let ptr = 0;
            for(let x=0; x < player.items.length; x++) {
                if (player.items[x].name === srcArr[ptr].name){
                    player.items[x] = Object.assign(player.items[x], srcArr[ptr]);
                } else {
                    ptr ++; x --;
                }
            }
            console.log(player.items);
            rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
        }
    };
}

//Use this method to build items table. Update after ANY item modification.
//It is also contained in the previous method.
//@FrequentlyUsed
function rebuildItemTable(itemsArr=[], offset=0, limit=10) {
    console.log("rebuildItemTable");
    if(itemsArr === []){
        return;
    }
    let table = "<table><tr><th>物品</th><th>数量</th><th>描述</th><th>状态</th><th>操作</th></tr>";
    //forEach
    for(let x=offset; x< itemsArr.length && x < limit; x++)
    {
        let value = itemsArr[x];
        let index = x;
        table += "<tr><td>"+value.name+"</td><td>"+value.num+"</td><td>"+value.description+"</td>";
        //different items has different usage.
        switch(value.itemtype){
            case "c": table += "<td><button onclick='useItem("+index+")'>使用</button></td>";break;
            case "eq": {
                if(value.eq === false) {
                    table += "<td><button onclick='equipItem("+index+")'>装备</button></td>";break;
                } else {
                    table += "<td><button onclick='cancelEquipItem("+index+")'>取消装备</button></td>";break;
                }
            }
        }
        table += "<td><button onclick='tossItem("+index+", true)'>扔(ZZ选项)</button></td>";
        table += "<td><button onclick='sellItem("+index+", true)'>卖掉</button></td>";
        table += "</tr>"
    }
    //add page button
    table += "<tr><td><button id='pgUp' onclick='pageUp()'><--</button></td>";
    table += "<td><button id='pgDown' onclick='pageDown()'>--></button></td></tr></table>";
    $("#playerItem").html(table);
}
//@Unstable:
function pageUp(){
    let offset = controller.itemTableOffset;
    let limit = controller.itemTableLimit;
    controller.itemTableOffset = offset > limit ? offset -= limit: 0;
    rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
}
function pageDown(){
    let offset = controller.itemTableOffset;
    let limit = controller.itemTableLimit;
    controller.itemTableOffset = offset+limit < player.items.length? offset += limit: offset;
    rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
}

//@FrequentlyUsed
function itemSort(){
    if (player.items === []){console.log("det");return;}
    player.items.sort(function (obj1, obj2) {
        return obj1.name > obj2.name;
    });
}

//@Unstable:
function useItem(itemIndex) {
    //inner logic
    let itemJson = player.items[itemIndex];
    player.hp += itemJson.hp;
    player.maxhp += itemJson.maxhp;
    player.atk += itemJson.atk;
    player.def += itemJson.def;
    player.spd += itemJson.spd;
    statOverflowHandle();
    consoleUpdate("使用了["+itemJson.name+"]");
    tossItem(itemIndex, 1);
    //interface
    interfaceUpdate(enemy);
    rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
}

//Throw away certain amount of items.
function tossItem(itemIndex, isPrompt = true, count = 1) {
    let itemJson = player.items[itemIndex];
    let prop = count;
    //if the number is entered in a pop up window...
    if (isPrompt === true) {prop = window.prompt("您扔几个？", "0")}
    prop = Number.parseInt(prop);
    //prevent NaN exception
    if (isNaN(prop)) {return;}
    //prop clamp
    prop = prop > itemJson.num? itemJson.num: prop;
    itemJson.num -= prop;
    //cancel equip if the item is already equipped
    if(itemJson.itemtype === "eq" && itemJson.eq === true) {
        cancelEquipItem(itemIndex);
    }
    if (itemJson.num <= 0) {
        player.items.splice(itemIndex, 1);
    }
    rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
}

//This method is used to equip an equipment
function equipItem(itemIndex) {
    player.items[itemIndex]["eq"] = true;
    player.equipments[player.items[itemIndex].part] = player.items[itemIndex];
    calculateEquipmentStat();
    rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
}

//This method is used to cancel equip an equipment
function cancelEquipItem(itemIndex) {
    player.items[itemIndex]["eq"] = false;
    player.equipments[player.items[itemIndex].part] = null;
    calculateEquipmentStat();
    rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
}

//Calc how many additional stats are held by your equipments
//@Unstable
function calculateEquipmentStat() {
    //init
    for(let prop in player.additionalStats){player.additionalStats[prop] = 0};
    //calculation
    for(let prop in player.equipments){
        let d = player.equipments[prop];
        if(d !== null){
            player.additionalStats.atk += d.atk;
            player.additionalStats.def += d.def;
            player.additionalStats.spd += d.spd;
        }
    }
}

/*
* SHOP and CURRENCY
* */
//@FrequentlyUsed
function getShopTable() {
    let xhr = xhrVisit("POST", "game?service=getShop&tier=1",true);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            shop = eval(xhr.responseText);
            console.log(shop);
            let html = "<table><tr><th>商品</th><th>价格</th><th>买入</th></tr>";
            for(let x=0; x<shop.length; x++){
                html += "<tr><td>"+shop[x].name+"</td><td>"+shop[x].price+"</td><td><button onclick='buyItem(shop,"+x+")'>买入</button></td></tr>"
            }
            html += "</table>";
            $("#shop").html(html);
        }
    };
}

function buyItem(shop=[], index) {
    let flag = 0;
    if(player.money > shop[index].price){
        for(let x=0; x< player.items.length; x++){
            if (player.items[x].name === shop[index].name){
                player.items[x].num ++;
                player.money -= shop[index].price;
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            shop[index].num = 1;
            player.items.push(shop[index]);
            itemSort();
            player.money -= shop[index].price;
        }
        rebuildItemTable(player.items, controller.itemTableOffset, controller.itemTableLimit);
    } else {
        consoleUpdate("你钱不够!");
    }

}

function sellItem(itemIndex, isPrompt = true, count=1) {
    let itemJson = player.items[itemIndex];
    let prop = count;
    //if the number is entered in a pop up window...
    if (isPrompt === true) {prop = window.prompt("您卖几个？", "0")}
    prop = Number.parseInt(prop);
    //prevent NaN exception
    if (isNaN(prop)) {return;}
    //prop clamp
    prop = prop > itemJson.num? itemJson.num: prop;
    let json = player.items[itemIndex];
    console.log(prop);
    console.log(json);
    player.money += Math.floor(prop * json.price / 2);
    tossItem(itemIndex,false, prop);
}