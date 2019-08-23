<%--
  Created by IntelliJ IDEA.
  User: 19197
  Date: 2019-08-10
  Time: 13:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>LoginPage</title>
</head>
<body>
<%
    if(session.getAttribute("user") != null) {
        out.print("欢迎用户"+session.getAttribute("user")+"登录");
    }
%>
<form action="quitlogin.jsp" method="POST">
    <input type="submit" value="退出登录"/>
</form>

<form action="query" method="GET">
    <input type="submit" value="查看所有用户">
</form>
<form method="post" action="login">
    <label>用户名<input type="text" maxlength="20" name="user"/></label><br/>
    <label>密码<input type="password" maxlength="20" name="pswd"/></label><br/>
    <label><input type="submit" value="登录"></label>
</form>
<form action="register.jsp">
    <label><input type="submit" value="注册"/></label>
</form>
</body>
</html>