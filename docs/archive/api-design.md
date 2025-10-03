# API Design Documentation for Eesha Silks E-commerce

## Overview

This document defines the complete REST API design for the Eesha Silks mobile e-commerce application. The API is built on Supabase's auto-generated REST API with custom Edge Functions for complex business logic.

## Architecture Philosophy

### MVP Approach
- **Supabase REST API** for CRUD operations
- **Edge Functions** for complex business logic
- **Row Level Security** for authorization
- **JSON responses** following REST conventions

### Scaling Strategy
- **Consistent API contracts** maintained during multi-vendor migration
- **Versioning strategy** for breaking changes
- **Rate limiting** and caching for performance
- **Webhook integration** for real-time updates

## Base Configuration

### API Base URLs
```
Development: https://your-project-id.supabase.co/rest/v1/
Production: https://api.eeshasilks.com/v1/
Edge Functions: https://your-project-id.supabase.co/functions/v1/
```

### Authentication
All authenticated requests require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

### Common Headers
```
Content-Type: application/json
Accept: application/json
X-API-Version: 1.0
X-Client-Platform: mobile
```

### Standard Response Format
```json
{
  "data": {},
  "error": null,
  "message": "Success",
  "timestamp": "2025-01-15T10:30:00Z",
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

## Core API Endpoints

### 1. Authentication APIs

#### POST /auth/v1/signup
```json
// Request
{
  "email": "user@example.fr",
  "password": "SecurePass123!",
  "data": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "phone": "+33612345678",
    "marketing_consent": true
  }
}

// Response (201 Created)
{
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.fr",
      "email_confirmed_at": null,
      "created_at": "2025-01-15T10:30:00Z"
    },
    "session": {
      "access_token": "eyJ...",
      "refresh_token": "xyz...",
      "expires_in": 3600
    }
  },
  "message": "Inscription réussie. Veuillez vérifier votre email."
}
```

#### POST /auth/v1/token
```json
// Request
{
  "email": "user@example.fr",
  "password": "SecurePass123!"
}

// Response (200 OK)
{
  "data": {
    "session": {
      "access_token": "eyJ...",
      "refresh_token": "xyz...",
      "expires_in": 3600
    },
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.fr"
    }
  }
}
```

### 2. Product Catalog APIs

#### GET /products
```json
// Query Parameters
?category=sarees&page=1&limit=20&search=silk&in_stock=true&price_min=50&price_max=200

// Response (200 OK)
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sari en Soie Premium",
      "description": "Magnifique sari en soie pure avec broderies dorées",
      "base_price": 129.99,
      "compare_at_price": 199.99,
      "images": [
        "https://cdn.eeshasilks.com/sari-premium-main.webp",
        "https://cdn.eeshasilks.com/sari-premium-detail.webp"
      ],
      "category": "sarees",
      "tags": ["silk", "premium", "wedding"],
      "status": "active",
      "vendor_id": null,
      "variants": [
        {
          "id": "var-001",
          "sku": "SAR-PREM-S-RED",
          "size": "S",
          "color": "Rouge",
          "color_hex": "#DC143C",
          "price": null,
          "stock_quantity": 12,
          "image_url": "https://cdn.eeshasilks.com/sari-red.webp",
          "active": true
        },
        {
          "id": "var-002",
          "sku": "SAR-PREM-M-RED",
          "size": "M",
          "color": "Rouge",
          "color_hex": "#DC143C",
          "price": null,
          "stock_quantity": 8,
          "image_url": "https://cdn.eeshasilks.com/sari-red.webp",
          "active": true
        }
      ],
      "badges": ["sale", "bestseller"],
      "created_at": "2025-01-10T15:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 60,
    "total_pages": 3
  }
}
```

#### GET /products/{id}
```json
// Response (200 OK)
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Sari en Soie Premium",
    "description": "Magnifique sari en soie pure avec broderies dorées. Parfait pour les mariages et occasions spéciales.",
    "base_price": 129.99,
    "compare_at_price": 199.99,
    "images": [
      "https://cdn.eeshasilks.com/sari-premium-main.webp",
      "https://cdn.eeshasilks.com/sari-premium-gallery-1.webp",
      "https://cdn.eeshasilks.com/sari-premium-gallery-2.webp"
    ],
    "category": "sarees",
    "tags": ["silk", "premium", "wedding", "traditional"],
    "variants": [
      {
        "id": "var-001",
        "sku": "SAR-PREM-S-RED",
        "size": "S",
        "color": "Rouge",
        "color_hex": "#DC143C",
        "price": null,
        "stock_quantity": 12,
        "reserved_quantity": 2,
        "image_url": "https://cdn.eeshasilks.com/sari-red.webp",
        "active": true
      }
    ],
    "related_products": ["product-id-1", "product-id-2"],
    "seo": {
      "title": "Sari en Soie Premium Rouge - Eesha Silks",
      "description": "Découvrez notre magnifique sari en soie premium avec broderies dorées."
    },
    "created_at": "2025-01-10T15:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

