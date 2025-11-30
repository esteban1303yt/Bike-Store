-- DROP DATABASE IF EXISTS bike_store;
CREATE DATABASE IF NOT EXISTS bike_store;
USE bike_store;

-- =====================================
-- TABLA: usuarios
-- =====================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20),
    correo VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    clave VARCHAR (255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    rol ENUM('administrador', 'cliente') DEFAULT 'cliente'
);

-- =====================================
-- TABLA: categorias
-- =====================================
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(250) NOT NULL
);

-- =====================================
-- TABLA: marcas
-- =====================================
CREATE TABLE marcas (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre_marca VARCHAR(150) NOT NULL UNIQUE
);

INSERT INTO marcas (nombre_marca)
VALUES
('KSW BIKES'),
('TYESO'),
('Specialized'),
('Giant'),
('Cannondale'),
('Garmin');

-- =====================================
-- TABLA: productos
-- =====================================
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(250) NOT NULL,
    id_categoria INT,
    id_marca INT NULL,
    ano YEAR NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    stock INT DEFAULT 0,
    imagen VARCHAR(255) NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- =====================================
-- TABLA: entradas
-- =====================================
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

-- =====================================
-- TABLA: venta
-- =====================================
CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =====================================
-- TABLA: detalle_venta
-- =====================================
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

-- =====================================
-- INSERTAR USUARIOS
-- =====================================
INSERT INTO usuarios (nombre, apellido, correo, telefono, clave, rol)
VALUES
('Anderson', 'Erazo', 'jairerazo420@gmail.com', '3166228607', '$2b$10$jq01JbaQHZv6MDbz1pWvpuDXvR/dbPTm.WZtQrBCDfZzuPxtoRiii', 'administrador'), -- clave: 123
('Esteban', 'Garcia', 'esteban.garcia.valencia13@gmail.com', '3136284927', '$2b$10$jq01JbaQHZv6MDbz1pWvpuDXvR/dbPTm.WZtQrBCDfZzuPxtoRiii', 'administrador'), -- clave: 123
('Santiago', 'Lemos', 'santyagolemosr@gmail.com', '3232969713', '$2b$10$jq01JbaQHZv6MDbz1pWvpuDXvR/dbPTm.WZtQrBCDfZzuPxtoRiii', 'administrador'), -- clave: 123
('John', 'Doe', 'john@gmail.com', '3979723353', '$2b$10$00OU0C.xKlFMlQrRip8sEu3uzaH3yi5qFAOoiBIK7ox/Y3cOyljo2', 'cliente'); -- clave: hola

-- =====================================
-- INSERTAR CATEGORÍAS
-- =====================================
INSERT INTO categorias (nombre_categoria)
VALUES
('Montaña'),
('Ruta'),
('Urbanas'),
('Electricas'),
('Accesorios'),
('Repuestos');

-- =====================================
-- INSERTAR PRODUCTOS
-- (marcas NULL e imágenes NULL por defecto)
-- =====================================
INSERT INTO productos (nombre_producto, id_categoria, id_marca, ano, precio, descripcion, stock, imagen)
VALUES
('MTB Pro XT', 1, 1, 2018, 2500000, 'Bicicleta de montaña con suspensión delantera y marco de aluminio', 10, 'mtb_pro_xt.png'),
('Trail 500', 1, 5, 2020, 1500000, 'Bicicleta de montaña para principiantes con frenos de disco mecánicos', 8, 'trail_500.png'),
('Cadena Shimano HG40', 6, NULL, 2017, 65000, 'Cadena para bicicleta de 8 velocidades', 15, 'cadena_shimano_hg40.png'),
('Urban Glide Classic 28', 4, 6, 2019, 1900000, 'Urban Glide Classic 28, bicicleta urbana de estilo retro.', 7, 'urban_glide_glassic_28.png'),
('Scott Sub Cross 6', 3, 4, 2021, 1200000, 'Bicicleta urbana / trekking Scott', 12, NULL),
('Verde TrailRider 300', 4, 3, 2023, 4000000, 'Bicicleta de montaña diseñada para aventureros.', 3, 'verde_trailrider_300.png'),
('Ground Control Grid 2Bliss Ready T7', 6, NULL, 2016, 650000, 'Utiliza un dibujo en la banda de rodadura', 15, 'ground_control_grid_2Bliss_ready_t7.png'),
('TENWAYS CGO600', 5, 2, 2024, 1500000, 'E-Bike ligera para ciudad', 8, NULL),
('Blue Ridge X-Trail', 2, 5, 2025, 900000, 'Bicicleta de montaña moderna, diseñada para ofrecer control y rendimiento en terrenos exigentes.', 10, 'blue_ridge_x-trail.png');

-- =====================================
-- INSERTAR ENTRADAS (inventario)
-- =====================================
INSERT INTO entradas (id_producto, tipo, cantidad)
VALUES
(1, 'entrada', 15),
(2, 'entrada', 10),
(3, 'entrada', 8),
(4, 'entrada', 10),
(5, 'entrada', 15),
(6, 'entrada', 10),
(7, 'entrada', 15),
(8, 'entrada', 5),
(9, 'entrada', 20);

-- =====================================
-- INSERTAR VENTA
-- =====================================
INSERT INTO venta (id_usuario, monto_total)
VALUES (2, 4780000);

-- =====================================
-- DETALLE VENTA
-- =====================================
INSERT INTO detalle_venta (id_venta, id_producto, cantidad, monto_total)
VALUES
(1, 1, 1, 2500000),
(1, 2, 1, 1500000),
(1, 3, 2, 130000),
(1, 7, 1, 650000);