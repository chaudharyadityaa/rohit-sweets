-- Admin users (login arrives in Checkpoint 13). Passwords are stored as BCrypt hashes only.
CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)   NOT NULL,
    description TEXT,
    price       NUMERIC(10,2)  CHECK (price IS NULL OR price >= 0),  -- NULL = owner has not set a price yet
    unit        VARCHAR(20)    NOT NULL DEFAULT 'kg',
    image_url   VARCHAR(500),
    category    VARCHAR(50)    NOT NULL,
    available   BOOLEAN        NOT NULL DEFAULT TRUE,   -- customer can order it
    featured    BOOLEAN        NOT NULL DEFAULT FALSE,
    active      BOOLEAN        NOT NULL DEFAULT TRUE,   -- FALSE = soft-deleted, hidden everywhere
    created_at  TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products (category) WHERE active;

-- Human-friendly order numbers: RS-1001, RS-1002, ... built from this sequence.
CREATE SEQUENCE order_number_seq START WITH 1001;

CREATE TABLE orders (
    id                BIGSERIAL PRIMARY KEY,
    order_number      VARCHAR(20)   NOT NULL UNIQUE,
    customer_name     VARCHAR(60)   NOT NULL,
    phone             VARCHAR(10)   NOT NULL,
    address           VARCHAR(300)  NOT NULL,
    landmark          VARCHAR(100)  NOT NULL,
    instructions      VARCHAR(200),
    delivery_band     VARCHAR(30)   NOT NULL,
    subtotal          NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    delivery_charge   NUMERIC(10,2) NOT NULL CHECK (delivery_charge >= 0),
    total             NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    payment_method    VARCHAR(30)   NOT NULL DEFAULT 'CASH_ON_DELIVERY',
    status            VARCHAR(30)   NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED')),
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status_created ON orders (status, created_at DESC);
CREATE INDEX idx_orders_created ON orders (created_at DESC);

CREATE TABLE order_items (
    id            BIGSERIAL PRIMARY KEY,
    order_id      BIGINT        NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id    BIGINT        NOT NULL REFERENCES products (id),
    product_name  VARCHAR(100)  NOT NULL,   -- snapshot at order time
    unit          VARCHAR(20)   NOT NULL,
    unit_price    NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),  -- snapshot at order time
    quantity      NUMERIC(6,2)  NOT NULL CHECK (quantity > 0),
    line_total    NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)
);

CREATE INDEX idx_order_items_order ON order_items (order_id);

-- Single-row settings table. Delivery charge bands are PROPOSED defaults, not final policy.
CREATE TABLE delivery_settings (
    id             SMALLINT PRIMARY KEY CHECK (id = 1),
    radius_km      NUMERIC(4,1) NOT NULL DEFAULT 7,
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE delivery_bands (
    id         BIGSERIAL PRIMARY KEY,
    from_km    NUMERIC(4,1)  NOT NULL,
    to_km      NUMERIC(4,1)  NOT NULL,
    charge     NUMERIC(10,2) NOT NULL CHECK (charge >= 0),
    CHECK (to_km > from_km)
);

INSERT INTO delivery_settings (id, radius_km) VALUES (1, 7);

-- PROPOSED defaults (see project brief section 9). Owner has not finalised these.
INSERT INTO delivery_bands (from_km, to_km, charge) VALUES
    (0, 3, 30),
    (3, 5, 50),
    (5, 7, 70);