#### POST /rpc/search_products (Edge Function)
```json
// Request
{
  "search_term": "soie rouge",
  "category_filter": "sarees",
  "price_min": 50,
  "price_max": 200,
  "in_stock_only": true,
  "limit": 20,
  "offset": 0
}

// Response (200 OK)
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sari en Soie Premium",
      "description": "Magnifique sari en soie pure...",
      "base_price": 129.99,
      "relevance": 0.8945,
      "in_stock": true,
      "match_score": {
        "title_match": 0.9,
        "description_match": 0.7,
        "tag_match": 0.8
      }
    }
  ],
  "meta": {
    "search_term": "soie rouge",
    "results_count": 12,
    "search_time_ms": 45
  }
}
```

### 3. Shopping Cart APIs

#### GET /carts/current
```json
// Response (200 OK)
{
  "data": {
    "id": "cart-uuid",
    "user_id": "user-uuid",
    "items": [
      {
        "variant_id": "var-001",
        "product_id": "product-uuid",
        "product_name": "Sari en Soie Premium",
        "size": "M",
        "color": "Rouge",
        "quantity": 2,
        "price": 129.99,
        "subtotal": 259.98,
        "image_url": "https://cdn.eeshasilks.com/sari-red.webp",
        "in_stock": true,
        "reserved_until": "2025-01-15T11:00:00Z"
      }
    ],
    "summary": {
      "subtotal": 259.98,
      "vat_rate": 20.00,
      "vat_amount": 52.00,
      "shipping_amount": 10.00,
      "discount_amount": 0,
      "total": 321.98,
      "currency": "EUR",
      "item_count": 2
    },
    "expires_at": "2025-01-22T10:30:00Z",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### POST /functions/v1/cart-add
```json
// Request
{
  "variant_id": "var-001",
  "quantity": 2
}

// Response (200 OK)
{
  "data": {
    "success": true,
    "cart": {
      "id": "cart-uuid",
      "items": [...],
      "summary": {
        "subtotal": 259.98,
        "vat_amount": 52.00,
        "shipping_amount": 10.00,
        "total": 321.98,
        "item_count": 2
      }
    },
    "reservation": {
      "reserved_until": "2025-01-15T11:00:00Z",
      "stock_remaining": 10
    }
  },
  "message": "Produit ajouté au panier"
}
```

#### PUT /functions/v1/cart-update
```json
// Request
{
  "variant_id": "var-001",
  "quantity": 3
}

// Response (200 OK)
{
  "data": {
    "cart": {
      "items": [...],
      "summary": {
        "subtotal": 389.97,
        "total": 477.96,
        "item_count": 3
      }
    }
  },
  "message": "Panier mis à jour"
}
```

#### DELETE /functions/v1/cart-remove
```json
// Request
{
  "variant_id": "var-001"
}

// Response (200 OK)
{
  "data": {
    "cart": {
      "items": [],
      "summary": {
        "subtotal": 0,
        "total": 0,
        "item_count": 0
      }
    }
  },
  "message": "Produit retiré du panier"
}
```

### 4. Checkout & Orders APIs

#### POST /functions/v1/checkout-create
```json
// Request
{
  "shipping_address": {
    "name": "Jean Dupont",
    "line1": "123 Rue de la République",
    "line2": "Apt 4B",
    "city": "Paris",
    "postal_code": "75001",
    "country": "FR",
    "phone": "+33612345678"
  },
  "billing_address": {
    "name": "Jean Dupont",
    "line1": "123 Rue de la République",
    "city": "Paris",
    "postal_code": "75001",
    "country": "FR"
  },
  "shipping_method": "standard",
  "notes": "Livraison en point relais souhaité"
}

