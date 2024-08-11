-- CreateTable
CREATE TABLE `bans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `issued` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `moderatorId` INTEGER NOT NULL,
    `message` VARCHAR(200) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buddies` (
    `userId` INTEGER NOT NULL,
    `buddyId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `buddyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `furnitures` (
    `userId` INTEGER NOT NULL,
    `furnitureId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`userId`, `furnitureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ignores` (
    `userId` INTEGER NOT NULL,
    `ignoreId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `ignoreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `itemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `typeId` INTEGER NOT NULL,
    `name` VARCHAR(12) NOT NULL,
    `adoptionDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `health` INTEGER NOT NULL DEFAULT 100,
    `hunger` INTEGER NOT NULL DEFAULT 100,
    `rest` INTEGER NOT NULL DEFAULT 100,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_rooms` (
    `userId` INTEGER NOT NULL,
    `roomId` INTEGER NOT NULL DEFAULT 1,
    `musicId` INTEGER NOT NULL DEFAULT 0,
    `floorId` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_room_furnitures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `furnitureId` INTEGER NOT NULL,
    `x` INTEGER NOT NULL DEFAULT 0,
    `y` INTEGER NOT NULL DEFAULT 0,
    `rotation` INTEGER NOT NULL DEFAULT 1,
    `frame` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(12) NOT NULL,
    `email` VARCHAR(254) NULL,
    `password` CHAR(60) NOT NULL,
    `loginKey` TEXT NULL,
    `rank` INTEGER NOT NULL DEFAULT 1,
    `joinTime` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `coins` INTEGER NOT NULL DEFAULT 500,
    `head` INTEGER NOT NULL DEFAULT 0,
    `face` INTEGER NOT NULL DEFAULT 0,
    `neck` INTEGER NOT NULL DEFAULT 0,
    `body` INTEGER NOT NULL DEFAULT 0,
    `hand` INTEGER NOT NULL DEFAULT 0,
    `feet` INTEGER NOT NULL DEFAULT 0,
    `color` INTEGER NOT NULL DEFAULT 1,
    `photo` INTEGER NOT NULL DEFAULT 0,
    `flag` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bans` ADD CONSTRAINT `fk_bans_users_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bans` ADD CONSTRAINT `fk_bans_users_2` FOREIGN KEY (`moderatorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buddies` ADD CONSTRAINT `fk_buddies_users_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buddies` ADD CONSTRAINT `fk_buddies_users_2` FOREIGN KEY (`buddyId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `furnitures` ADD CONSTRAINT `fk_furnitures_users` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ignores` ADD CONSTRAINT `fk_ignores_users_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ignores` ADD CONSTRAINT `fk_ignores_users_2` FOREIGN KEY (`ignoreId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `fk_inventories_users` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `fk_pets_users` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_rooms` ADD CONSTRAINT `fk_player_rooms_users` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_room_furnitures` ADD CONSTRAINT `fk_player_room_furnitures_users` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
