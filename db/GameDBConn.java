package db;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GameDBConn extends CommonDBConn {

    /**
    This method query database and turn several rows into a json string.
    Enter a querySql with ? , and use object array to fill up these ? .
    RECOMMEND: use this method with generateParameterString.
    Common types will be properly handled.
    **/
    public String[] queryToJSONArray(String querySql ,Object[] objects){
        connect("game");
        try{
            PreparedStatement pst = conn.prepareStatement(querySql);
            for (int x = 1; x <= objects.length; x++) {
                if (objects[x - 1] instanceof Integer) {
                    pst.setInt(x, (Integer) objects[x - 1]);
                } else if (objects[x - 1] instanceof String) {
                    pst.setString(x, (String) objects[x - 1]);
                }
            }
            //get query size
            ResultSet rs = pst.executeQuery();
            rs.last();
            int size = rs.getRow();
            //get column counts
            ResultSetMetaData rsmd = rs.getMetaData();
            int count = rsmd.getColumnCount();
            //generate json
            String[] strArr = new String[size];
            rs.beforeFirst();
            while(rs.next()){
                StringBuilder sb = new StringBuilder("{");
                for(int x=1; x <= count; x++) {
                    String columnName = rsmd.getColumnName(x);
                    String columnType = rsmd.getColumnTypeName(x);

                    //Handle different types so that data can be correctly joined in javaScripts.
                    if (columnType.equals("VARCHAR")){
                        //handle data as a String
                        sb.append('"').append(columnName).append("\":\"").append(rs.getString(columnName)).append("\",");
                    } else {
                        //handle data as a number
                        sb.append('"').append(columnName).append("\":").append(rs.getString(columnName)).append(",");
                    }

                }
                sb.deleteCharAt(sb.lastIndexOf(","));
                sb.append('}');
                strArr[rs.getRow()-1] = sb.toString();
            }
            return strArr;
        } catch (SQLException se) {
            se.printStackTrace();
        } finally {
            disconnect();
        }
        return null;
    }

    /**
    This method can generate parameter string depending on how many parameters are received.
    Example: generateParameterString(5) ==> (?,?,?,?,?)
    **/
    public String generateParameterString(int parameterCounts){
        StringBuilder sb = new StringBuilder("(");
        while(parameterCounts-->0){
            sb.append("?,");
        }
        return sb.deleteCharAt(sb.lastIndexOf(",")).append(")").toString();
    }

    /**
     * This method simply return a column result as a string array.
     * **/
    public Object[] queryArray(String querySql, String columnName){
        connect("game");
        List<String> list = new ArrayList<>();
        try{
            PreparedStatement pst = conn.prepareStatement(querySql);
            //get query size
            ResultSet rs = pst.executeQuery();
            while(rs.next()){
                list.add(rs.getString(columnName));
            }
            return list.toArray();
        } catch (SQLException se) {
            se.printStackTrace();
        } finally {
            disconnect();
        }
        return null;
    }

    public void saveGame(String json, String playerName){
        connect("game");
        try {
            PreparedStatement pst1 = conn.prepareStatement("SELECT playername FROM game.playeritem WHERE playername = ?");
            pst1.setString(1, playerName);
            ResultSet rs = null;
            rs = pst1.executeQuery();
            int flag = 0;
            while(rs.next()){
                flag = 1;
            }
            if(flag == 0){
                System.out.println("NEW PLAYER IN SQL");
                pst1 = conn.prepareStatement("INSERT INTO game.playeritem (playername, playerjson) VALUE (?, ?)");
                pst1.setString(1, playerName);
                pst1.setString(2, json);
                pst1.executeUpdate();
                return;
            }
            PreparedStatement pst = conn.prepareStatement("UPDATE game.playeritem SET playerjson = ? WHERE playername = ?");
            pst.setString(1, json);
            pst.setString(2, playerName);
            pst.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        disconnect();
    }
    /**Debug Tester**/
    public static void main(String[] args) {
        GameDBConn conn = new GameDBConn();
        System.out.println(conn.generateParameterString(5));
        System.out.println(conn.queryArray("SELECT itemjson FROM game.playeritem WHERE playerName = '老年程序员'", "itemjson")[0]);
    }
}