# 🌸 Sakura Salon — Frontend

> Una aplicación web moderna, elegante y receptiva diseñada para ofrecer una experiencia digital inmersiva en el mundo de la belleza y el bienestar, combinando la estética minimalista japonesa con la funcionalidad moderna.

[![Visitar en Vivo](https://img.shields.io/badge/🔗_Ver_Plataforma-En_Vivo-ffb7c5?style=for-the-badge&logo=vercel&logoColor=white)](https://tu-enlace-aqui.com)  
*Explora la plataforma frontend de Sakura Salon y descubre una nueva forma de gestionar tu bienestar.*

---

## Descripción del Proyecto

**Sakura Salon** es la interfaz frontend desarrollada para optimizar la interacción entre los clientes y el salón de belleza. Su objetivo principal es ofrecer una interfaz intuitiva donde los usuarios puedan:
* Explorar los tratamientos disponibles con total fluidez.
* Conocer a detalle los servicios especializados del salón.
* Reservar citas en línea de forma rápida, guiada y segura.
* Validar sus datos en tiempo real mediante formularios robustos y seguros.

---

## Características Principales

| Módulo / Característica | Descripción |
| :--- | :--- |
|  **Diseño Responsivo e Inmersivo** | Adaptado perfectamente para dispositivos móviles, tabletas y ordenadores de escritorio con una interfaz fluida basada en **Tailwind CSS**. |
|  **Sistema de Reservas Interactivo** | Flujo paso a paso intuitivo para agendar citas, elegir servicios específicos y seleccionar horarios disponibles en tiempo real. |
|  **Catálogo de Servicios Detallado** | Vista completa de precios, tiempos estimados de atención y descripciones detalladas de cada tratamiento especializado. |
|  **Validaciones de Formularios Robustas** | Control exhaustivo de entradas de usuario en tiempo real para el registro, inicio de sesión y agendamiento de citas. |


---

## Servicios Ofrecidos

El salón ofrece tratamientos especializados enfocados en realzar la belleza natural de cada cliente:

1. **Cabello**  
   * Cortes personalizados, tintes de alta calidad, *balayage*, tratamientos de hidratación profunda y peinados exclusivos para ocasiones especiales.
2. **Manicure**  
   * Esmaltado permanente, uñas acrílicas, manicura clásica y diseños personalizados de tendencia.
3. **Cejas** 
   * Diseño, depilación, perfilado y laminado de cejas para definir y enmarcar la mirada.
4. **Lifting**   
   * Lifting de pestañas y tratamientos avanzados de potenciación de la mirada.

---

## Validaciones de Formularios

Para garantizar la integridad de los datos y una experiencia de usuario impecable, todos los formularios de la aplicación (como reservas y contacto) cuentan con estrictas reglas de validación:

* **Campos Requeridos:** Bloqueo de envío automático si existen campos obligatorios vacíos.
* **Formato de Correo Electrónico:** Validación mediante expresiones regulares (`Regex`) para asegurar correos legítimos (`usuario@dominio.com`).
* **Validación de Teléfono:** Comprobación rigurosa de longitud y formato numérico regional.
* **Fechas y Horarios en Reservas:** Restricciones lógicas para impedir la selección de fechas pasadas o horarios fuera de la jornada laboral del salón.
* **Manejo de Errores Visuales:** Mensajes de error en tiempo real debajo de cada campo afectado con indicadores visuales claros, bloqueando el envío hasta corregir las inconsistencias.

---

