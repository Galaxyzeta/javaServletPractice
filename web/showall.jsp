<%@ page import="user.User" %>
<%@ page import="java.util.*" %>
<%--
  Created by IntelliJ IDEA.
  User: 19197
  Date: 2019-08-11
  Time: 18:36
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>ShowAll</title>
</head>
<body>
<!--
<table>
    <tr>
        <th>用户名</th>
        <th>密码</th>
    </tr>
</table>
-->
<%
    /*
    List<User> ulist = (ArrayList<User>)request.getAttribute("ulist");
    for(User u : ulist) {
        out.print("<tr><td>"+u.getName()+"</td><td>"+u.getPassword()+"</td><td>");
        out.print("<button onclick=\"window.location.href='query?param=del&tgt="+u.getName()+"'\">Delete</button>");
        out.print("<button onclick=\"window.location.href='query?param=alt&tgt="+u.getName()+"'\">Alter</button>");
        out.print("</td></tr>\n");
    }*/
    String json = request.getAttribute("ulist").toString();
%>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script>
        let tableContent = "<table><tr><th>用户名</th><th>密码</th></tr>";
        let json = eval(<%=json%>);
        let arr = json.content;
        for(let x in arr){
            tableContent += "<tr><td>"+arr[x].user+"</td><td>"+arr[x].pswd+"</td>";
            tableContent += "<td><button onclick=\"window.location.href='query?param=del&tgt="+arr[x].user+"'\">Delete</button></td></tr>";
        }
        tableContent += "</table>";
        console.log(json);
        $(document).ready(function(){
            $("#table").html(tableContent);
        });
    </script>
    <div id="table">
    </div>
<button onclick="window.location.href='login.jsp'">返回</button>
</body>
</html>