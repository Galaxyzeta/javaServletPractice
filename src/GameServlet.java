import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Arrays;
import db.GameDBConn;

@WebServlet(name = "GameServlet")
public class GameServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String service = request.getParameter("service");
        if(service !=null){
            switch (service) {
                case "getRandomEnemy": {

                    String tier = request.getParameter("tier");
                    System.out.println("[GameServer] getRandomEnemy Tier=" + tier);
                    GameDBConn gdb = new GameDBConn();
                    response.setContentType("text/html;charset=utf-8");
                    String[] json = gdb.queryToJSONArray("SELECT * FROM game.enemy WHERE tier = ?", new Object[]{Integer.parseInt(tier)});
                    response.getWriter().println(json[(int) Math.ceil(Math.random() * json.length) - 1]);

                    break;
                }
                case "getItemBase": {

                    System.out.println("getItemBase");
                    String[] itemArray = request.getParameter("itemArray").split(",");
                    System.out.println(Arrays.toString(itemArray));
                    GameDBConn gdb = new GameDBConn();
                    String json = Arrays.toString(gdb.queryToJSONArray("SELECT * FROM game.itembase WHERE name in " +
                            gdb.generateParameterString(itemArray.length) + "ORDER BY name ASC", itemArray));
                    response.setContentType("text/html;charset=utf-8");
                    response.getWriter().println(json);
                    break;
                }
                case "getPlayerItem": {

                    String name = request.getParameter("playerName");
                    System.out.println(name);
                    System.out.println("getPlayerItem");
                    GameDBConn gdb = new GameDBConn();
                    System.out.println("1");
                    Object[] jsonArr = gdb.queryArray("SELECT playerjson FROM game.playeritem WHERE playerName = '"+name+"'",
                            "playerjson");

                    Object json = null;
                    if (jsonArr.length == 0){
                        System.out.println("NEW USER DETECTED");
                    } else {
                        json = jsonArr[0];
                        System.out.println("OLD USER DETECTED");
                    }
                    response.setContentType("text/html;charset=utf-8");
                    response.getWriter().println(json);
                    break;
                }
                case "getMetaData": {
                    response.setContentType("text/html;charset=utf-8");
                    File fp = new File("web/metaData.txt");
                    FileReader fr = new FileReader(fp);
                    StringBuilder sb = new StringBuilder();
                    int readContent;
                    while((readContent = fr.read())!=-1){
                        sb.append((char)readContent);
                    }
                    response.getWriter().write(sb.toString().replaceAll("\n",""));
                    break;
                }
                case "getShop": {
                    String tier =request.getParameter("tier");
                    GameDBConn gdb = new GameDBConn();
                    Object[] arr = gdb.queryArray("SELECT name FROM shop WHERE tier = "+tier, "name");
                    String json = Arrays.toString(gdb.queryToJSONArray("SELECT * FROM itembase WHERE name in "+
                            gdb.generateParameterString(arr.length)+"ORDER BY name ASC", arr));
                    response.setContentType("text/html;charset=utf-8");
                    response.getWriter().write(json);
                    break;
                }
                case "saveGame": {
                    GameDBConn gdb = new GameDBConn();
                    String json = request.getParameter("json");
                    String name = request.getParameter("name");
                    gdb.saveGame(json, name);
                    System.out.println("gameSaved");
                }
            }
        }
    }
}