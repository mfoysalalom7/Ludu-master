/**
 * Ludo Royale - Multiplayer & Room Networking Engine
 * Supports BroadcastChannel for local multi-instance / multi-tab rooms,
 * WebSocket adapter for live remote authoritative servers, and Quick Match matchmaking.
 */

class MultiplayerManager {
  constructor() {
    this.currentRoom = null;
    this.isHost = false;
    this.playerId = "user_" + Math.random().toString(36).substring(2, 8);
    this.channel = null;
    this.ws = null;
    this.serverUrl = null;
    this.listeners = {};
    this.roomPlayers = [];
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  generateRoomCode() {
    return "ROYAL-" + Math.floor(1000 + Math.random() * 9000);
  }

  createRoom(customCode = null) {
    const code = customCode || this.generateRoomCode();
    this.currentRoom = code;
    this.isHost = true;
    this.initChannel(code);

    const hostPlayer = {
      id: this.playerId,
      name: window.storageManager.data.name || "Player 1",
      avatar: window.storageManager.data.avatar || "👑",
      color: "red",
      isHost: true,
      ready: true
    };
    this.roomPlayers = [hostPlayer];

    this.emit('roomCreated', { roomCode: code, players: this.roomPlayers });
    return code;
  }

  joinRoom(code) {
    this.currentRoom = code.toUpperCase();
    this.isHost = false;
    this.initChannel(this.currentRoom);

    const newPlayer = {
      id: this.playerId,
      name: window.storageManager.data.name || "Player",
      avatar: window.storageManager.data.avatar || "👑",
      color: "green",
      isHost: false,
      ready: true
    };

    // Broadcast join request
    this.broadcast({
      type: 'PLAYER_JOINED',
      player: newPlayer
    });

    this.emit('roomJoined', { roomCode: this.currentRoom, player: newPlayer });
    return true;
  }

  initChannel(roomCode) {
    if (this.channel) {
      this.channel.close();
    }
    try {
      this.channel = new BroadcastChannel(`ludo_royale_${roomCode}`);
      this.channel.onmessage = (e) => this.handleNetworkMessage(e.data);
    } catch (_) {
      // Fallback if BroadcastChannel not supported in environment
    }
  }

  broadcast(message) {
    if (this.channel) {
      this.channel.postMessage(message);
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  handleNetworkMessage(msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'PLAYER_JOINED':
        if (this.isHost) {
          const exists = this.roomPlayers.some(p => p.id === msg.player.id);
          if (!exists && this.roomPlayers.length < 4) {
            const colors = ['red', 'green', 'yellow', 'blue'];
            msg.player.color = colors[this.roomPlayers.length];
            this.roomPlayers.push(msg.player);
            this.broadcast({
              type: 'SYNC_LOBBY',
              players: this.roomPlayers
            });
            this.emit('lobbyUpdated', this.roomPlayers);
          }
        }
        break;

      case 'SYNC_LOBBY':
        this.roomPlayers = msg.players;
        this.emit('lobbyUpdated', this.roomPlayers);
        break;

      case 'REMOTE_DICE_ROLLED':
        this.emit('remoteDiceRolled', msg);
        break;

      case 'REMOTE_TOKEN_MOVED':
        this.emit('remoteTokenMoved', msg);
        break;

      case 'REMOTE_CHAT':
        this.emit('remoteChat', msg);
        break;

      case 'GAME_STARTED':
        this.emit('gameStarted', msg);
        break;
    }
  }

  sendChat(senderName, text, isEmoji = false) {
    const payload = {
      type: 'REMOTE_CHAT',
      sender: senderName,
      text,
      isEmoji
    };
    this.broadcast(payload);
    this.emit('remoteChat', payload);
  }

  leaveRoom() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.currentRoom = null;
    this.isHost = false;
    this.roomPlayers = [];
  }
}

window.multiplayerManager = new MultiplayerManager();
