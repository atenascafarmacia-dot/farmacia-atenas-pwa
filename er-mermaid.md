# Diagrama Entidad-Relación — pwa-pharmacy

Generado a partir de `prisma/schema.prisma` (SQLite).

```mermaid
erDiagram
    User     ||--o{ Order        : "realiza"
    User     ||--o{ Address      : "tiene"
    Category ||--o{ Product      : "agrupa"
    Product  ||--o{ ProductBatch : "tiene lotes"
    Order    ||--o{ OrderItem    : "contiene"
    Product  ||--o{ OrderItem    : "aparece en"

    Category {
        string id PK "cuid()"
        string name UK
    }

    User {
        string   id PK "cuid()"
        string   name
        string   email UK "nullable"
        string   phone
        Role     role "default CLIENTE"
        datetime createdAt
        datetime updatedAt
    }

    Address {
        string   id PK "cuid()"
        string   userId FK "onDelete: Cascade"
        string   label "nullable"
        string   address
        string   city
        string   state
        string   zipCode "nullable"
        datetime createdAt
    }

    Product {
        string   id PK "cuid()"
        string   name
        string   description "nullable"
        float    price
        int      stock "default 0"
        string   imageUrl "nullable"
        string   categoryId FK
        datetime expirationDate "nullable"
        boolean  requiresPrescription "default false"
        boolean  isActive "default true"
        datetime createdAt
        datetime updatedAt
    }

    ProductBatch {
        string   id PK "cuid()"
        string   productId FK "onDelete: Cascade"
        string   lotNumber
        datetime expiresAt "nullable"
        int      stock "default 0"
        datetime createdAt
    }

    Order {
        string         id PK "cuid()"
        string         code UK
        string         userId FK
        OrderStatus    status "default PENDIENTE"
        float          total
        DeliveryMethod deliveryMethod "default RETIRO_TIENDA"
        PaymentMethod  paymentMethod
        PaymentStatus  paymentStatus "default PENDIENTE"
        string         notes "nullable"
        string         shippingAddress "nullable"
        string         shippingCity "nullable"
        string         shippingState "nullable"
        string         shippingZip "nullable"
        datetime       createdAt
        datetime       updatedAt
    }

    OrderItem {
        string id PK "cuid()"
        string orderId FK "onDelete: Cascade"
        string productId FK
        int    quantity
        float  unitPrice
    }
```

## Notas

- **Enums:**
  - `OrderStatus`: `PENDIENTE`, `PROCESANDO`, `COMPLETADA`, `CANCELADA`.
  - `Role`: `CLIENTE`, `ADMIN`, `FARMACEUTICO`. El acceso al área de operador se concede a cualquier rol distinto de `CLIENTE`.
  - `DeliveryMethod`: `RETIRO_TIENDA`, `ENVIO_DOMICILIO`.
  - `PaymentMethod`: `EFECTIVO`, `TARJETA`, `TRANSFERENCIA`, `PAGO_MOVIL`.
  - `PaymentStatus`: `PENDIENTE`, `PAGADO`.
- **Category** normaliza las categorías de producto (FK `Product.categoryId`), evitando strings libres duplicados.
- **Address** es la libreta de direcciones del usuario (varias por usuario). Al crear un pedido a domicilio, la dirección se **copia** (snapshot) en los campos `shipping*` de `Order`, de modo que el pedido conserva la dirección aunque la libreta cambie.
- **ProductBatch** registra lotes (número, vencimiento, stock por lote) de forma **informativa**. La cifra autoritativa para los pedidos sigue siendo `Product.stock`, que se decrementa en la transacción atómica de creación de pedidos.
- `OrderItem` es la tabla pivote de la relación muchos-a-muchos entre `Order` y `Product`. `OrderItem.unitPrice` conserva el precio al momento de la compra.
- Al eliminar un `Order`, un `Product` o un `User` se eliminan en cascada sus `OrderItem` / `ProductBatch` / `Address` respectivamente.
- `User.email` y `Order.code` son únicos (UK); `Category.name` es único.
