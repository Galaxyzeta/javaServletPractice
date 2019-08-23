<%--
  Created by IntelliJ IDEA.
  User: 19197
  Date: 2019-08-11
  Time: 15:48
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String userName = null;
    if(session.getAttribute("user")!=null){
        userName = session.getAttribute("user").toString();
        session.invalidate();
    } else {
        response.sendRedirect("login.jsp");
    }
%>
<html>
<head>
    <title>退出登录界面</title>
</head>
<body>
<script>
    setInterval(goBack, 5000);
    function goBack() {
        window.location.href = "login.jsp";
    }
</script>
<h1>用户<%=userName%>退出登录，系统将在5秒后返回登录界面</h1>
    <form action = "login.jsp" method="get">
        <input type="submit" value="手动返回"/>
    </form>
</body>
</html>