// Response (201 Created)
{
  "data": {
    "order_id": "order-uuid",
    "order_number": "CMD-20250115-1001",
    "payment_intent": {
      "id": "pi_stripe_id",
      "client_secret": "pi_abc123_secret_xyz",
      "amount": 32198,
      "currency": "eur"
    },
    "order_summary": {
      "items": [...],
      "subtotal": 259.98,
      "vat_amount": 52.00,
      "shipping_amount": 10.00,
      "total": 321.98,
      "currency": "EUR"
    },
    "estimated_delivery": "2025-01-20"
  },
  "message": "Commande créée avec succès"
}
```

#### POST /functions/v1/payment-confirm
```json
// Request
{
  "payment_intent_id": "pi_stripe_id",
  "order_id": "order-uuid"
}

// Response (200 OK)
{
  "data": {
    "order": {
      "id": "order-uuid",
      "order_number": "CMD-20250115-1001",
      "status": "processing",
      "payment_status": "paid",
      "total": 321.98,
      "tracking": {
        "current_status": "payment_confirmed",
        "estimated_delivery": "2025-01-20"
      }
    }
  },
  "message": "Paiement confirmé - Commande en cours de traitement"
}
```

#### GET /orders
```json
// Query Parameters
?status=processing&page=1&limit=10

