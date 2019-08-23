import java.io.IOException;
import javax.servlet.*;
import javax.servlet.http.*;

import db.UserDBConn;
import user.*;

public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        String username = request.getParameter("user");
        String password = request.getParameter("pswd");
        UserDBConn db = new UserDBConn();
        if (db.loginQuery(new User(username, password))){
            System.out.println("LOGIN OK");
            if (request.getAttribute("user") == null){
                request.setAttribute("user", username);
            }
            //request.getRequestDispatcher("/loginSuccess.jsp").forward(request, response);
            //create session
            HttpSession session = request.getSession();
            if(session.getAttribute("user")==null){
                session.setAttribute("user", username);
                session.setMaxInactiveInterval(60);
            }
            //enter game
            request.getRequestDispatcher("/game.jsp").forward(request,response);
        }
        else {
            System.out.println("LOGIN FAILED!");
            response.sendRedirect("login.jsp");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request,response);
    }
}