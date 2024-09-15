-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2024 at 09:31 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sms`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculatePerDaySalary` (`month` INT)   BEGIN
    DECLARE salary DECIMAL(10,2);
    DECLARE allowance DECIMAL(10,2);
    DECLARE total_days INT;
    DECLARE per_day_salary DECIMAL(10,2);

    SELECT SUM(salary), SUM(allowance), DAY(LAST_DAY(CONCAT('2022-', month, '-01')))
    INTO salary, allowance, total_days
    FROM salary_tbl
    WHERE month_field = month;

    IF total_days = 0 THEN
        SET per_day_salary = 0;
    ELSE
        SET per_day_salary = (salary + allowance) / total_days;
    END IF;

    SELECT per_day_salary;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetDaysInMonth` (IN `monthValue` INT, OUT `daysMonth` INT)   BEGIN
    CASE monthValue
        WHEN 1 THEN SET daysMonth = 31;
        WHEN 2 THEN SET daysMonth = 28; -- Adjust for leap year if necessary
        WHEN 3 THEN SET daysMonth = 31;
        WHEN 4 THEN SET daysMonth = 30;
        WHEN 5 THEN SET daysMonth = 31;
        WHEN 6 THEN SET daysMonth = 30;
        WHEN 7 THEN SET daysMonth = 31;
        WHEN 8 THEN SET daysMonth = 31;
        WHEN 9 THEN SET daysMonth = 30;
        WHEN 10 THEN SET daysMonth = 31;
        WHEN 11 THEN SET daysMonth = 30;
        WHEN 12 THEN SET daysMonth = 31;
        ELSE SET daysMonth = 0;
    END CASE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `att_id` int(11) NOT NULL,
  `att_adm_no` varchar(5) NOT NULL,
  `curr_date` datetime NOT NULL,
  `attendance` varchar(2) NOT NULL,
  `month` varchar(2) GENERATED ALWAYS AS (month(`curr_date`)) STORED,
  `year` varchar(4) GENERATED ALWAYS AS (year(`curr_date`)) STORED,
  `attstandard` varchar(10) NOT NULL,
  `time_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`att_id`, `att_adm_no`, `curr_date`, `attendance`, `attstandard`, `time_date`) VALUES