// Response (200 OK)
{
  "data": [
    {
      "id": "order-uuid",
      "order_number": "CMD-20250115-1001",
      "status": "processing",
      "payment_status": "paid",
      "total": 321.98,
      "currency": "EUR",
      "items": [
        {
          "variant_id": "var-001",
          "product_name": "Sari en Soie Premium",
          "size": "M",
          "color": "Rouge",
          "quantity": 2,
          "price": 129.99,
          "image_url": "https://cdn.eeshasilks.com/sari-red.webp"
        }
      ],
      "shipping_address": {
        "name": "Jean Dupont",
        "line1": "123 Rue de la République",
        "city": "Paris",
        "postal_code": "75001"
      },
      "tracking": {
        "number": "20250115-1234",
        "carrier": "internal",
        "current_status": "processing",
        "url": "https://app.eeshasilks.com/tracking/20250115-1234"
      },
      "created_at": "2025-01-15T10:30:00Z",
      "estimated_delivery": "2025-01-20"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 5,
    "total_pages": 1
  }
}
```

#### GET /orders/{id}
```json
// Response (200 OK)
{
  "data": {
    "id": "order-uuid",
    "order_number": "CMD-20250115-1001",
    "status": "shipped",
    "payment_status": "paid",
    "payment_method": "card",
    "customer_email": "user@example.fr",
    "items": [
      {
        "variant_id": "var-001",
        "product_id": "product-uuid",
        "product_name": "Sari en Soie Premium",
        "size": "M",
        "color": "Rouge",
        "quantity": 2,
        "price": 129.99,
        "subtotal": 259.98,
        "image_url": "https://cdn.eeshasilks.com/sari-red.webp"
      }
    ],
    "pricing": {
      "subtotal": 259.98,
      "vat_rate": 20.00,
      "vat_amount": 52.00,
      "shipping_amount": 10.00,
      "discount_amount": 0,
      "total": 321.98,
      "currency": "EUR"
    },
    "addresses": {
      "shipping": {
        "name": "Jean Dupont",
        "line1": "123 Rue de la République",
        "city": "Paris",
        "postal_code": "75001",
        "country": "FR",
        "phone": "+33612345678"
      },
      "billing": {
        "name": "Jean Dupont",
        "line1": "123 Rue de la République",
        "city": "Paris",
        "postal_code": "75001",
        "country": "FR"
      }
    },
    "tracking": {
      "number": "20250115-1234",
      "carrier": "internal",
      "current_status": "shipped",
      "estimated_delivery": "2025-01-20",
      "events": [
        {
          "status": "order_placed",
          "status_french": "Commande reçue",
          "description": "Votre commande a été confirmée",
          "location": "Paris, France",
          "timestamp": "2025-01-15T10:30:00Z"
        },
        {
          "status": "payment_confirmed",
          "status_french": "Paiement confirmé",
          "description": "Le paiement a été traité avec succès",
          "location": "Paris, France",
          "timestamp": "2025-01-15T10:35:00Z"
        },
        {
          "status": "preparing",
          "status_french": "En préparation",
          "description": "Votre commande est en cours de préparation",
          "location": "Paris, France",
          "timestamp": "2025-01-15T14:00:00Z"
        },
        {
          "status": "shipped",
          "status_french": "Expédiée",
          "description": "Votre colis a été expédié",
          "location": "Paris, France",
          "timestamp": "2025-01-16T09:00:00Z"
        }
      ]
    },
    "timeline": {
      "ordered": "2025-01-15T10:30:00Z",
      "confirmed": "2025-01-15T10:35:00Z",
      "shipped": "2025-01-16T09:00:00Z",
      "estimated_delivery": "2025-01-20"
    },
    "notes": "Livraison en point relais souhaité",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-16T09:00:00Z"
  }
}
```

### 5. Order Tracking APIs

#### GET /orders/{id}/tracking
```json
// Response (200 OK)
{
  "data": {
    "order_number": "CMD-20250115-1001",
    "tracking_number": "20250115-1234",
    "tracking_url": "https://app.eeshasilks.com/tracking/20250115-1234",
    "carrier": "internal",
    "current_status": "shipped",
    "current_status_french": "Expédiée",
    "estimated_delivery": "2025-01-20",
    "events": [
      {
        "id": "track-001",
        "status": "order_placed",
        "status_french": "Commande reçue",
        "description": "Votre commande a été confirmée et sera bientôt traitée",
        "location": "Paris, France",
        "timestamp": "2025-01-15T10:30:00Z",
        "is_current": false
      },
      {
        "id": "track-002",
        "status": "payment_confirmed",
        "status_french": "Paiement confirmé",
        "description": "Le paiement a été traité avec succès",
        "location": "Paris, France",
        "timestamp": "2025-01-15T10:35:00Z",
        "is_current": false
      },
      {
        "id": "track-003",
        "status": "preparing",
        "status_french": "En préparation",
        "description": "Votre commande est en cours de préparation dans nos ateliers",
        "location": "Paris, France",
        "timestamp": "2025-01-15T14:00:00Z",
        "is_current": false
      },
      {
        "id": "track-004",
        "status": "shipped",
        "status_french": "Expédiée",
        "description": "Votre colis a été expédié et est en route",
        "location": "Paris, France",
        "timestamp": "2025-01-16T09:00:00Z",
        "is_current": true
      }
    ],
    "next_status": "out_for_delivery",
    "next_status_french": "En cours de livraison",
    "can_cancel": false,
    "return_window_ends": "2025-02-05"
  }
}
```

#### GET /tracking/{tracking_number}
Public endpoint for customer tracking without authentication:
```json
// Response (200 OK)
{
  "data": {
    "tracking_number": "20250115-1234",
    "order_number": "CMD-20250115-1001",
    "status": "shipped",
    "status_french": "Expédiée",
    "estimated_delivery": "2025-01-20",
    "last_update": "2025-01-16T09:00:00Z",
    "events": [...], // Same as above
    "customer_support": {
      "email": "support@eeshasilks.com",
      "phone": "+33123456789",
      "hours": "Lun-Ven 9h-18h"
    }
  }
}
```

### 6. User Profile APIs

#### GET /user-profiles/me
```json
// Response (200 OK)
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.fr",
    "first_name": "Jean",
    "last_name": "Dupont",
    "phone": "+33612345678",
    "avatar_url": "https://cdn.eeshasilks.com/avatars/user.jpg",
    "date_of_birth": "1990-05-15",
    "addresses": {
      "shipping": {
        "name": "Jean Dupont",
        "line1": "123 Rue de la République",
        "city": "Paris",
        "postal_code": "75001",
        "country": "FR"
      },
      "billing": {
        "name": "Jean Dupont",
        "line1": "123 Rue de la République",
        "city": "Paris",
        "postal_code": "75001",
        "country": "FR"
      }
    },
    "preferences": {
      "marketing_consent": true,
      "sms_consent": false,
      "preferred_language": "fr",
      "newsletter_categories": ["new_arrivals", "sales"]
    },
    "statistics": {
      "customer_since": "2024-03-15T10:00:00Z",
      "total_orders": 12,
      "lifetime_value": 1580.45,
      "last_order_date": "2025-01-15T10:30:00Z"
    },
    "created_at": "2024-03-15T10:00:00Z",
    "updated_at": "2025-01-15T08:00:00Z"
  }
}
```

#### PATCH /user-profiles/me
```json
// Request
{
  "first_name": "Jean-Pierre",
  "phone": "+33687654321",
  "default_shipping_address": {
    "name": "Jean-Pierre Dupont",
    "line1": "456 Avenue des Champs",
    "city": "Lyon",
    "postal_code": "69001",
    "country": "FR"
  }
}

