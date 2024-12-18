SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE DATABASE IF NOT EXISTS  Somsri_shirt  DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE  Somsri_shirt ;
-- --------------------------------
CREATE TABLE product (
        product_id INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
        product_name VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
        product_price INT NOT NULL,
        product_quantity INT NOT NULL,
        product_size VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
        product_status VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO product (product_id, product_name, product_price, product_quantity, product_size, product_status) 
VALUES 
(100, 'T-shirt', 450, 2, 'M', 'Activate'),
(101, 'Polo', 200, 10, 'S', 'Activate'),
(102, 'jacket', 550, 5, 'XL', 'Activate');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE USER 'Somsri_Admin'@'localhost' IDENTIFIED BY 'Somsri_Admin';
GRANT ALL PRIVILEGES ON Somsri_shirt.* TO 'Somsri_Admin'@'localhost';

