-- DROP DATABASE IF EXISTS bike_store;
CREATE DATABASE IF NOT EXISTS bike_store;
USE bike_store;

-- ===========================
-- TABLA: usuarios
-- ===========================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contrasena VARCHAR (50) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    rol ENUM('administrador', 'cliente') DEFAULT 'cliente'
);

-- ===========================
-- TABLA: categorias
-- ===========================
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(250) NOT NULL
);

-- ===========================
-- TABLA: productos
-- ===========================
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nombre_producto VARCHAR(250) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ===========================
-- TABLA: entrada (registro de inventario)
-- ===========================
CREATE TABLE entradas (
    id_entrada INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABLA: venta
-- ===========================
CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABLA: detalle_venta (relación tiene)
-- ===========================
CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    monto_total DECIMAL(10,2),
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ===========================
-- TABLA: usuarios
-- ===========================
INSERT INTO usuarios (nombre, contrasena, correo, rol)
VALUES
('Anderson Erazo',  'iii', 'jairerazo420@gmail.com', 'administrador'),
('Carlos Pérez',  'eee', 'carlos@gmail.com', 'cliente'),
('Camilo Garcia', 'aaa', 'garcia.cam@gmail.com', 'cliente');
-- ===========================
SELECT * FROM usuarios;
-- TABLA: categorias
-- ===========================
INSERT INTO categorias (nombre_categoria)
VALUES
('Montaña'),
('Ruta'),
('Urbanas'),
('Electricas'),
('Accesorios'),
('Repuestos');

SELECT * FROM categorias;
-- ===========================
-- TABLA: productos
-- ===========================
INSERT INTO productos (id_categoria, nombre_producto, descripcion, precio, stock)
VALUES
(1, 'MTB Pro XT', 'Bicicleta de montaña con suspensión delantera y marco de aluminio', 2500000, 10),
(1, 'Trail 500', 'Bicicleta de montaña para principiantes con frenos de disco mecánicos', 1500000, 8),
(4, 'Cadena Shimano HG40', 'Cadena para bicicleta de 8 velocidades', 65000, 15),
(4, 'UrbanBiker UB200', 'E-Bike urbana de suspensión completa de la marca UrbanBiker, ideal para ciudad', 1800000, 7),
(3, 'Scott Sub Cross 6', 'Bicicleta urbana/trekking Scott Sub Cross 6, marco aluminio, ruedas 28”', 1200000, 12),
(4, 'Canyon Precede:ON', 'E-Bike urbana premium Canyon Precede:ON con asistencia eléctrica y componentes de alta gama', 4000000, 3),
(3, 'Brooklyn Bicycle Co. Wythe Fixie', 'Bicicleta urbana estilo fixie de Brooklyn Bicycle Co.', 650000, 15),
(5, 'TENWAYS CGO600', 'E-Bike ciudad TENWAYS CGO600 – serie ligera para movilidad urbana eléctrica', 1500000, 8),
(2, 'Cinelli VIGORELLI Fixie', 'Bicicleta urbana/track Cinelli VIGORELLI – muy buscada entre entusiastas urbanos', 900000, 10);

SELECT * FROM productos;
-- ===========================
-- TABLA: entradas (inventario inicial)
-- ===========================
INSERT INTO entradas (id_producto, tipo, cantidad)
VALUES
(1, 'entrada', 15), -- Bicicleta MTB Pro XT
(2, 'entrada', 10), -- Bicicleta Trail 500
(3, 'entrada', 8),  -- Bicicleta de Ruta AeroSpeed
(4, 'entrada', 10), -- Casco MTB RockRider
(5, 'entrada', 15), -- Cadena Shimano HG40
(6, 'entrada', 10), -- UrbanBiker UB200
(7, 'entrada', 15), -- Scott Sub Cross 6
(8, 'entrada', 5),  -- Canyon Precede:ON
(9, 'entrada', 20); -- Brooklyn Bicycle Co. Wythe Fixie

-- ===========================
-- TABLA: venta
-- ===========================
INSERT INTO venta (id_usuario, monto_total)
VALUES
(2, 5150000);  -- Carlos Pérez
UPDATE venta SET monto_total = 4780000 WHERE id_venta = 1;
-- ===========================
-- TABLA: detalle_venta
-- ===========================
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, monto_total)
VALUES
(1, 1, 1, 2500000),  -- MTB Pro XT
(1, 2, 1, 1500000),  -- Trail 500
(1, 3, 2, 130000),   -- 2 cadenas Shimano HG40
(1, 7, 1, 650000);

SELECT * FROM detalle_venta;