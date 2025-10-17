CREATE TABLE `auth_user` (
  `id` CHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(100),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `topic` (
  `id` TINYINT PRIMARY KEY,
  `code` VARCHAR(32) UNIQUE NOT NULL,
  `title` VARCHAR(64) NOT NULL
);

CREATE TABLE `question` (
  `id` CHAR(36) PRIMARY KEY,
  `topic_id` TINYINT NOT NULL,
  `content` TEXT NOT NULL,
  `created_by` CHAR(36),
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `grp` (
  `id` CHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `owner_id` CHAR(36) NOT NULL,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `grp_member` (
  `id` CHAR(36) PRIMARY KEY,
  `grp_id` CHAR(36) NOT NULL,
  `member_name` VARCHAR(100) NOT NULL,
  `user_id` CHAR(36),
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `game_session` (
  `id` CHAR(36) PRIMARY KEY,
  `grp_id` CHAR(36) NOT NULL,
  `topic_id` TINYINT NOT NULL,
  `created_by` CHAR(36),
  `status` ENUM ('active', 'ended') DEFAULT 'active',
  `started_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `ended_at` DATETIME
);

CREATE TABLE `game_session_player` (
  `id` CHAR(36) PRIMARY KEY,
  `session_id` CHAR(36) NOT NULL,
  `grp_member_id` CHAR(36) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `turns_taken` INT DEFAULT 0,
  `last_picked_at` DATETIME
);

CREATE TABLE `game_round` (
  `id` CHAR(36) PRIMARY KEY,
  `session_id` CHAR(36) NOT NULL,
  `round_no` INT NOT NULL,
  `assigned_player_id` CHAR(36) NOT NULL,
  `status` ENUM ('pending', 'completed') DEFAULT 'pending',
  `final_question_id` CHAR(36),
  `reroll_count` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `completed_at` DATETIME
);

CREATE TABLE `game_round_question` (
  `id` CHAR(36) PRIMARY KEY,
  `round_id` CHAR(36) NOT NULL,
  `question_id` CHAR(36) NOT NULL,
  `is_final` TINYINT(1) DEFAULT 0,
  `picked_at` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `question_used` (
  `session_id` CHAR(36) NOT NULL,
  `question_id` CHAR(36) NOT NULL,
  `used_at` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`session_id`, `question_id`)
);

CREATE INDEX `idx_question_topic` ON `question` (`topic_id`);

CREATE INDEX `idx_gm_grp` ON `grp_member` (`grp_id`);

CREATE INDEX `idx_gsp_session` ON `game_session_player` (`session_id`);

CREATE INDEX `idx_gsp_turns` ON `game_session_player` (`session_id`, `turns_taken`, `last_picked_at`);

CREATE UNIQUE INDEX `uq_round_in_session` ON `game_round` (`session_id`, `round_no`);

CREATE INDEX `idx_gr_session_status` ON `game_round` (`session_id`, `status`);

CREATE INDEX `idx_grq_round` ON `game_round_question` (`round_id`);

ALTER TABLE `question` ADD CONSTRAINT `fk_q_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`) ON UPDATE CASCADE;

ALTER TABLE `question` ADD CONSTRAINT `fk_q_user` FOREIGN KEY (`created_by`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL;

ALTER TABLE `grp` ADD CONSTRAINT `fk_grp_owner` FOREIGN KEY (`owner_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;

ALTER TABLE `grp_member` ADD CONSTRAINT `fk_gm_grp` FOREIGN KEY (`grp_id`) REFERENCES `grp` (`id`) ON DELETE CASCADE;

ALTER TABLE `grp_member` ADD CONSTRAINT `fk_gm_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL;

ALTER TABLE `game_session` ADD CONSTRAINT `fk_gs_grp` FOREIGN KEY (`grp_id`) REFERENCES `grp` (`id`) ON DELETE CASCADE;

ALTER TABLE `game_session` ADD CONSTRAINT `fk_gs_topic` FOREIGN KEY (`topic_id`) REFERENCES `topic` (`id`);

ALTER TABLE `game_session` ADD CONSTRAINT `fk_gs_user` FOREIGN KEY (`created_by`) REFERENCES `auth_user` (`id`) ON DELETE SET NULL;

ALTER TABLE `game_session_player` ADD CONSTRAINT `fk_gsp_session` FOREIGN KEY (`session_id`) REFERENCES `game_session` (`id`) ON DELETE CASCADE;

ALTER TABLE `game_session_player` ADD CONSTRAINT `fk_gsp_member` FOREIGN KEY (`grp_member_id`) REFERENCES `grp_member` (`id`) ON DELETE RESTRICT;

ALTER TABLE `game_round` ADD CONSTRAINT `fk_gr_session` FOREIGN KEY (`session_id`) REFERENCES `game_session` (`id`) ON DELETE CASCADE;

ALTER TABLE `game_round` ADD CONSTRAINT `fk_gr_gsp` FOREIGN KEY (`assigned_player_id`) REFERENCES `game_session_player` (`id`) ON DELETE RESTRICT;

ALTER TABLE `game_round` ADD CONSTRAINT `fk_gr_finalq` FOREIGN KEY (`final_question_id`) REFERENCES `question` (`id`) ON DELETE SET NULL;

ALTER TABLE `game_round_question` ADD CONSTRAINT `fk_grq_round` FOREIGN KEY (`round_id`) REFERENCES `game_round` (`id`) ON DELETE CASCADE;

ALTER TABLE `game_round_question` ADD CONSTRAINT `fk_grq_q` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE RESTRICT;

ALTER TABLE `question_used` ADD CONSTRAINT `fk_qu_session` FOREIGN KEY (`session_id`) REFERENCES `game_session` (`id`) ON DELETE CASCADE;

ALTER TABLE `question_used` ADD CONSTRAINT `fk_qu_q` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE CASCADE;
