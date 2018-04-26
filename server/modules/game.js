module.exports = function(world, rate, clients) {
	
	//
    var commandList = [];
    var commandLimit = {};
    var commands = require('../../shared/command.js');
    var living = {};
	
	// cache references
	var game = this;
	commands.game = this;

    /**
     * Add a player command into an array.
	 * @param {string} cmd
     */
    this.push = function(cmd) {
        if (!commandLimit[cmd.player.id]) {
            commandList.push(cmd);
            commandLimit[cmd.player.id] = true;
        }
    }

    /**
     * Queue changes to send to players.
	 * @param {object} change
	 * @param {object} opts
     */
    this.pushUpdate = function(change, opts = {}) {
        clients.forEach(function(client) {
            if (opts.index && !client.active[opts.index])
                return;
            client.update.push(change);
        });
    }
	
	/**
	 * Send some data to a client.
	 * @param {WebSocket} conn
	 * @param {object} data
	 */
    this.sendToClient = function(conn, data) {
        try {
            conn.send(JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
    }
	
    /**
     * Update player position in the world.
	 * @param {object} player
     */
    this.updatePlayerPosition = function(player) {

        var oldIndex = player.index;
        var index = world.getChunk(player.position);
        var chunk = world.chunks[index];
        if (oldIndex != index) {
            if (oldIndex > -1) {
				var oldChunk = world.chunks[oldIndex];
                delete oldChunk.players[player.id];
				oldChunk.playerCount = Object.keys(oldChunk.players).length;
                //world.chunks[oldIndex].playerCount--;
            }
            player.index = index;
			chunk.playerCount = Object.keys(chunk.players).length;
            //chunk.playerCount++;
			
            //Set new active chunks
            for (x = -1; x < 2; x++) {
                for (y = -1; y < 2; y++) {
                    var activeIndex = (chunk.y + y) * world.width + (chunk.x + x);
                    if (world.chunks[activeIndex]) {
                        if (!player.active[activeIndex]) {
                            game.pushUpdate({
                                chunk: world.chunks[activeIndex]
                            });
                        }
                        player.active[activeIndex] = true;
                    }
                }
            }

            Object.keys(player.active).forEach(function(aIndex) {
                var pos = [~~(player.position.x / world.chunkWidth), ~~(player.position.y / world.chunkHeight)];
                var changePos = [world.chunks[aIndex].x, world.chunks[aIndex].y];
                if (Math.abs(pos[0] - changePos[0]) > 2 && Math.abs(pos[1] - changePos[1]) > 2) {
                    delete player.active[aIndex];
				}
            });

        }

        chunk.players[player.id] = {
            x: player.position.x - chunk.x * world.chunkWidth,
            y: player.position.y - chunk.y * world.chunkWidth
        };
        console.log(player.name + ' has moved to chunk ' + index + ' with position: ' + player.position.x + ',' + player.position.y);
    }

	/**
	 * Returns the ID of the chunk that the given player is currently in.
	 * @param {object} player
	 */
    var getPlayerChunkIndex = function(player) {
        var x = ~~(player.position.x / world.chunkWidth),
            y = ~~(player.position.y / world.chunkHeight),
            index = y * world.width + x;
        return index;
    }

	/**
	 * Sends current list of updates to all connected clients.
	 */
    var update = function() {
		
        // execute commands
        while (commandList.length > 0) {
            var command = commandList.shift();
            commands.execute('' + command.command, {
                player: command.player,
                clients: clients,
                world: world
            });
            commandLimit[command.player.id] = null;
        }
		
        //update all clients
        clients.forEach(function(client) {
            if (!client || client.update.length === 0)
                return;
            var data = {
                update: client.update
            };
            game.sendToClient(client.conn, data);
            client.update.length = 0;
        })
		
    }
	
	//
	setInterval(update, rate);
    console.log('game world simulation started at ' + rate + "ms");

}
