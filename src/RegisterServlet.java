import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import db.UserDBConn;
import user.*;


public class RegisterServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("doPost()");
        String username = request.getParameter("user");
        String pswd = request.getParameter("pswd");
        String confirmPswd = request.getParameter("confirmPswd");
        System.out.println("[Servlet] STAT="+username + "\t"+ confirmPswd);
        if (pswd.equals(confirmPswd)){
            System.out.println("CorrectPSWD");
            User user = new User(username, pswd);
            UserDBConn db = new UserDBConn();
            if (db.register(user)){
                response.sendRedirect("login.jsp");
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}