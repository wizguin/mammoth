-- AlterTable
ALTER TABLE `users` ADD COLUMN `safeMode` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `parent_passwords` (
    `userId` INTEGER NOT NULL,
    `password` CHAR(60) NOT NULL,
    `hint` VARCHAR(48) NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `parent_passwords` ADD CONSTRAINT `fk_parent_passwords_users` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
