<%--
  Created by IntelliJ IDEA.
  User: 19197
  Date: 2019-08-10
  Time: 13:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register</title>
    <script src="JSSet.js"></script>
</head>
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<body>
<%
    System.out.println("[FrontEnd] start");
    int chance;
    int timer;
    if(session.getAttribute("chance") == null) {
        chance = 3;
    } else {
        chance = (Integer)session.getAttribute("chance");
    }
    if(session.getAttribute("timer") == null) {
        timer = -1;
    } else {
        timer = (Integer)session.getAttribute("timer");
    }
    System.out.println("[FrontEnd] chance = "+chance);
%>
<script>window.onload=function(){console.log("onload");syncWithCookie();}</script>
<script></script>
<!-- on init -->
<form method="post" action="register" onsubmit="return formValidate()">
    <label>用户名<input type="text" maxlength="20" name="user"/></label><span id="userError"></span><br/>
    <label>密码<input id="pswd" type="password" maxlength="20" name="pswd"/></label><span id="pswdError"></span><br/>
    <label>确认密码<input id="confirm_pswd" type="password" maxlength="20" name="confirmPswd"/></label><span id="cpswdError"></span><br/>
    <label>验证码<input id = "confirm_code" type="text" maxlength="4" name="registerCode" value=""><span id="confirmcodeError"></span></label><br/>
    <canvas id="myCanvas" onclick="generateConfirmCode()" height="64" width="256"></canvas><br/>
    <p>注意，验证码区分大小写，点击验证码更换一个</p>
    <p>验证码连续错误3次将被禁止注册60秒</p>
    <div id="pen"></div>
    <label><input type="submit" value="注册"/></label><br/>
</form>
<script>window.onunload=unloadHandler</script>
<script>
    $(document).ready(function(){
        $("p").hide();
    });
</script>
</body>
</html>