// Response (200 OK)
{
  "data": {
    "id": "user-uuid",
    "first_name": "Jean-Pierre",
    "phone": "+33687654321",
    // ... updated profile
  },
  "message": "Profil mis à jour avec succès"
}
```

## Multi-Vendor APIs (Phase 3)

### 7. Vendor Management APIs

#### POST /functions/v1/vendor-apply
```json
// Request
{
  "business_name": "Boutique Soie Dorée",
  "business_email": "contact@soiedoree.fr",
  "business_phone": "+33123456789",
  "siret_number": "12345678901234",
  "business_address": {
    "line1": "789 Rue du Commerce",
    "city": "Marseille",
    "postal_code": "13001",
    "country": "FR"
  },
  "shipping_zones": ["FR", "BE", "CH"],
  "product_categories": ["sarees", "lehengas"],
  "business_description": "Spécialiste des saris traditionnels indiens"
}

// Response (201 Created)
{
  "data": {
    "vendor_id": "vendor-uuid",
    "application_status": "pending",
    "next_steps": [
      "Vérification des documents légaux",
      "Configuration du compte Stripe",
      "Formation à la plateforme"
    ],
    "estimated_approval_time": "3-5 jours ouvrés"
  },
  "message": "Candidature de vendeur soumise avec succès"
}
```

#### GET /vendors/me/dashboard
```json
// Response (200 OK)
{
  "data": {
    "vendor": {
      "id": "vendor-uuid",
      "business_name": "Boutique Soie Dorée",
      "status": "active",
      "commission_rate": 10.00,
      "stripe_connected": true
    },
    "metrics": {
      "period": "30d",
      "total_products": 45,
      "total_orders": 128,
      "total_revenue": 12850.00,
      "commission_owed": 1285.00,
      "avg_order_value": 100.39,
      "conversion_rate": 2.8
    },
    "recent_orders": [
      {
        "id": "order-uuid",
        "order_number": "CMD-20250115-1001",
        "customer_name": "Jean D.",
        "total": 129.99,
        "status": "shipped",
        "created_at": "2025-01-15T10:30:00Z"
      }
    ],
    "pending_actions": [
      {
        "type": "low_stock",
        "message": "3 produits en rupture de stock",
        "action_url": "/vendor/products?filter=low_stock"
      }
    ]
  }
}
```

#### GET /vendors/me/orders
```json
// Query Parameters
?status=processing&date_from=2025-01-01&date_to=2025-01-31

// Response (200 OK)
{
  "data": [
    {
      "id": "order-uuid",
      "order_number": "CMD-20250115-1001",
      "customer": {
        "name": "Jean Dupont",
        "email": "j.dupont@email.fr" // Masked for privacy
      },
      "items": [
        {
          "product_name": "Sari en Soie Premium",
          "variant": "Rouge",
          "quantity": 1,
          "price": 129.99
        }
      ],
      "total": 129.99,
      "commission": 12.99,
      "status": "processing",
      "shipping_address": {
        "city": "Paris",
        "postal_code": "75001" // Full address hidden for privacy
      },
      "created_at": "2025-01-15T10:30:00Z",
      "ship_by_date": "2025-01-17T23:59:59Z"
    }
  ]
}
```

## Edge Functions (Business Logic)

### 8. Inventory Management Function

#### POST /functions/v1/inventory-check
```json
// Request
{
  "items": [
    {
      "variant_id": "var-001",
      "quantity": 2
    },
    {
      "variant_id": "var-002",
      "quantity": 1
    }
  ]
}

// Response (200 OK)
{
  "data": {
    "available": true,
    "items": [
      {
        "variant_id": "var-001",
        "requested": 2,
        "available": 12,
        "reserved": 3,
        "in_stock": true
      },
      {
        "variant_id": "var-002",
        "requested": 1,
        "available": 0,
        "reserved": 0,
        "in_stock": false,
        "restock_date": "2025-01-25"
      }
    ],
    "unavailable_items": ["var-002"]
  },
  "message": "1 article non disponible"
}
```

### 9. Pricing Calculator Function

#### POST /functions/v1/calculate-pricing
```json
// Request
{
  "items": [
    {
      "variant_id": "var-001",
      "quantity": 2,
      "price": 129.99
    }
  ],
  "shipping_country": "FR",
  "discount_code": "WELCOME10"
}

