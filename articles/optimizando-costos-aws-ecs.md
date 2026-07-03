---
title: "Cómo reduje un 40% los costos de AWS optimizando ECS Task Definitions"
description: "Un caso real de revisión de configuraciones ECS, rightsizing de recursos y uso de Spot Instances para reducir el gasto en infraestructura de un SaaS con miles de usuarios activos."
date: "2026-06-15"
tags: ["AWS", "ECS", "DevOps", "Cloud Cost Optimization"]
author: "Julián Valdés Bello"
published: false
---

Cuando asumí el rol de Arquitecto de Software en un SaaS B2B multi-tenant, lo primero que hice fue revisar la factura de AWS. Lo que encontré fue una mezcla de task definitions sobredimensionadas, ausencia de auto scaling reactivo y nada de Spot Instances. En tres meses bajamos la factura un 40% sin degradar disponibilidad.

## El punto de partida

El sistema corría sobre ECS Fargate con varios servicios: una API principal en Go, workers de procesamiento de colas SQS, y un servicio de notificaciones. Cada servicio tenía asignado lo mismo: **1 vCPU y 2 GB de RAM por tarea**, porque "así lo dejó el anterior equipo".

```bash
# Perfil de recursos real (promedio en producción)
API principal:      cpu=18%  memory=340MB
Workers SQS:        cpu=6%   memory=180MB
Notificaciones:     cpu=3%   memory=90MB
```

Estábamos pagando por más del triple de lo que realmente usábamos.

## Paso 1: Medir antes de tocar

Antes de cambiar cualquier configuración, activé **Container Insights** en el cluster y dejé correr las métricas durante dos semanas. Esto me dio:

- Percentil 95 de CPU y memoria por servicio
- Picos de tráfico por hora del día
- Correlación entre carga de SQS y uso de workers

> No hagas rightsizing basado en promedios. Usa el percentil 95 o el 99 para servicios que manejan picos. Un promedio bajo con un pico alto te tumba el servicio.

## Paso 2: Rightsizing de task definitions

Con datos en mano, ajusté cada servicio:

| Servicio | CPU antes | CPU después | RAM antes | RAM después |
|---|---|---|---|---|
| API principal | 1024 | 512 | 2048 MB | 1024 MB |
| Workers SQS | 1024 | 256 | 2048 MB | 512 MB |
| Notificaciones | 1024 | 256 | 2048 MB | 256 MB |

En Fargate, la combinación de CPU y RAM determina el precio por hora. Pasar de `1vCPU / 2GB` a `0.5vCPU / 1GB` en la API principal significó **reducir ese servicio a la mitad del costo**.

## Paso 3: Auto scaling basado en métricas reales

El servicio de workers tenía siempre 3 réplicas corriendo, incluso a las 3 AM con la cola vacía. Implementé **Step Scaling** basado en `ApproximateNumberOfMessagesVisible` de SQS:

```json
{
  "ScalingPolicies": [
    {
      "MetricName": "ApproximateNumberOfMessagesVisible",
      "Thresholds": [
        { "value": 0,   "desiredCount": 1 },
        { "value": 100, "desiredCount": 3 },
        { "value": 500, "desiredCount": 8 }
      ]
    }
  ]
}
```

Con esto, en horario nocturno los workers bajaban a **1 réplica** y escalaban automáticamente según carga real.

## Paso 4: Spot Instances para workers

Los workers de procesamiento de colas son tolerantes a interrupciones (SQS reencola mensajes automáticamente si el consumer muere). Los moví a **Fargate Spot**, que cuesta entre un 50% y 70% menos que Fargate estándar.

```yaml
# Task definition: capacityProviderStrategy
capacityProviderStrategy:
  - capacityProvider: FARGATE_SPOT
    weight: 4
    base: 0
  - capacityProvider: FARGATE
    weight: 1
    base: 1  # Al menos 1 tarea en Fargate estándar como respaldo
```

La API principal y las notificaciones se quedaron en Fargate estándar — no valen el riesgo de interrupción para servicios sincronos con usuarios activos.

## Resultado final

Después de tres meses con todos los cambios estabilizados:

- **Factura mensual de ECS**: bajó de ~$2,800 a ~$1,650 USD
- **Disponibilidad**: sin ningún incidente relacionado con los cambios
- **Latencia p95 de la API**: mejoró ligeramente al tener menos contención de recursos en el host

El 40% de ahorro vino principalmente de tres fuentes:

1. **Rightsizing** (~18% de reducción)
2. **Auto scaling nocturno** (~12% de reducción)
3. **Spot Instances en workers** (~10% de reducción)

## Lo que aprendí

La sobreasignación de recursos en cloud es silenciosa y cara. Nadie la reporta como un bug porque "el sistema funciona bien". Pero esa reserva de seguridad innecesaria se convierte en miles de dólares al año.

Si tienes ECS en producción y no has revisado tus task definitions en los últimos 6 meses, te recomiendo empezar por activar Container Insights hoy mismo. Los datos no mienten.

---

*¿Tienes un caso similar o quieres profundizar en algún paso? Conéctate conmigo en [LinkedIn](https://www.linkedin.com/in/julian-valdes-bello-76aa21175/).*
