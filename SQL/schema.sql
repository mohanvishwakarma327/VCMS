CREATE DATABASE vcms;

USE vcms;

-- Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_group VARCHAR(50) NOT NULL,
    store VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_email VARCHAR(100) NOT NULL UNIQUE,
    client_phone VARCHAR(20) NOT NULL,
    client_address VARCHAR(255) NOT NULL,
    client_city VARCHAR(100) NOT NULL,
    client_state VARCHAR(100) NOT NULL,
    client_zip VARCHAR(20) NOT NULL,
    client_country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL,
    chairperson VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    vcPurpose TEXT NOT NULL,
    department VARCHAR(255) NOT NULL,
    remark TEXT,
    vcDuration INT NOT NULL,
    vcType ENUM('audio', 'video', 'hybrid') NOT NULL,
    vcStartDate DATETIME NOT NULL,
    vcEndDate DATETIME NOT NULL,
    recording ENUM('yes', 'no') NOT NULL,
    billingSection ENUM('prepaid', 'postpaid') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the VC Bookings Table
CREATE TABLE vc_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(100),  -- Adjusted for consistency
    chairperson VARCHAR(100),
    contactNumber VARCHAR(20),
    email VARCHAR(100),
    vcPurpose VARCHAR(255),
    department VARCHAR(100),
    vcDuration DECIMAL(4, 2),
    vcType ENUM('audio', 'video', 'hybrid'),
    vcStartDate DATETIME,
    vcEndDate DATETIME,
    recording ENUM('yes', 'no'),
    billingSection ENUM('prepaid', 'postpaid'),
    status ENUM('Pending', 'Approved', 
    'Rejected') DEFAULT 'Pending',
    joinLink TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users for signup (Use hashed passwords in practice)
INSERT INTO users (username, email, password)
VALUES
('John Doe', 'john.doe@example.com', 'hashedpassword1'),
('Jane Smith', 'jane.smith@example.com', 'hashedpassword2'),
('Michael Johnson', 'michael.johnson@example.com', 'hashedpassword3');
