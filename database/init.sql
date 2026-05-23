CREATE TABLE IF NOT EXISTS persona (
  nro_documento      VARCHAR(10)  PRIMARY KEY,
  tipo_documento     VARCHAR(20)  NOT NULL,
  primer_nombre      VARCHAR(30)  NOT NULL,
  segundo_nombre     VARCHAR(30),
  apellidos          VARCHAR(60)  NOT NULL,
  fecha_nacimiento   DATE         NOT NULL,
  genero             VARCHAR(30)  NOT NULL,
  correo_electronico VARCHAR(100) NOT NULL,
  celular            VARCHAR(10)  NOT NULL,
  foto_path          VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS log (
  id             SERIAL       PRIMARY KEY,
  tipo_operacion VARCHAR(20)  NOT NULL,
  nro_documento  VARCHAR(10)  NOT NULL,
  resultado      VARCHAR(10)  NOT NULL,
  usuario        VARCHAR(100) NOT NULL,
  fecha_hora     TIMESTAMP    NOT NULL DEFAULT NOW(),
  detalle        TEXT
);
