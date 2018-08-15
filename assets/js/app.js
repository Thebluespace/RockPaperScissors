var config = {
    apiKey: "AIzaSyD59U8ofSdNsz39wG0VrCNM2VpyWuuBjCs",
    authDomain: "rock-paper-scissors-59857.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-59857.firebaseio.com",
    projectId: "rock-paper-scissors-59857",
    storageBucket: "rock-paper-scissors-59857.appspot.com",
    messagingSenderId: "886220142877"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
//   database.ref("dbo_rps_table").set({
//         "gamestate": "false",
//         "winner": "none",
//         "playerOne":"none",
//         "playerTwo":"none",
//   });

  var gameObj = {
      displayName: "",
      playerOne: "",
      playerTwo: "",
      player: 0,
      turn: 0,
      wins: 0,
      loses: 0,
      p1choice: "",
      p2choice: "",
      state: "false",
        load:function(){
            var login = $("<form>");
            login.addClass("loginform");
            var h1 = $("<h1>");
            h1.addClass("header");
            h1.text("Welcome to RPS online mini-game! Please fill these out to get started");
            var name = $("<input>");
            name.addClass("displayName");
            name.attr("type","text");
            var label1 = $("<label>");
            label1.addClass("label");
            label1.text("Please enter a DisplayName for the game:");
            var button = $("<button>");
            button.addClass("loginButton");
            button.text("LOGIN");
            button.on("click",gameObj.login);
            login.append(h1, $("<br>"),label1,$("<br>"),name,$("<br>"),button);
            $(".container").append(login);

        },
        makeMove: function(event){
            if (gameObj.turn === 1){
                var move = $(event.target).text();
                alert(move);
                gameObj.turn = 0;
                if (gameObj.player === 1){
                    database.ref("dbo_rps_table").update({"pOneMove":move});
                } else if (gameObj.player === 2){
                    database.ref("dbo_rps_table").update({"pTwoMove":move});
                }
            }
        },
        wait: function(response){
            if (response.child("playerTwo").val() != "none"){
                gameObj.loadGame();
            }
        },
        waitForMove: function(data){
            console.log(data.val())
            if (data.val() != "none"){
                if (gameObj.player === 2){
                    gameObj.turn === 1;
                    $(".playerTwoChoices").show();
                } else if (gameObj.player === 1) {
                    gameObj.compare(p1choice,data.val());
                }
            }
        },
        moveReset: function(data){
            try {
                
            } catch (error) {
                console.error(error);
            }
        },
        compare:function(p1, p2){
            var winner = 1;
            switch(p1){
                case "ROCK":
                    if (p2 === "PAPER"){
                        winner = 2;
                    }
                break;
                case "PAPER":
                    if (p2 === "SCISSORS"){
                        winner = 2;
                    }
                break;
                case "SCISSORS":
                    if (p2 === "ROCK"){
                        winner = 2;
                    }
                break;
            }
            if (winner === 1){
                var name = gameObj.playerOne;
                database.ref("dbo_rps_table/winner").update({name});
            } else {
                var name = gameObj.playerTwo;
                database.ref("dbo_rps_table/winner").update({name});
            }
        },
        loadGame: function(){
            try {
                database.ref("dbo_rps_table").once("value",function(data){
                    gameObj.playerOne = data.child("playerOne").val();
                    gameObj.playerTwo = data.child("playerTwo").val();
                });
                database.ref("dbo_rps_table").on("value",function(data){
                    if (data.child("admin") == "yes"){
                        var container = $("<div>");
                        container.addClass("container");
                        $(".bgi").empty();
                        $(".bgi").append(container);
                        gameObj.displayName = "";
                        gameObj.playerOne = "";
                        gameObj.playerTwo = "";
                        gameObj.player = 0;
                        gameObj.turn = 0;
                        gameObj.state = "false";
                        gameObj.load();
                        database.ref("dbo_rps_table").update({
                            "admin": "no"
                        });
                        return;
                    }
                });
                var gameContainer = $("<div>");
                gameContainer.addClass("gameContainer");
                var playerOne = $("<div>");
                playerOne.addClass("playerOne");
                var name1 = $("<h2>");
                name1.text(gameObj.playerOne);
                var form = $("<form>");
                form.addClass("playerOneChoices");
                var choice1 = $("<label>").addClass("choice").text("ROCK");
                var choice2 = $("<label>").addClass("choice").text("PAPER");
                var choice3 = $("<label>").addClass("choice").text("SCISSORS");
                form.append(choice1,$("<br>"),choice2,$("<br>"),choice3);
                var stats = $("<h2>");
                stats.addClass("p1stats");
                playerOne.append(name1,$("<br>"),form,$("<br>"),stats);
                var playerTwo = $("<div>");
                playerTwo.addClass("playerTwo");
                var name2 = $("<h2>");
                name2.text(gameObj.playerTwo);
                var form2 = $("<form>");
                form2.addClass("playerTwoChoices");
                var choice1 = $("<label>").addClass("choice").text("ROCK");
                var choice2 = $("<label>").addClass("choice").text("PAPER");
                var choice3 = $("<label>").addClass("choice").text("SCISSORS");
                form2.append(choice1,$("<br>"),choice2,$("<br>"),choice3);
                var stats = $("<h2>");
                stats.addClass("p2stats");
                playerTwo.append(name2,$("<br>"),form2,$("<br>"),stats);
                var winner = $("<div>");
                winner.addClass("winner");
                var h1 = $("<h1>");
                h1.addClass("winnerHeader");
                h1.text("WINNER:");
                winner.append(h1);
                gameContainer.append(playerOne,winner,playerTwo);

                $(".bgi").empty();
                $(".bgi").append(gameContainer);
                var funzone = $("<div>");
                funzone.addClass("funzone");
                var funbutton = $("<button>");
                funbutton.addClass("funbutton");
                funbutton.attr("type","button");
                funbutton.text("RESET");
                funbutton.on("click",gameObj.adminReset);
                funzone.append(funbutton);
                $(".bgi").append(funzone);

                if (gameObj.player > 0) {
                    $(".choice").on("click", gameObj.makeMove);
                    database.ref("dbo_rps_table/turn").on("value",gameObj.moveReset);
                }
                if (gameObj.player === 1) {
                    database.ref("dbo_rps_table/pTwoMove").on("value",gameObj.waitForMove);
                    gameObj.turn = 1;
                } else if(gameObj.player === 2){
                    database.ref("dbo_rps_table/pOneMove").on("value",gameObj.waitForMove);
                }
                database.ref("dbo_rps_table/winner").on("value",gameObj.declareWinner);
            } catch (error) {
                console.error(error);
            }
        },
        login: function(event){
            event.preventDefault();
            try {
                if($(".displayName").val().trim() == ""){
                    alert("DisplayName cannot be empty!");
                    return;
                }
                gameObj.displayName = $(".displayName").val();
                database.ref("dbo_rps_table").once("value",function(data){
                    if (data.child("playerOne").val() != "none" && data.child("playerTwo").val() != "none") {
                        return;
                    } else if (data.child("playerOne").val() == "none" ) {
                        database.ref("dbo_rps_table").update({
                            "playerOne": gameObj.displayName
                        })
                        gameObj.player = 1;
                        var h1 = $(".header");
                        h1.text("Waiting for another player to join...");
                        $(".loginform").empty();
                        $(".loginform").append(h1);
                        database.ref("dbo_rps_table").on("value",gameObj.wait);
                        return;
                    } else if (data.child("playerTwo").val() == "none" ){
                        database.ref("dbo_rps_table").update({
                            "playerTwo": gameObj.displayName
                        })
                        gameObj.player = 2;
                        gameObj.loadGame();
                        return;
                    }
                    else {
                        gameObj.player = 0;
                        gameObj.loadGame();
                    }
                });
            } catch (error) {
                console.error(error);   
            }
        },
        adminReset: function(event){
            database.ref("dbo_rps_table").update({
                "gamestate": "false",
                "winner": "none",
                "playerOne":"none",
                "playerTwo":"none",
            });
        },
        declareWinner: function(data){
            try {
                if(data.val() != "none"){
                    $(".playerOneChoices").hide();
                    $(".playerTwoChoices").hide();
                    var p1 = database.ref("dbo_rps_table").val();
                    var p2 = database.ref("dbo_rps_table").val();
                    var p1c = $("<img>");
                    p1c.attr("id","p1c");
                    p1c.attr("src","assets/media/" + p1 + ".png");

                    var p2c = $("<img>");
                    p2c.attr("id","p2c");
                    p2c.attr("src","assets/media/" + p2 + ".png");

                    var h1 = $("<h1>");
                    h1.attr("id","winnerHeader");
                    h1.text(data.val());
                    $(".winner").append(h1).show();
                    $(".playerOne").prepend(p1c);
                    $(".playerTwo").prepend(p2c);
                    setTimeout(function(){
                        $("#p1c").remove();
                        $("#p2c").remove();
                        $("#winnerHeader").remove();
                        $(".winner").hide();
                        database.ref("dbo_rps_table").update({"turn":"1"});
                    },2000);
                }
            } catch (error) {
                console.error(error);
            }
        },
  };