<%--
  Created by IntelliJ IDEA.
  User: 19197
  Date: 2019-08-15
  Time: 0:05
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% String user = request.getParameter("user"); %>
<html>
<head>
    <title>EXP++</title>
    <script src="jquery.js"></script>
    <script src="Game.js"></script>
    <link rel="stylesheet" href="StyleSheet.css" type="text/css"/>
</head>
<body onbeforeunload="confirm();" onunload=saveGame()>
<div class="loadingMask"><h1>LOADING...</h1></div>
<!-- Player and Enemy Panel -->
<div style="overflow: auto; margin: auto; width: 80%">
    <div id="player" class="statbox" style="float: left">
        <div class="statColumn">
            <table>
                <tr>
                    <th>Name</th>
                    <td id="name">测试</td>
                </tr>
                <tr>
                    <th>Lv</th>
                    <td id="lv">1</td>
                </tr>
                <tr>
                    <th>Hp</th>
                    <td id="hp">200</td>
                    <td><div class="lifebarBack"><div class="lifebarDecrease" id="playerLife"></div></div></td>
                </tr>
                <tr>
                    <th>Atk</th>
                    <td id="atk"></td>
                </tr>
                <tr>
                    <th>Def</th>
                    <td id="def"></td>
                </tr>
                <tr>
                    <th>Spd</th>
                    <td id="spd"></td>
                </tr>
                <tr>
                    <th>Step</th>
                    <td id="step">0</td>
                    <td><div class="lifebarBack"><div class="lifebarAdd" id="playerStep"></div></div></td>
                </tr>
                <tr>
                    <th>Next</th>
                    <td id="next">0</td>
                    <td><div class="lifebarBack"><div class="lifebarAdd" id="playerNext"></div></div></td>
                </tr>
                <tr>
                    <th>Money</th>
                    <td id="money">0</td>
                </tr>
            </table>
        </div>
        <div class="operationPanel">
            <ul>
                <li><button onclick="manualRecover()" id="manualRecover">回复</button></li>
                <li><button onclick="pauseGame()" id="pauseGame">暂停</button></li>
                <li><button onclick="getPlayerItemTable()" id="getPlayerItemTable">物品</button></li>
                <li><button onclick="getShopTable()" id="getShopTable">商店</button></li>
                <li><button onclick="consoleClear()" id="consoleClear">清除控制台</button></li>
            </ul>
        </div>
    </div>
    <div id="enemy" class="statbox" style="float: right" hidden="hidden">
        <table>
            <tr>
                <th>Name</th>
                <td id="e_name"></td>
            </tr>
            <tr>
                <th>Lv</th>
                <td id="e_lv"></td>
            </tr>
            <tr>
                <th>Hp</th>
                <td id="e_hp"></td>
                <td><div class="lifebarBack"><div class="lifebarDecrease" id="enemyLife"></div></div></td>
            </tr>
            <tr>
                <th>Atk</th>
                <td id="e_atk"></td>
            </tr>
            <tr>
                <th>Def</th>
                <td id="e_def"></td>
            </tr>
            <tr>
                <th>Spd</th>
                <td id="e_spd"></td>
            </tr>
        </table>
    </div>
</div>
<!-- Display Items and Shop -->
<div id = "playerItem" class="itemchart"></div>
<div class="itemchart" id="shop"></div>

<!-- Display Game Messages -->

<div class="console">
    <label for="msgbox"></label><textarea style="width: 100%;height: 80%" id="msgbox" readonly="readonly">fuck</textarea>
</div>
<button onclick="saveGame();this.disabled='disabled';">保存游戏</button>

<!-- Game Initialize-->
<script>
    init("<%=user%>");
    window.onload = function(){setTimeout(function(){$(".loadingMask").hide()},500)};
</script>

</body>
</html>
