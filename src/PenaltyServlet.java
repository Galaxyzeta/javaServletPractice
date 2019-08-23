import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;

@WebServlet(name = "PenaltyServlet")
public class PenaltyServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Integer chance = 3;
        Integer timer = -1;
        if(request.getParameter("chance")!=null){
            chance = Integer.parseInt(request.getParameter("chance"));
            System.out.println("[Servlet] received chance");
        }
        if(request.getParameter("timer")!=null){
            timer = Integer.parseInt(request.getParameter("timer"));
            System.out.println("[Servlet] received timer");
        }
        HttpSession session = request.getSession();
        session.setAttribute("chance", chance);
        session.setAttribute("timer", timer);
        System.out.println(chance);
        System.out.println(timer);
        System.out.println("[Servlet] Entered, timer="+timer+" ,chance="+chance);
        request.getRequestDispatcher("/register.jsp").forward(request,response);

        /*
        response.setContentType("text/html;charset=UTF-8");
        if(request.getParameter("time")!=null){
            request.getSession().setAttribute("penalty", request.getParameter("time"));
            System.out.println("1");
        }
        if(request.getSession().getAttribute("penalty")!=null){
            System.out.println("2");
            if (this.timer == null) {
                this.timer = new Timer(request.getSession(),60);
                this.timer.start();
            } else if (this.timer.getTimer() == -1) {
                this.timer = null;
            }
        }
        response.sendRedirect("register.jsp");
        */
    }
}
