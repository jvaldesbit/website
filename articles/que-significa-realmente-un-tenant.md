---
title: "¿Qué significa realmente un tenant? Una decisión de arquitectura más compleja de lo que parece"
description: "Por qué en un SaaS Multi-Tenant de alta demanda un tenant no es solo una empresa: también es una unidad de consumo de infraestructura y costos."
date: "2026-07-02"
tags: ["SaaS", "Multi-Tenant", "Arquitectura de Software", "System Design"]
author: "Julián Valdés Bello"
published: true
---
Si buscas en Internet cómo construir un sistema SaaS Multi-Tenant, encontrarás decenas de artículos sobre aislamiento de datos, bases de datos compartidas o dedicadas y estrategias de identificación de tenants. Son buenos recursos para la teoría, pero la complejidad real aparece cuando esos conceptos se aplican a un sistema donde cada milisegundo importa: un Order Management System (OMS) bajo un modelo SaaS Multi-Tenant.

Un OMS no es un SaaS convencional: no solo almacena información, sino que toma decisiones de negocio en tiempo real —disponibilidad de inventario, método de entrega, reglas comerciales, costos y tiempos de envío— que impactan directamente la experiencia del comprador.

Y aquí aparece el verdadero desafío: quien espera esa respuesta muchas veces es el consumidor final navegando en un e-commerce, no solo el cliente de la plataforma. Cada consulta debe resolverse en milisegundos, incluso cuando varias empresas usan la misma plataforma simultáneamente con reglas, catálogos y tráfico completamente distintos.

Construir esta arquitectura no consiste en agregar un tenant_id a las tablas o elegir entre base de datos compartida o por cliente. La verdadera dificultad está en escalar, aislar cargas y mantener baja latencia para todos los tenants — y esas son las decisiones que quiero compartir en este artículo.

## ¿Por qué un OMS es un caso tan particular?

Antes de hablar de arquitectura Multi-Tenant, vale la pena entender qué es un **Order Management System (OMS)** y por qué representa un desafío muy diferente al de otros sistemas empresariales.

En términos simples, un OMS administra el ciclo de vida de una orden de venta, sin importar el canal por el que fue generada. Una orden puede provenir de un e-commerce, una tienda física, un marketplace o cualquier otro canal de venta.

Sin embargo, un OMS moderno hace mucho más que gestionar órdenes. Antes de permitir una venta debe responder, en cuestión de milisegundos, preguntas como:

- ¿Existe inventario disponible?
- ¿Desde dónde puede despacharse?
- ¿Qué reglas de negocio aplican?
- ¿Cuál es el costo y tiempo de entrega?
- ¿Cómo debe cumplirse la orden?

Para responder estas preguntas, un OMS se integra con múltiples sistemas como ERP, WMS, PIM, POS, plataformas de e-commerce y transportadoras. Toda esta información cambia constantemente y debe consolidarse en tiempo real para tomar decisiones correctas.

Pero la verdadera complejidad aparece cuando cada cliente opera de forma diferente. Cada empresa tiene sus propias reglas de inventario, abastecimiento, logística y cumplimiento de pedidos. Lo que funciona para un cliente puede ser completamente diferente para otro, incluso dentro de la misma industria.

Esa combinación de decisiones en tiempo real, múltiples integraciones y reglas de negocio altamente personalizadas convierte al OMS en un excelente caso de estudio para hablar de arquitecturas Multi-Tenant. Porque el reto no era únicamente aislar la información de cada cliente, sino construir una plataforma capaz de adaptarse a formas de operar completamente distintas sin perder rendimiento ni escalabilidad.

## La primera gran decisión: ¿qué significa realmente un tenant?

Uno de los conceptos más repetidos cuando se habla de arquitecturas Multi-Tenant es que un *tenant* representa a un cliente dentro de la plataforma. En teoría suena sencillo: múltiples organizaciones comparten una misma aplicación y cada una accede únicamente a su propia información.

Existen diferentes estrategias para lograr este aislamiento. Algunas organizaciones optan por una base de datos completamente independiente para cada cliente (*Database per Tenant*). Otras utilizan una única base de datos con esquemas independientes (*Schema per Tenant*). Y probablemente el modelo más conocido consiste en compartir la misma base de datos utilizando un identificador de tenant en todas las entidades (*Shared Database with Tenant Identifier*).

Cada enfoque tiene ventajas y desventajas en términos de costo, mantenimiento, aislamiento, escalabilidad y operación.

Sin embargo, muy pronto descubrimos que nuestro primer problema no era decidir cuál de estos modelos utilizar. El verdadero reto era responder una pregunta mucho más importante:

**¿Qué representa realmente un tenant dentro de nuestra plataforma?**

En un escenario ideal podríamos decir que un tenant equivale a una empresa. Pero la realidad de los clientes Enterprise es mucho más compleja.

Una organización puede estar conformada por múltiples compañías, operar en diferentes países, administrar varias marcas comerciales, manejar cientos de tiendas físicas, centros de distribución y canales digitales, además de tener procesos completamente diferentes entre una unidad de negocio y otra.