(91, '1010', '2024-09-07 00:00:00', 'A', 'PG', '0000-00-00'),
(92, '2', '2024-09-07 00:00:00', 'L', '3rd', '0000-00-00'),
(93, '1010', '2024-09-08 00:00:00', 'P', 'PG', '0000-00-00'),
(94, '2', '2024-09-08 00:00:00', 'L', '3rd', '0000-00-00'),
(95, '1010', '2024-09-11 00:00:00', 'P', 'PG', '0000-00-00'),
(96, '2', '2024-09-11 00:00:00', 'P', '3rd', '0000-00-00'),
(97, '1010', '2024-09-12 00:00:00', 'P', 'PG', '0000-00-00'),
(98, '2', '2024-09-12 00:00:00', 'P', '3rd', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `basicinfo`
--

CREATE TABLE `basicinfo` (
  `id` int(11) NOT NULL,
  `adm_no` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `monthly_fee` varchar(100) NOT NULL,
  `image` varchar(200) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` date NOT NULL,
  `updated_at` varchar(50) NOT NULL,
  `standard` varchar(100) NOT NULL,
  `father` varchar(100) NOT NULL,
  `adm_date` date NOT NULL,
  `adm_standard` varchar(20) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `address` varchar(200) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `basicinfo`
--

INSERT INTO `basicinfo` (`id`, `adm_no`, `name`, `monthly_fee`, `image`, `status`, `created_at`, `updated_at`, `standard`, `father`, `adm_date`, `adm_standard`, `mobile`, `address`, `email`) VALUES
(143, '1010', 'Talha', '2400', 'uploads\\IMG_20160330_114320000.jpg', 'Active', '0000-00-00', '', 'PG', 'Aamer', '2018-11-17', 'One', '03118883854', 'Gulber Green', 'techinfolab360@gmail.com'),
(139, '2', 'New', '2400', 'uploads\\IMG_3348.JPG', 'Active', '0000-00-00', '', '3rd', 'Aamer', '2024-08-21', 'One', '03118883854', 'Gulber Green', 'techinfolab360@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `sid` int(10) NOT NULL,
  `standard` varchar(20) NOT NULL,
  `created_at` varchar(10) NOT NULL,
  `updated_at` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`sid`, `standard`, `created_at`, `updated_at`) VALUES
(1, 'Nursery', '0000-00-00', '2024-04-12'),
(2, 'PG', '0000-00-00', '0000-00-00'),
(3, 'One', '0000-00-00', '0000-00-00'),
(4, '2nd', '2024-03-30', '0000-00-00'),
(6, '3rd', '2024-04-12', '0000-00-00'),
(7, '4th', '2024-04-12', '0000-00-00'),
(8, '5th', '2024-04-12', '0000-00-00'),
(10, '6th', '2024-04-12', '0000-00-00'),
(11, '7th', '2024-04-12', '2024-04-12'),
(13, '8th', '2024-04-12', '0000-00-00'),
(14, '9th', '2024-04-12', '0000-00-00'),
(17, '10th', '2024-04-12', '0000-00-00'),
(18, '1st Year', '2024-04-12', '0000-00-00'),
(21, '2nd Year', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `contact_tbl`
--

CREATE TABLE `contact_tbl` (
  `contact_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mobile` varchar(40) NOT NULL,
  `message` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_tbl`
--

INSERT INTO `contact_tbl` (`contact_id`, `name`, `email`, `mobile`, `message`) VALUES
(5, 'bbakht', 'itsmeaamer85@gmail.com', '03001234567', 'data base is fef');

-- --------------------------------------------------------

--
-- Table structure for table `expense_tbl`
--

CREATE TABLE `expense_tbl` (
  `expense_id` int(10) NOT NULL,
  `description` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `amount` varchar(10) NOT NULL,
  `created_at` date NOT NULL,
  `year` varchar(4) GENERATED ALWAYS AS (year(`date`)) STORED,
  `month` varchar(2) GENERATED ALWAYS AS (month(`date`)) STORED,
  `updated_at` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense_tbl`
--

INSERT INTO `expense_tbl` (`expense_id`, `description`, `date`, `amount`, `created_at`, `updated_at`) VALUES
(1, 'Telephone', '2024-05-02', '7000', '2024-04-19', '2024-05-05 14:27:26'),
(37, 'Telephone', '2024-04-19', '7000', '0000-00-00', '2024-04-20 20:21:32'),
(39, 'Telephone', '2024-05-02', '7000', '0000-00-00', '2024-05-03 19:56:15'),
(45, 'Telephone', '2024-05-02', '7000', '0000-00-00', '2024-05-04 20:20:22');

-- --------------------------------------------------------

--
-- Table structure for table `fee_tbl`
--

CREATE TABLE `fee_tbl` (
  `idf` int(11) NOT NULL,
  `fee_adm_no` varchar(100) NOT NULL,
  `fyear` varchar(20) GENERATED ALWAYS AS (year(`created_at`)) STORED,
  `monthly_fee` varchar(20) NOT NULL,
  `exam_fee` varchar(20) NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL,
  `total_fee` varchar(30) GENERATED ALWAYS AS (`monthly_fee` + `exam_fee` + `adm_fee` + `arrears` + `lab_fee` + `misc_fee` + `fine_fee`) STORED,
  `collection` varchar(20) NOT NULL DEFAULT '0',
  `payment_at` datetime(6) NOT NULL,
  `fmonth` varchar(20) GENERATED ALWAYS AS (month(`created_at`)) STORED,
  `balance` varchar(100) GENERATED ALWAYS AS (`total_fee` - `collection`) STORED,
  `FeeStandard` varchar(20) NOT NULL,
  `adm_fee` varchar(20) NOT NULL DEFAULT '0',
  `arrears` varchar(20) NOT NULL DEFAULT '0',
  `lab_fee` varchar(20) NOT NULL DEFAULT '0',
  `misc_fee` varchar(20) NOT NULL DEFAULT '0',
  `fine_fee` varchar(20) NOT NULL DEFAULT '0',
  `collection_by` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_tbl`
--

INSERT INTO `fee_tbl` (`idf`, `fee_adm_no`, `monthly_fee`, `exam_fee`, `created_at`, `collection`, `payment_at`, `FeeStandard`, `adm_fee`, `arrears`, `lab_fee`, `misc_fee`, `fine_fee`, `collection_by`) VALUES
(59, '1010', '2400', '0', '2023-07-20 20:35:33.804000', '1000', '2024-08-31 16:39:59.638000', 'PG', '0', '0', '0', '0', '33', 'Talha'),
(60, '2', '2400', '0', '2024-08-31 20:35:33.804000', '0', '0000-00-00 00:00:00.000000', '3rd', '0', '0', '0', '0', '0', ''),
(65, '1010', '2400', '0', '2024-09-12 20:21:17.057000', '3833', '2024-09-12 15:22:26.442000', 'PG', '0', '1433', '0', '0', '0', 'Talha'),
(66, '2', '2400', '0', '2024-09-12 20:21:17.058000', '4800', '2024-09-12 15:25:59.505000', '3rd', '0', '2400', '0', '0', '0', 'Talha');

-- --------------------------------------------------------

--
-- Table structure for table `result_tbl`
--

CREATE TABLE `result_tbl` (
  `result_adm_no` varchar(20) NOT NULL,
  `year` varchar(10) NOT NULL,
  `month` varchar(20) NOT NULL,
  `result_standard` varchar(20) NOT NULL,
  `created_at` varchar(20) NOT NULL,
  `resultid` int(11) NOT NULL,
  `TMS1` varchar(11) NOT NULL DEFAULT '0',
  `TMS2` varchar(11) NOT NULL DEFAULT '0',
  `TMS3` varchar(11) NOT NULL DEFAULT '0',
  `TMS4` varchar(11) NOT NULL DEFAULT '0',
  `TMS5` varchar(11) NOT NULL DEFAULT '0',
  `TMS6` varchar(11) NOT NULL DEFAULT '0',
  `TMS7` varchar(11) NOT NULL DEFAULT '0',
  `TMS8` varchar(11) NOT NULL DEFAULT '0',
  `Total_set_marks` varchar(11) GENERATED ALWAYS AS (`TMS1` + `TMS2` + `TMS3` + `TMS4` + `TMS5` + `TMS6` + `TMS7` + `TMS8`) STORED,
  `OM1` varchar(11) NOT NULL DEFAULT '0',
  `OM2` varchar(11) NOT NULL DEFAULT '0',
  `OM3` varchar(11) NOT NULL DEFAULT '0',
  `OM4` varchar(11) NOT NULL DEFAULT '0',
  `OM5` varchar(11) NOT NULL DEFAULT '0',
  `OM6` varchar(11) NOT NULL DEFAULT '0',
  `OM7` varchar(11) NOT NULL DEFAULT '0',
  `OM8` varchar(11) NOT NULL DEFAULT '0',
  `Total_obt_marks` varchar(10) GENERATED ALWAYS AS (`OM1` + `OM2` + `OM3` + `OM4` + `OM5` + `OM6` + `OM7` + `OM8`) STORED,
  `publication` enum('Pend','Publish','','') NOT NULL,
  `position` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `result_tbl`
--

INSERT INTO `result_tbl` (`result_adm_no`, `year`, `month`, `result_standard`, `created_at`, `resultid`, `TMS1`, `TMS2`, `TMS3`, `TMS4`, `TMS5`, `TMS6`, `TMS7`, `TMS8`, `OM1`, `OM2`, `OM3`, `OM4`, `OM5`, `OM6`, `OM7`, `OM8`, `publication`, `position`) VALUES
('1', '2024', '1st Annual', 'Nursery', '2024-05-05 06:25:54', 12, '75', '75', '75', '75', '75', '75', '75', '75', '75', '65', '89', '90', '35', '51', '87', '6', 'Pend', ''),
('2', '2024', '1st Annual', '2nd', '2024-05-05 06:25:54', 13, '100', '100', '100', '100', '100', '100', '100', '100', '95', '85', '75', '65', '55', '45', '35', '40', 'Pend', ''),
('54', '2024', '1st Annual', 'Nursery', '2024-05-05 06:25:54', 14, '75', '75', '75', '75', '75', '75', '75', '75', '0', '0', '0', '0', '0', '0', '0', '0', 'Pend', ''),
('78', '2024', '1st Annual', 'Nursery', '2024-05-05 06:25:54', 15, '75', '75', '75', '75', '75', '75', '75', '75', '0', '0', '0', '0', '0', '0', '0', '0', 'Pend', ''),
('1010', '2024', 'React', 'PG', '2024-09-08 15:09:18.', 17, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'Pend', '2'),
('2', '2024', 'React', '3rd', '2024-09-08 15:09:18.', 18, '50', '50', '50', '50', '50', '50', '50', '50', '49', '45', '40', '35', '30', '25', '20', '10', 'Pend', '1');

-- --------------------------------------------------------

--
-- Table structure for table `salary_tbl`
--

CREATE TABLE `salary_tbl` (
  `salaryid` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `salary` varchar(20) NOT NULL DEFAULT '0',
  `allowance` varchar(20) NOT NULL DEFAULT '0',
  `created_at` varchar(20) NOT NULL,
  `year` varchar(20) GENERATED ALWAYS AS (year(`created_at`)) STORED,
  `month` varchar(20) GENERATED ALWAYS AS (month(`created_at`)) STORED,
  `leave_availed` varchar(20) NOT NULL DEFAULT '0',
  `cnic` varchar(14) NOT NULL,
  `standard` varchar(20) NOT NULL,
  `updated_at` varchar(20) NOT NULL,
  `total_salary` varchar(20) GENERATED ALWAYS AS (`salary` + `allowance`) STORED,
  `one_day_salary` varchar(20) GENERATED ALWAYS AS (`total_salary` / `days_month`) STORED,
  `deduction` decimal(20,0) GENERATED ALWAYS AS (`leave_availed` * `one_day_salary`) STORED,
  `security` varchar(10) DEFAULT '0',
  `net_salary` varchar(10) GENERATED ALWAYS AS (`total_salary` - `security` - `deduction`) STORED,
  `days_month` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salary_tbl`
--

INSERT INTO `salary_tbl` (`salaryid`, `staff_id`, `salary`, `allowance`, `created_at`, `leave_availed`, `cnic`, `standard`, `updated_at`, `security`, `days_month`) VALUES
(48, 1, '2147483647', '4000', '2024-09-06 17:50:28.', '4', '', '', '', '1000', '30'),
(49, 3, '23232', '1000', '2024-09-06 17:50:28.', '0', '', '', '', '0', '30'),
(50, 4, '6546546', '1000', '2023-08-06 17:50:28.', '0', '', '', '', '0', '30'),
(51, 4, '6546546', '1000', '2024-09-11 20:32:06.', '0', '', '', '', '0', '30');

-- --------------------------------------------------------

--
-- Table structure for table `staff_tbl`
--

CREATE TABLE `staff_tbl` (
  `staffid` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `father_name` varchar(20) NOT NULL,
  `cnic` int(13) NOT NULL,
  `salary` varchar(20) NOT NULL,
  `allowance` varchar(20) NOT NULL,
  `image` varchar(100) NOT NULL,
  `created_at` varchar(20) NOT NULL,
  `doj` varchar(20) NOT NULL,
  `appointment` enum('Principal','Co-ordinator','Teacher','Clerk','Security Guard') NOT NULL,
  `standard` varchar(20) NOT NULL,
  `status` enum('Active','Inactive','','') NOT NULL,
  `updated_at` varchar(20) NOT NULL,
  `mobile` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_tbl`
--

INSERT INTO `staff_tbl` (`staffid`, `name`, `father_name`, `cnic`, `salary`, `allowance`, `image`, `created_at`, `doj`, `appointment`, `standard`, `status`, `updated_at`, `mobile`) VALUES
(1, 'Hassan', 'Raza', 2147483647, '2147483647', '4000', 'uploads\\staff\\IMG_20160330_114320000.jpg', '2024-03-27 17:42:55', '', 'Principal', '2nd', 'Active', '2024-04-27 11:08:44', '10000'),
(3, 'Aame Raza', 'Muhammad Raza', 2147483647, '23232', '1000', 'uploads\\staff\\IMG_20160330_114153.jpg', '', '', 'Principal', '', 'Active', '', '03235052189'),
(4, 'Talha', 'asfd', 2147483647, '6546546', '1000', 'uploads\\staff\\IMG_20160330_114356.jpg', '', '', 'Principal', '', 'Active', '', '03118883854');

-- --------------------------------------------------------

--
-- Table structure for table `syllabus`
--

CREATE TABLE `syllabus` (
  `syllabus_id` int(11) NOT NULL,
  `subject` varchar(20) NOT NULL,
  `task_standard` varchar(20) NOT NULL,
  `created_at` date NOT NULL,
  `task` varchar(500) NOT NULL,
  `updated_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syllabus`
--

INSERT INTO `syllabus` (`syllabus_id`, `subject`, `task_standard`, `created_at`, `task`, `updated_at`) VALUES
(10, 'Math', '2nd', '2024-04-14', 'Chapter 2', '0000-00-00'),
(11, 'Eng', '2nd', '2024-04-15', 'Chapter 1', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `user_detail`
--

CREATE TABLE `user_detail` (
  `id` int(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `usertype` varchar(11) NOT NULL,
  `created_at` varchar(20) NOT NULL,
  `updated_at` varchar(20) NOT NULL,
  `remarks` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_detail`
--

INSERT INTO `user_detail` (`id`, `username`, `password`, `usertype`, `created_at`, `updated_at`, `remarks`) VALUES
(42, 'Talha', '$2b$10$iK4YTh54WqrzZOXcLsQQquOkcNLD6K3/2o4ImKReGyqevpKRIefZa', 'Admin', '', '', ''),
(49, 'New User', '$2b$10$dwQpNvlmPDYOW4wIIfnQMOiBfk4EoDA49NXnjqZTuEznCzUKmGo4.', 'Admin', '', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`att_id`);

--
-- Indexes for table `basicinfo`
--
ALTER TABLE `basicinfo`
  ADD PRIMARY KEY (`adm_no`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `adm_no` (`adm_no`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`sid`),
  ADD UNIQUE KEY `standard` (`standard`) USING BTREE;

--
-- Indexes for table `contact_tbl`
--
ALTER TABLE `contact_tbl`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `expense_tbl`
--
ALTER TABLE `expense_tbl`
  ADD PRIMARY KEY (`expense_id`);

--
-- Indexes for table `fee_tbl`
--
ALTER TABLE `fee_tbl`
  ADD PRIMARY KEY (`idf`),
  ADD KEY `adm_no` (`fee_adm_no`);

--
-- Indexes for table `result_tbl`
--
ALTER TABLE `result_tbl`
  ADD PRIMARY KEY (`resultid`),
  ADD KEY `result_adm_no` (`result_adm_no`);

--
-- Indexes for table `salary_tbl`
--
ALTER TABLE `salary_tbl`
  ADD PRIMARY KEY (`salaryid`),
  ADD KEY `staffid` (`staff_id`);

--
-- Indexes for table `staff_tbl`
--
ALTER TABLE `staff_tbl`
  ADD PRIMARY KEY (`staffid`) USING BTREE;

--
-- Indexes for table `syllabus`
--
ALTER TABLE `syllabus`
  ADD PRIMARY KEY (`syllabus_id`);

--
-- Indexes for table `user_detail`
--
ALTER TABLE `user_detail`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `att_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `basicinfo`
--
ALTER TABLE `basicinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `sid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `contact_tbl`
--
ALTER TABLE `contact_tbl`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expense_tbl`
--
ALTER TABLE `expense_tbl`
  MODIFY `expense_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `fee_tbl`
--
ALTER TABLE `fee_tbl`
  MODIFY `idf` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `result_tbl`
--
ALTER TABLE `result_tbl`
  MODIFY `resultid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `salary_tbl`
--
ALTER TABLE `salary_tbl`
  MODIFY `salaryid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `staff_tbl`
--
ALTER TABLE `staff_tbl`
  MODIFY `staffid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `syllabus`
--
ALTER TABLE `syllabus`
  MODIFY `syllabus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_detail`
--
ALTER TABLE `user_detail`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fee_tbl`
--
ALTER TABLE `fee_tbl`
  ADD CONSTRAINT `fee_tbl_ibfk_1` FOREIGN KEY (`fee_adm_no`) REFERENCES `basicinfo` (`adm_no`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
