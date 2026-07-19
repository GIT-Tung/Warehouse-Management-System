USE master;
GO

IF DB_ID('StorageManager') IS NOT NULL
BEGIN
    ALTER DATABASE StorageManager SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE StorageManager;
END
GO


CREATE DATABASE StorageManager;
GO

USE StorageManager;
GO
CREATE TABLE Roles(
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(30) NOT NULL UNIQUE
);
GO
CREATE TABLE Users(
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    FullName NVARCHAR(100),
    Email VARCHAR(100),
    Phone VARCHAR(20),
    Status BIT DEFAULT 1,
    RoleID INT NOT NULL,

    CONSTRAINT FK_User_Role
        FOREIGN KEY(RoleID)
        REFERENCES Roles(RoleID)
);
GO
CREATE TABLE Suppliers(
    SupplierID INT IDENTITY(1,1) PRIMARY KEY,
    SupplierName NVARCHAR(100) NOT NULL,
    Address NVARCHAR(255),
    Phone VARCHAR(20),
    Email VARCHAR(100)
);
GO

CREATE TABLE Categories(
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL
);
GO
CREATE TABLE Products(
    ProductID INT IDENTITY(1,1) PRIMARY KEY,

    ProductCode VARCHAR(20) NOT NULL UNIQUE,

    ProductName NVARCHAR(150) NOT NULL,

    CategoryID INT,

    SupplierID INT,

    Unit NVARCHAR(20),

    Quantity INT DEFAULT 0,

    ImportPrice DECIMAL(18,2),

    ExportPrice DECIMAL(18,2),

    Description NVARCHAR(255),

    Status BIT DEFAULT 1,

    CONSTRAINT FK_Product_Category
        FOREIGN KEY(CategoryID)
        REFERENCES Categories(CategoryID),

    CONSTRAINT FK_Product_Supplier
        FOREIGN KEY(SupplierID)
        REFERENCES Suppliers(SupplierID)
);
GO
CREATE TABLE ImportReceipts(

    ReceiptID INT IDENTITY(1,1) PRIMARY KEY,

    ImportDate DATETIME DEFAULT GETDATE(),

    UserID INT,

    SupplierID INT,

    Note NVARCHAR(255),

    CONSTRAINT FK_Import_User
        FOREIGN KEY(UserID)
        REFERENCES Users(UserID),

    CONSTRAINT FK_Import_Supplier
        FOREIGN KEY(SupplierID)
        REFERENCES Suppliers(SupplierID)
);
GO
CREATE TABLE ImportDetails(

    DetailID INT IDENTITY(1,1) PRIMARY KEY,

    ReceiptID INT,

    ProductID INT,

    Quantity INT,

    Price DECIMAL(18,2),

    CONSTRAINT FK_ImportDetail_Receipt
        FOREIGN KEY(ReceiptID)
        REFERENCES ImportReceipts(ReceiptID),

    CONSTRAINT FK_ImportDetail_Product
        FOREIGN KEY(ProductID)
        REFERENCES Products(ProductID)
);
GO
CREATE TABLE ExportReceipts(

    ReceiptID INT IDENTITY(1,1) PRIMARY KEY,

    ExportDate DATETIME DEFAULT GETDATE(),

    UserID INT,

    Note NVARCHAR(255),

    CONSTRAINT FK_Export_User
        FOREIGN KEY(UserID)
        REFERENCES Users(UserID)
);
GO
CREATE TABLE ExportDetails(

    DetailID INT IDENTITY(1,1) PRIMARY KEY,

    ReceiptID INT,

    ProductID INT,

    Quantity INT,

    Price DECIMAL(18,2),

    CONSTRAINT FK_ExportDetail_Receipt
        FOREIGN KEY(ReceiptID)
        REFERENCES ExportReceipts(ReceiptID),

    CONSTRAINT FK_ExportDetail_Product
        FOREIGN KEY(ProductID)
        REFERENCES Products(ProductID)
);
GO
INSERT INTO Roles(RoleName)
VALUES
('ADMIN'),
('MANAGER'),
('STAFF');
GO
INSERT INTO Categories(CategoryName)
VALUES
('Laptop'),
('Monitor'),
('Mouse'),
('Keyboard'),
('Printer');
GO
INSERT INTO Suppliers
(SupplierName,Address,Phone,Email)

VALUES

('Dell Vietnam','Ha Noi','0901111111','dell@gmail.com'),

('Logitech','Ho Chi Minh','0902222222','logitech@gmail.com'),

('HP Vietnam','Da Nang','0903333333','hp@gmail.com');
GO
CREATE TRIGGER trg_UpdateImport
ON ImportDetails
AFTER INSERT
AS
BEGIN

    UPDATE p
    SET p.Quantity = p.Quantity + i.Quantity
    FROM Products p
    JOIN inserted i
    ON p.ProductID = i.ProductID;

END;
GO
CREATE TRIGGER trg_UpdateExport
ON ExportDetails
AFTER INSERT
AS
BEGIN

    IF EXISTS
    (
        SELECT *
        FROM inserted i
        JOIN Products p
        ON i.ProductID=p.ProductID
        WHERE i.Quantity>p.Quantity
    )
    BEGIN
        RAISERROR('Not enough quantity!',16,1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    UPDATE p
    SET p.Quantity = p.Quantity - i.Quantity
    FROM Products p
    JOIN inserted i
    ON p.ProductID=i.ProductID;

END;
GO
CREATE VIEW vwInventory
AS

SELECT

ProductID,

ProductCode,

ProductName,

Quantity,

ImportPrice,

ExportPrice

FROM Products;
GO
ALTER TABLE Products
ADD CONSTRAINT CK_Product_Quantity
CHECK (Quantity >= 0);
GO
ALTER TABLE Products
ADD CONSTRAINT CK_Product_ImportPrice
CHECK (ImportPrice >= 0);
GO
ALTER TABLE Products
ADD CONSTRAINT CK_Product_ExportPrice
CHECK (ExportPrice >= 0);
GO
ALTER TABLE ImportDetails
ADD CONSTRAINT CK_Import_Quantity
CHECK (Quantity > 0);
GO
ALTER TABLE ExportDetails
ADD CONSTRAINT CK_Export_Quantity
CHECK (Quantity > 0);
GO
ALTER TABLE ImportDetails
ADD CONSTRAINT CK_Import_Price
CHECK (Price >= 0);
GO
ALTER TABLE ExportDetails
ADD CONSTRAINT CK_Export_Price
CHECK (Price >= 0);
CREATE INDEX IX_ProductCode
ON Products(ProductCode);
GO
CREATE INDEX IX_ProductName
ON Products(ProductName);
GO
INSERT INTO Users
(Username, Password, FullName, Email, Phone, Status, RoleID)
VALUES
('admin',
'$2a$10$KmP4iNod3tyjCUeGH/wuWusHME1xlTm8DApit.uD5I8NKhGUXdnrq',
'System Admin',
'admin@gmail.com',
'0900000000',
1,
1);
GO
INSERT INTO Products
(ProductCode, ProductName, CategoryID, SupplierID, Unit, Quantity, ImportPrice, ExportPrice, Description)

VALUES
('LT001','Dell Latitude 5440',1,1,'Piece',20,18000000,20000000,'Laptop Dell'),

('MS001','Logitech G102',3,2,'Piece',50,250000,350000,'Gaming Mouse'),

('KB001','Logitech K120',4,2,'Piece',40,180000,250000,'Keyboard');
GO