Incluso recursos que parecen evidentes, como el inventario, pueden comportarse de maneras distintas dependiendo del cliente. Algunas empresas comparten inventario entre marcas, otras mantienen inventarios completamente independientes; algunas permiten abastecimiento cruzado entre tiendas mientras otras lo prohíben por políticas internas.

Esto nos llevó a comprender que el modelo de negocio debía ser mucho más flexible que una simple relación **empresa = tenant**.

> [!KEY]
> Una sola empresa puede representar múltiples compañías, países, marcas y unidades de negocio, cada una con procesos e inventarios completamente distintos. El modelo **empresa = tenant** se rompe muy rápido en contextos Enterprise.

Pero aún quedaba una decisión mucho más importante.

### ¿El tenant solamente representa el negocio?

Hasta este punto pareciera que únicamente debemos preocuparnos por segmentar la información de los clientes.

Pero apareció otra pregunta.

¿Qué ocurre cuando el crecimiento de un tenant también comienza a afectar los costos de infraestructura?

La teoría sobre Multi-Tenant suele centrarse en el aislamiento de datos, pero rara vez habla del costo de operar una plataforma SaaS.

Imaginemos un microservicio de inventario ejecutándose sobre una base de datos administrada como Amazon Aurora. Si todos los clientes comparten el mismo clúster, ¿cómo distribuir el costo de esa infraestructura?

¿Debe pagar lo mismo un cliente que procesa mil órdenes al día que otro que procesa treinta mil? ¿Qué ocurre cuando un solo tenant consume la mayor parte del CPU, las conexiones, el almacenamiento o las operaciones de lectura y escritura?

Estas preguntas terminaron influyendo mucho más en nuestra arquitectura que la propia estrategia de persistencia.

### El tenant desde la perspectiva de la infraestructura

Fue entonces cuando dejamos de pensar en un único concepto de tenant.

Comenzamos a analizar el tenant desde dos perspectivas completamente diferentes.

| Perspectiva | Pregunta que responde |
|-------------|-----------------------|
| **Negocio** | ¿Cómo aislamos la información y las reglas de cada organización? |
| **Infraestructura** | ¿Dónde vive ese tenant y cómo distribuimos los recursos y costos de operación? |

Son problemas distintos y, por lo tanto, requieren decisiones de arquitectura distintas.

La mayoría de la documentación sobre Multi-Tenant se enfoca en cómo segmentar la información dentro de la aplicación: una base de datos por cliente, múltiples esquemas o una única base de datos compartida mediante un `tenant_id`. Todas estas estrategias son completamente válidas y resuelven muy bien el aislamiento lógico de la información.

Sin embargo, nosotros decidimos agregar un nivel adicional de aislamiento.

En lugar de pensar únicamente en **cómo separar los datos**, comenzamos a preguntarnos **cómo separar también la infraestructura**.

Nuestra arquitectura quedó dividida en dos niveles claramente diferenciados:

> [!KEY]
> **Multitenancy lógico** — aísla la información y las reglas de negocio de cada tenant dentro de la aplicación.
>
> **Multitenancy de infraestructura** — decide dónde vive físicamente cada tenant y qué recursos cloud (cuentas AWS, clústeres, bases de datos) utilizará.

---

```mermaid
flowchart TB
    CP["Control Plane<br/>Tenant Registry Service"]
    ORG["AWS Organization"]

    CP --> ORG

    ORG --> ENT["Enterprise Account"]
    ORG --> SH1["Shared Account"]
    ORG --> SH2["Shared Account"]

    subgraph ENT_GROUP[" "]
        ENT --> SM["SafeMarket"]
        SM --> CO["Colombia"]
        SM --> PE["Perú"]
        SM --> EC["Ecuador"]
    end

    subgraph SH1_GROUP[" "]
        SH1 --> FV["Farmavida"]
    end

    subgraph SH2_GROUP[" "]
        SH2 --> MK["Market's"]
        SH2 --> PS["PetShop"]
        SH2 --> DOTS["..."]
    end
```

---

Como puede observarse en el diagrama, un tenant deja de ser una sola cosa.

Por un lado sigue existiendo el tenant de negocio: la organización, sus marcas, sus países, sus reglas comerciales.

Por otro lado aparece el tenant de infraestructura: la unidad que determina dónde vive ese negocio dentro de la nube, qué recursos consume y cómo se reparten sus costos.

Uno resuelve el aislamiento de la información. El otro resuelve el aislamiento —y el costo— de la infraestructura.


Hasta ese momento pensábamos que el reto consistía en separar correctamente la información de cada cliente.

Sin embargo, la experiencia nos mostró que el verdadero desafío era mucho más amplio.

> [!INSIGHT]
> Un tenant no solamente representa una organización dentro del negocio. También representa una unidad de consumo de infraestructura, costos, capacidad de crecimiento y operación.
>
> Comprender esa diferencia cambió completamente nuestra forma de diseñar la plataforma.

En el siguiente artículo profundizaré en cómo este concepto nos llevó a construir un **Control Plane**, encargado de administrar toda la infraestructura, el ciclo de vida y la distribución de recursos de cada tenant dentro del SaaS.