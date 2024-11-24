document.addEventListener("DOMContentLoaded", () => {
    const createSessionButton = document.getElementById("create-session");
    const joinSessionButton = document.getElementById("join-session");
    const startGameButton = document.getElementById("start-game");
    const transferMoneyButton = document.getElementById("transfer-money");
    const sessionIdInput = document.getElementById("session-id");
    const playerColorInput = document.getElementById("player-color");
    const moneyDisplay = document.getElementById("money-display");

    let playerColor = '';
    let playerMoney = 1500;
    let sessionId = '';
    let peerConnections = [];
    let dataChannels = [];

    // 1. إنشاء الجلسة
    createSessionButton.addEventListener("click", () => {
        sessionId = Math.random().toString(36).substring(2, 10);
        localStorage.setItem("sessionId", sessionId);
        alert("تم إنشاء الجلسة، المعرف هو: " + sessionId);
        sessionIdInput.value = sessionId;
    });

    // 2. الانضمام إلى الجلسة
    joinSessionButton.addEventListener("click", () => {
        const sessionToJoin = sessionIdInput.value;
        if (!sessionToJoin) {
            alert("يرجى إدخال معرف الجلسة");
            return;
        }
        localStorage.setItem("sessionId", sessionToJoin);
        alert("تم الانضمام إلى الجلسة " + sessionToJoin);
        sessionId = sessionToJoin;
    });

    // 3. تحديد اللون وبدء اللعبة
    startGameButton.addEventListener("click", () => {
        playerColor = playerColorInput.value;
        if (!playerColor) {
            alert("يرجى إدخال اللون");
            return;
        }

        localStorage.setItem("playerColor", playerColor);
        localStorage.setItem("playerMoney", playerMoney);

        moneyDisplay.textContent = playerMoney;
        alert(`بدأت اللعبة باللون: ${playerColor}`);

        // إذا كان لديك WebRTC، يمكنك الآن إنشاء Peer Connection
        setupGame();
    });

    // 4. إعداد WebRTC للاتصال بين اللاعبين
    function setupGame() {
        const peerConnection = new RTCPeerConnection();
        const dataChannel = peerConnection.createDataChannel("gameData");

        // إرسال بيانات اللعبة
        dataChannel.onopen = () => {
            console.log("قناة البيانات مفتوحة");
            dataChannel.send("اللاعب بدأ اللعبة");
        };

        dataChannel.onmessage = (event) => {
            console.log("رسالة من اللاعب الآخر:", event.data);
        };

        peerConnection.createOffer().then(offer => {
            peerConnection.setLocalDescription(offer);
            // هنا يمكنك إرسال العرض إلى اللاعب الآخر عبر WebRTC signaling
        });

        peerConnections.push(peerConnection);
        dataChannels.push(dataChannel);
    }

    // 5. تحويل المال بين اللاعبين
    transferMoneyButton.addEventListener("click", () => {
        const transferAmount = prompt("كم ترغب في تحويله؟");
        if (transferAmount && !isNaN(transferAmount)) {
            playerMoney -= parseInt(transferAmount);
            localStorage.setItem("playerMoney", playerMoney);
            moneyDisplay.textContent = playerMoney;
            alert(`تم تحويل ${transferAmount} دولار.`);
        } else {
            alert("يرجى إدخال مبلغ صالح.");
        }
    });

});
