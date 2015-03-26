/**
 * The message target type.
 */
enum GameMessageTargetType {
    ID, TAG, ALL
}

/**
 * A game message is used for messaging between game objects managed by the same game manager.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 * @abstract
 */
class GameMessage {
    /**
     * Creates a new game message.
     *
     * @param target The target game object, this can be a tag as string, an id  as number or null for sending to all game objects.
     * @param type The type of message.
     * @param senderId The game object id of the sender.
     * @param targetType The target type.
     * @param payload An optional data payload.
     */
    constructor(
        public target: any,
        public type: string,
        public senderId: number,
        public targetType: GameMessageTargetType = GameMessageTargetType.ID,
        public payload?: any) {
    }
}


/**
 * A game message which gets send to the game object matching the given id.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class GameMessageToId extends GameMessage {
    /**
     * Creates a new game message.
     *
     * @param target The receiver's game object id.
     * @param type The message type.
     * @param senderId The game object id of the sender.
     * @param payload An optional data payload.
     */
    constructor(
        public target: number,
        public type: string,
        public senderId: number,
        public payload?: any) {
         super(target, type, senderId, GameMessageTargetType.ID, payload);
    }
}

/**
 * A game message which gets send to all game objects matching the tag.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class GameMessageToTag extends GameMessage {
    /**
     * Creates a new game message.
     *
     * @param target The target tag.
     * @param type The message type.
     * @param senderId The game object id of the sender.
     * @param payload An optional data payload.
     */
    constructor(
        public target: string,
        public type: string,
        public senderId: number,
        public payload?: any) {
         super(target, type, senderId, GameMessageTargetType.TAG, payload);
    }
}

/**
 * A game message which gets send to all game objects.
 *
 * @author Guido Krömer <mail 64 cacodaemon 46 de>
 */
class GameMessageToAll extends GameMessage {
    /**
     * Creates a new game message.
     *
     * @param type The message type.
     * @param senderId The game object id of the sender.
     * @param payload An optional data payload.
     */
    constructor(
        public type: string,
        public senderId: number,
        public payload?: any) {
         super(null, type, senderId, GameMessageTargetType.ALL, payload);
    }
}