// Response (200 OK)
{
  "data": {
    "subtotal": 259.98,
    "discounts": [
      {
        "code": "WELCOME10",
        "type": "percentage",
        "value": 10,
        "amount": 25.998,
        "description": "Bienvenue - 10% de réduction"
      }
    ],
    "discount_total": 25.998,
    "subtotal_after_discount": 233.982,
    "tax": {
      "rate": 20.00,
      "amount": 46.796,
      "inclusive": false,
      "description": "TVA française"
    },
    "shipping": {
      "method": "standard",
      "cost": 10.00,
      "free_threshold": 100.00,
      "description": "Livraison standard France"
    },
    "total": 290.778,
    "total_formatted": "€290.78",
    "breakdown": {
      "subtotal": "€259.98",
      "discount": "-€25.998",
      "tax": "€46.80",
      "shipping": "€10.00",
      "total": "€290.78"
    }
  }
}
```

### 10. Recommendation Engine Function

#### GET /functions/v1/recommendations/{user_id}
```json
// Query Parameters
?type=cross_sell&product_id=123e4567-e89b-12d3-a456-426614174000&limit=8

// Response (200 OK)
{
  "data": {
    "recommendations": [
      {
        "id": "rec-001",
        "product": {
          "id": "product-uuid",
          "name": "Sari Complémentaire",
          "base_price": 89.99,
          "images": ["image-url"],
          "relevance_score": 0.92
        },
        "reason": "Souvent acheté ensemble",
        "recommendation_type": "cross_sell"
      }
    ],
    "algorithm": "collaborative_filtering",
    "confidence": 0.85,
    "generated_at": "2025-01-15T10:30:00Z"
  }
}
```

## Error Handling

### Standard Error Responses

#### 400 Bad Request
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Les données fournies ne sont pas valides",
    "details": [
      {
        "field": "email",
        "message": "Format d'email invalide"
      },
      {
        "field": "quantity",
        "message": "La quantité doit être supérieure à 0"
      }
    ]
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### 401 Unauthorized
```json
{
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token d'authentification requis ou invalide"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### 404 Not Found
```json
{
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "La ressource demandée n'existe pas",
    "resource": "product",
    "resource_id": "non-existent-id"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### 409 Conflict (Stock Issues)
```json
{
  "data": null,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stock insuffisant pour cette commande",
    "details": {
      "variant_id": "var-001",
      "requested": 5,
      "available": 2,
      "alternative_variants": ["var-002", "var-003"]
    }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### 429 Too Many Requests
```json
{
  "data": null,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Trop de requêtes. Réessayez dans quelques instants.",
    "retry_after": 60
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

## Rate Limiting & Performance

### Rate Limits
```
Authentication endpoints: 10 requests/minute
Cart operations: 30 requests/minute
Catalog browsing: 100 requests/minute
Order operations: 20 requests/minute
Search: 50 requests/minute
```

### Caching Headers
```
Cache-Control: public, max-age=300 (products)
Cache-Control: private, max-age=60 (user data)
Cache-Control: no-cache (cart, orders)
ETag: "version-hash" (for conditional requests)
```

### Performance Optimizations
- **Pagination**: All list endpoints support pagination
- **Field Selection**: Use `?fields=id,name,price` to request specific fields
- **Image Optimization**: Multiple image sizes available via query parameters
- **Compression**: All responses use gzip compression

## Webhook Endpoints

### Stripe Webhooks

#### POST /webhooks/stripe
```json
// Payment Intent Succeeded
{
  "id": "evt_stripe_id",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_stripe_id",
      "metadata": {
        "order_id": "order-uuid"
      }
    }
  }
}

// Response (200 OK)
{
  "received": true,
  "processed": true,
  "order_updated": true
}
```

### Internal Webhooks (For Integrations)

#### POST /webhooks/order-status
```json
// Order Status Change
{
  "event": "order.status_changed",
  "order_id": "order-uuid",
  "old_status": "processing",
  "new_status": "shipped",
  "tracking_number": "20250115-1234",
  "timestamp": "2025-01-16T09:00:00Z"
}
```

## API Versioning & Migration

### Version Headers
```
X-API-Version: 1.0 (current)
X-API-Version: 2.0 (future multi-vendor)
```

### Breaking Changes Policy
- **Major versions** for breaking changes
- **Minor versions** for new features
- **Patch versions** for bug fixes
- **Deprecation warnings** 6 months before removal

### Migration Timeline
- **v1.0**: MVP with single vendor
- **v1.1**: Enhanced search and recommendations
- **v2.0**: Multi-vendor marketplace (Month 3)

This API design ensures consistency, scalability, and maintainability while providing a smooth migration path from single-vendor MVP to multi-vendor marketplace.