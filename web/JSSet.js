"use strict";
let user = {
    str: "",
    chance: 3,
    ban: -1
};
let interval = null;

function banCountDown() {
    user.ban -= 1;
    document.getElementById("confirmcodeError").innerText = "已被禁止注册，还有"+user.ban+"秒";
    document.cookie = "ban="+user.ban;
    document.cookie = "chance="+user.chance;
    if (user.ban === 0) {
        user.chance = 3;
        user.ban = -1;
        document.getElementById("confirmcodeError").innerText = "可以继续注册";
        console.log("IntervalCleared");
        window.clearInterval(interval);
        xhrVisit("GET", "pen?chance="+user.chance+"&timer="+user.ban,true);
        return 0;
    }
}

function xhrVisit(method,url,async){
    let xhr = new XMLHttpRequest();
    xhr.open(method,url,async);
    xhr.send();
    return xhr;
}

function unloadHandler(){
    window.alert("即将退出");
    xhrVisit("GET", "pen?chance="+user.chance+"&timer="+user.ban);
    console.log("IntervalCleared");
    window.clearInterval(interval);
}

function syncWithCookie() {
    let cookie = document.cookie.split(";");
    console.log(cookie);
    user.chance = 3;
    user.ban = -1;
    cookie.forEach(function(value, index, array){
        let eqpos = value.indexOf("=");
        let prop = value.substring(0, eqpos).trim();
        let val = value.substring(eqpos+1).trim();
        switch(prop){
            case "chance":user.chance = Number.parseInt(val); break;
            case "ban":user.ban = Number.parseInt(val); break;
        }
        console.log("prop="+prop);
        console.log("val="+val);
        console.log("chance="+user.chance);
        console.log("ban="+user.ban);
    });
    if (user.ban !== -1){
        interval = window.setInterval(banCountDown, 1000);
    }
}

function syncWithServer(chance, pen) {
    console.log(chance,pen);
    if (pen !== -1){
        user.ban = pen;
        interval = window.setInterval(banCountDown, 1000);
    } else {
        user.chance = chance;
    }
}

function formValidate() {
    let pswd = document.getElementById("pswd").value.toString();
    let confirmPswd = document.getElementById("confirm_pswd").value.toString();
    let confirmCode = document.getElementById("confirm_code").value.toString();
    //confirm ban
    if (user.ban !== -1){
        return false;
    } else {
        document.getElementById("confirmcodeError").innerText = "";
    }
    //confirm code check
    if (user.str === "") {
        window.alert("你还没输入验证码！");
        return false;
    } else {
        if (user.str !== confirmCode) {
            user.chance -= 1;
            if (user.chance > 0) {
                document.getElementById("confirmcodeError").innerText = "验证码错误，还有"+user.chance+"次机会";
                document.cookie = "ban="+user.ban;
                document.cookie = "chance="+user.chance;
                console.log(document.cookie);
                console.log(user.chance);
                //xhrVisit("GET", "pen?chance="+user.chance,true);
                return false;
            } else {
                document.getElementById("confirmcodeError").innerText = "机会用完了，禁止注册5秒";
                document.cookie = "ban="+user.ban;
                document.cookie = "chance="+user.chance;
                console.log(document.cookie);
                //xhrVisit("GET", "pen?timer=5",true);
                user.ban = 5;
                console.log("IntervalStarted");
                interval = window.setInterval(banCountDown, 1000);
                generateConfirmCode();
                return false;
            }
        }
    }
    //password check
    if (confirmPswd !== pswd){
        window.alert("两次输入的密码不同!");
        return false;
        } else {
            if (pswd.length < 6) {
                window.alert("密码至少大于6位！");
                return false;
            } else {
                let numericFlag = false, characterFlag = false, capitalFlag = false;
                for (let x=0; x<pswd.length; x++) {
                    let char = pswd.charAt(x);
                    if(char >= '0' && char <= '9') {numericFlag = true; continue;}
                    if(char >= 'a' && char <= 'z') {characterFlag = true; continue;}
                    if(char >= 'A' && char <= 'Z') {capitalFlag = true;}
                }
                if (numericFlag !== true || characterFlag !== true || capitalFlag !== true) {
                    window.alert("密码必须由大小写和数字组合!");
                    return false;
                } else {
                    return true;
                }
            }
        }
    }

function generateConfirmCode() {
    user.str = "";
    let id = document.getElementById("myCanvas");
    let cont = id.getContext('2d');
    let c = 0;
    let colorSet = ['red','blue','black','cyan','green','purple','orange'];
    let charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let char;
    //init
    cont.fillStyle = 'white';
    cont.beginPath();
    cont.fillRect(0,0,id.width,id.height);
    cont.closePath();
    //draw text
    cont.font = "40px 'Consolas'";
    while(c < 4){
        user.str += (char = charSet.charAt(Math.ceil(Math.random()*charSet.length)-1));
        cont.fillStyle = colorSet[Math.ceil(Math.random()*colorSet.length)-1];
        cont.textAlign = "left";
        cont.fillText(char,40+c*40+(-20+Math.random()*20),40+(-20+Math.random()*20));
        c++;
    }
    //draw additional lines
    for(let x = 0; x < 10; x++){
        cont.beginPath();
        cont.strokeStyle = colorSet[Math.ceil(Math.random()*colorSet.length)-1];
        cont.moveTo(id.width*Math.random(),id.height*Math.random());
        cont.lineTo(id.width*Math.random(),id.height*Math.random());
        cont.stroke();
        cont.closePath();
    }
    return true;
}