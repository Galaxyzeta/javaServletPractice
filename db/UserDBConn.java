package db;

import java.sql.*;
import user.*;
import java.util.*;

public class UserDBConn extends CommonDBConn{

    private final String TABLE_NAME = "user";
    private final String COLUMN_USER_NAME = "username";
    private final String COLUMN_PASSWORD_NAME = "pswd";
    public boolean loginQuery(User user) {
        /*To check whether the user can login according to the database*/
        connect("user");
        PreparedStatement statement = null;
        String sql = "SELECT * FROM " + TABLE_NAME;
        ResultSet rs = null;
        System.out.println("[SQL] "+sql);
        try {
            statement = this.conn.prepareStatement(sql);
            rs = statement.executeQuery();
            while(rs.next()) {
                if(user.getPassword().equals(rs.getString(COLUMN_PASSWORD_NAME)) && user.getName().equals(rs.getString(COLUMN_USER_NAME))) {
                    System.out.println("[SQL] Access received.");
                    return true;
                }
            }
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            return false;
        } finally {
            disconnect();
        }
        return false;
    }

    public boolean register(User user) {
        /*Register*/
        connect("user");
        PreparedStatement statement = null;
        String sql1 = "SELECT * FROM " + TABLE_NAME;
        String sql2 = String.format("INSERT INTO %s (%s, %s) VALUES (?, ?)", TABLE_NAME, COLUMN_USER_NAME, COLUMN_PASSWORD_NAME);
        System.out.println("[SQL] "+sql2);
        ResultSet rs = null;
        try {
            //check whether the user exists
            statement = this.conn.prepareStatement(sql1);
            rs = statement.executeQuery();
            while(rs.next()) {
                if(rs.getString(COLUMN_USER_NAME).equals(user.getName())) {
                    System.out.println("[SQL ERROR] USER NAME EXISTS.");
                    return false;
                }
            }
            //Write into the database
            statement = this.conn.prepareStatement(sql2);
            statement.setString(1, user.getName());
            statement.setString(2, user.getPassword());
            statement.executeUpdate();
            System.out.println("[SQL] USER REGISTER SUCCESSFUL.");
            return true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            return false;
        } finally {
            disconnect();
        }
    }

    public ArrayList<User> queryAll(){
        connect("user");
        try {
            PreparedStatement statement = conn.prepareStatement("SELECT * FROM "+TABLE_NAME);
            ResultSet rs = statement.executeQuery();
            ArrayList<User> ulist = new ArrayList<>();
            while(rs.next()) {
                ulist.add(new User(rs.getString(COLUMN_USER_NAME),rs.getString(COLUMN_PASSWORD_NAME)));
            }
            System.out.println("[SQL] QueryAll OK");
            return ulist;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            return null;
        } finally {
            disconnect();
        }
    }

    public String queryAllJSON() {
        connect("user");
        StringBuilder sb = new StringBuilder();
        sb.append("{\"content\":[");
        try {
            PreparedStatement statement = conn.prepareStatement("SELECT * FROM "+TABLE_NAME);
            ResultSet rs = statement.executeQuery();
            while(rs.next()) {
                sb.append(String.format("{\"user\":\"%s\", \"pswd\":\"%s\"},",rs.getString(COLUMN_USER_NAME),rs.getString(COLUMN_PASSWORD_NAME)));
            }
            sb.append("]}");
            System.out.println(sb.toString());
            return sb.toString();
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            return null;
        } finally {
            disconnect();
        }
    }

    public void deleteUserByName(String userName){
        connect("user");
        try {
            PreparedStatement pst = this.conn.prepareStatement(String.format("DELETE FROM %s WHERE %s = ?",TABLE_NAME,COLUMN_USER_NAME));
            pst.setString(1, userName);
            pst.executeUpdate();
        } catch(SQLException e) {
            e.printStackTrace();
        } finally {
            disconnect();
        }
    }
    /*Debug*/
    public static void main(String[] args) {
        UserDBConn db = new UserDBConn();
        db.register(new User("qwe", "456789"));
    }
}