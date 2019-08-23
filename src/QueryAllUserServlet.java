import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

import db.UserDBConn;

@WebServlet(name = "QueryAllUserServlet")
public class QueryAllUserServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String param = request.getParameter("param");
        String tgt = request.getParameter("tgt");
        UserDBConn db = new UserDBConn();
        if(param != null && param.equals("del")){
            System.out.println("[Servlet] param = "+param+" tgt="+tgt);
            db.deleteUserByName(tgt);
        }
        String json = db.queryAllJSON();
        request.setAttribute("ulist", json);
        request.getRequestDispatcher("/showall.jsp").forward(request, response);

        /*
        out.println("<table>");
        out.println("<tr><th>User</th><th>PassWord</th></tr>");
        for (User user : ulist) {
            out.println(String.format("<tr><td>%s</td><td>%s</td></tr>",user.getName(),user.getPassword()));
        }
        out.println("</table>");
        out.println("<button onclick = \"window.location.href='login.jsp'\">返回</button>");
         */
    }
}