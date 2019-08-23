package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class CommonDBConn {
    Connection conn = null;
    private static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String URL = "jdbc:mysql://localhost/";
    private static final String ADDITIONAL_URL = "?useUnicode=true&characterEncoding=UTF-8&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PSWD = "721209";

    public boolean connect(String dbname) {
        /*Call this method first to connect to the database*/
        try {
            Class.forName(JDBC_DRIVER);
            this.conn = DriverManager.getConnection(URL+dbname+ADDITIONAL_URL, USER, PSWD);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean disconnect() {
        /*Use this method to end the connection*/
        if (conn == null) {
            System.out.println("[SQL ERROR] Attempt to disconnect a null database.");
            return false;
        }
        try {
            conn.close();
            return true;
        } catch (SQLException sqle) {
            sqle.printStackTrace();
            return false;
        }
    }
}
